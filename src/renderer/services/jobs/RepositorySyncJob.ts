import PullRequest from "~/models/PullRequest";
import Job from "~/services/jobs/Job.ts";
import Repository from "~/models/Repository";
import { CronJob, CronTime } from "cron";
import { SnackbarProgrammatic as Snackbar } from "buefy";

export default class RepositorySyncJob extends Job {
  repository: Repository;
  job: CronJob;

  constructor(repository: Repository) {
    super();

    this.repository = repository;
    this.job = this.getJob();
  }

  run() {
    this.job.setTime(
      new CronTime(`0 */${this.repository.sync_frequency} * * * *`)
    );
    this.job.addCallback(() => {
      this.execute();
    });
    this.job.start();
  }

  execute() {
    const pulls = PullRequest.query()
      .where("repository_id", this.repository.id)
      .where("state", "open")
      .whereHasNot("tasks", query => {
        query.where("status", "done");
      })
      .all();

    pulls.forEach(pull => {
      pull.sync().catch(err => {
        console.error(err);
        Snackbar.open({
          duration: 8000,
          message: `Pull request sync failed: ${err.toString()}`,
          type: "is-danger",
          actionText: "Retry",
          onAction: () => {
            pull.sync().catch(() => {
              console.error(err);
            });
          }
        });
      });
    });
  }

  stop() {
    this.job.stop();
  }
}
