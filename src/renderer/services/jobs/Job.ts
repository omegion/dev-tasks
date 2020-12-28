import { CronJob } from "cron";

export default class Job {
  run() {}

  getJob(): CronJob {
    // @ts-ignore
    return new CronJob(`0 * * * * *`);
  }
}
