import PullRequest from "~/models/PullRequest";
import Job from "~/services/jobs/Job.ts";
import Repository from "~/models/Repository";
import { CronJob, CronTime } from "cron";
import { SnackbarProgrammatic as Snackbar } from "buefy";

export default class SyncJob extends Job {
  pullRequests: PullRequest[];
  job: CronJob;

  constructor() {
    super();

    this.job = this.getJob();
    this.pullRequests = this.getPullRequest();
  }

  getPullRequest(): PullRequest[] {
    return PullRequest.query().where("state", "open").all();
  }

  run() {
    this.pullRequests.forEach((pull) => {
      const frequency = this._getSyncFrequency(pull.repository_id);
      if (frequency) {
        this.startCron(frequency, pull);
      }
    });
    console.log("Started Pull Request sync jobs.");
  }

  startCron(frequency: number, pull: PullRequest) {
    const that = this;
    this.job.setTime(new CronTime(`0 */${frequency} * * * *`));
    this.job.addCallback(function () {
      that.execute(pull);
    });
    this.job.start();
  }

  execute(pull: PullRequest) {
    pull.sync().catch((err) => {
      this.job.stop();
      console.error(err);
      Snackbar.open({
        duration: 8000,
        message: `Pull request sync failed: ${err.toString()}`,
        type: "is-danger",
        actionText: "Retry",
        onAction: () => {
          this.execute(pull);
        },
      });
    });
  }

  _getSyncFrequency(repository_id) {
    const repo = Repository.find(repository_id);

    return repo.sync_frequency;
  }
}
