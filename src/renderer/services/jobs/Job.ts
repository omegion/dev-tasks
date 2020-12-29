import { CronJob } from "cron";

export default class Job {
  run() {}
  stop() {}
  getJob(): CronJob {
    // @ts-ignore
    return new CronJob(`0 * * * * *`);
  }
}
