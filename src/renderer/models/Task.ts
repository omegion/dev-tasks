import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";
import Tag from "~/models/Tag";
import TagTask from "~/models/TagTask";
import PullRequest from "~/models/PullRequest";
import PullRequestTask from "~/models/PullRequestTask";
import moment from "moment";

export default class Task extends Model {
  static entity = "tasks";

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      name: this.string(""),
      blocks: this.attr(this.defaultBlocks()),
      status: this.string("in_progress"),
      priority: this.number(1),
      estimate: this.number(10),
      startedAt: this.string(null),
      endedAt: this.string(null),
      updatedAt: this.string(null),
      createdAt: this.string(null),

      project_id: this.attr(null),
      parent_id: this.attr(null),

      pull_requests: this.belongsToMany(
        PullRequest,
        PullRequestTask,
        "task_id",
        "pull_request_id"
      ),
      tags: this.belongsToMany(Tag, TagTask, "task_id", "tag_id"),
      dependencies: this.hasMany(Task, "parent_id"),
    };
  }

  async deleteWithRelations() {
    const task = this.$query().with("pull_requests").find(this.id);
    // @ts-ignore
    task.pull_requests.forEach((pull) => {
      pull.$delete();
    });
    return await task.$delete();
  }

  static statusList() {
    return [
      {
        slug: "in_progress",
        name: "In Progress",
        type: "is-primary",
      },
      {
        slug: "done",
        name: "Done",
        type: "is-success",
      },
      {
        slug: "blocked",
        name: "Blocked",
        type: "is-danger",
      },
    ];
  }

  static priorityList() {
    return [
      {
        value: 4,
        name: "Highest",
        icon: "arrow-up",
        type: "is-danger",
      },
      {
        value: 3,
        name: "High",
        icon: "arrow-up",
        type: "is-danger",
      },
      {
        value: 2,
        name: "Medium",
        icon: "arrow-up",
        type: "is-warning",
      },

      {
        value: 1,
        name: "Low",
        icon: "arrow-down",
        type: "is-success",
      },
      {
        value: 0,
        name: "Lowest",
        icon: "arrow-down",
        type: "is-success",
      },
    ];
  }

  static defaultBlocks() {
    return [
      {
        type: "checklist",
        data: {
          items: [
            {
              text: "Build the binary.",
              checked: true,
            },
            {
              text: "Apply the Terraform",
              checked: false,
            },
          ],
        },
      },
    ];
  }

  static async insertDefault(project_id: string) {
    await this.insert({
      data: {
        name: "Example Task",
        project_id: project_id,
        startedAt: moment().toDate().toISOString(),
        updatedAt: moment().toDate().toISOString(),
        createdAt: moment().toDate().toISOString(),
      },
    });
  }

  id: string;
  name: string;
  blocks: any;
  description: string | null | undefined;
  status: "in_progress" | "done" | "blocked";
  priority: number;
  estimate: number;
  updatedAt: string;
  startedAt: string;
  endedAt: string;
  project_id: string;
  pull_requests: PullRequest[];
}
