import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";
import Task from "~/models/Task";

export default class Project extends Model {
  static entity = "projects";

  static primaryKey = "id";

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      name: this.string(""),
      description: this.string(""),
      icon: this.string("star"),
      tasks: this.hasMany(Task, "project_id"),
    };
  }

  static iconList() {
    return [
      "alert-circle",
      "application",
      "archive",
      "at",
      "bank",
      "calendar",
      "chess-queen",
      "clock",
      "cloud",
      "star",
    ];
  }

  static async insertDefault() {
    return await this.insert({
      data: {
        name: "My First Project",
        description: "general tasks for my First Project",
      },
    });
  }

  name: string | undefined;
  description: string | undefined;
  icon: string;
  is_default: boolean | undefined;
}
