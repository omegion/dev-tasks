import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";

export default class TagTask extends Model {
  static entity = "tagsTask";

  static primaryKey = ["tag_id", "task_id"];

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      tag_id: this.attr(null),
      task_id: this.attr(null),
    };
  }

  tag_id: string | undefined;
  task_id: string | undefined;
}
