import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";
import Repository from "~/models/Repository";

export default class PullRequest extends Model {
  static entity = "pull_requests";

  static primaryKey = ["repository_id", "pull_number"];

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      name: this.string(null),
      pull_number: this.number(null),
      state: this.string(null),
      locked: this.boolean(null),
      merged: this.boolean(false),
      mergeable_state: this.string(null),
      comments_count: this.number(0),
      updatedAt: this.string(null),
      createdAt: this.string(null),
      repository_id: this.attr(null),
    };
  }

  async sync() {
    const repository = await Repository.find(this.repository_id);
    await repository.pull(this.pull_number).then(({ data }) => {
      PullRequest.update({
        where: (pull) => {
          return pull.id === this.id;
        },
        data: {
          name: data.title,
          state: data.state,
          locked: data.locked,
          merged: data.merged,
          mergeable_state: data.mergeable_state,
          comments_count: data.comments + data.review_comments,
          updatedAt: data.updated_at,
        },
      });
    });
  }

  get mergeStateIcon() {
    if (this.state === "closed") {
      return {
        icon: "close-circle",
        type: "is-grey",
        text: "Closed",
      };
    }

    if (this.mergeable_state === "clean") {
      return {
        icon: "check-circle",
        type: "is-success",
        text: "Clean",
      };
    }
    return {
      icon: "minus-circle",
      type: "is-danger",
      text: this.mergeable_state,
    };
  }

  id: string;
  name: string;
  pull_number: number;
  state: "open" | "closed";
  mergeable_state: string;
  mergable: boolean | null;
  repository_id: string;
}
