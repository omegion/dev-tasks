import PushNotification from "~/services/notification/PushNotification";
import PullRequest from "~/models/PullRequest";
import { ipcRenderer } from "electron";
import PullRequestTask from "~/models/PullRequestTask";

export default class NewPullRequestComment extends PushNotification {
  pullRequest: PullRequest;

  constructor(pullRequest: PullRequest) {
    const title = "New PR Comment";
    const body = `New Comment on ${pullRequest.name}`;
    super(title, body);

    this.pullRequest = pullRequest;
  }

  send() {
    const pullWithTask = PullRequest.query()
      .where("id", this.pullRequest.id)
      .with("tasks")
      .first();

    if (pullWithTask && pullWithTask.tasks.length > 0) {
      const to = {
        name: "projects.project_id.tasks.index.task_id",
        params: {
          project_id: pullWithTask.tasks[0].project_id,
          task_id: pullWithTask.tasks[0].id
        }
      };

      super.onClick(event => {
        ipcRenderer.send("route:push", { route: to });
      });
    }

    super.send();
  }
}
