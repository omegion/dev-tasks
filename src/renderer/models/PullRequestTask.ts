import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";

export default class PullRequestTask extends Model {
  static entity = "pull_request_task";

  static primaryKey = ["pull_request_id", "task_id"];

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      pull_request_id: this.attr(null),
      task_id: this.attr(null),
    };
  }

  pull_request_id: string | undefined;
  task_id: string | undefined;
}
