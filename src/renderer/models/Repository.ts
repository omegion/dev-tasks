import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";
import { Octokit } from "@octokit/rest";
import PullRequest from "~/models/PullRequest";

export default class Repository extends Model {
  static entity = "repositories";

  static primaryKey = "id";

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      name: this.string(""),
      repository: this.string(""),
      owner: this.string(""),
      sync_frequency: this.number(5),
      token: this.string(""),

      pull_requests: this.hasMany(PullRequest, "repository_id")
    };
  }

  get api() {
    return new Octokit({
      auth: this.token
    });
  }

  async pulls(state: string = "open") {
    return await this.api.pulls.list({
      repo: this.repository,
      owner: this.owner,
      // @ts-ignore
      state: state
    });
  }

  async pull(pull_number: number) {
    return await this.api.pulls.get({
      repo: this.repository,
      owner: this.owner,
      pull_number: pull_number
    });
  }

  async deleteWithRelations() {
    await PullRequest.delete(pull => pull.repository_id === this.id);
    return await this.$delete();
  }

  static syncFrequencyList() {
    return [
      {
        name: "Never",
        value: null
      },
      {
        name: "1 Minute",
        value: 1
      },
      {
        name: "5 Minutes",
        value: 5
      },
      {
        name: "10 Minutes",
        value: 10
      },
      {
        name: "30 Minutes",
        value: 30
      }
    ];
  }

  static async insertDefault() {
    await this.insert({
      data: {
        name: "Vue JS",
        owner: "vuejs",
        repository: "vue",
        token: ""
      }
    });
  }

  id: string;
  name: string;
  repository: string;
  owner: string;
  token: string;
  sync_frequency: number;
  pull_requests: PullRequest[];
}
