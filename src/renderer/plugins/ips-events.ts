import { ipcRenderer } from "electron";
import Project from "~/models/Project";
import Repository from "~/models/Repository";
import { SnackbarProgrammatic as Snackbar } from "buefy";
import Task from "~/models/Task";

export default function(ctx, { app }) {
  ipcRenderer.on("menu:new-task", () => {
    if (ctx.route.name.startsWith("projects.project_id.tasks")) {
      Task.insertDefault(ctx.route.params.project_id).then(resp => {
        ctx.app.router.push({
          name: "projects.project_id.tasks.index.task_id",
          params: {
            project_id: ctx.route.params.project_id,
            task_id: resp.tasks[0].$id
          }
        });
      });
    } else {
      Snackbar.open("Select a project first");
    }
  });

  ipcRenderer.on("menu:new-project", () => {
    Project.insertDefault().then(r => {});
  });

  ipcRenderer.on("menu:new-repository", () => {
    app.router.push("/repositories");
    Repository.insertDefault().then(r => {});
  });

  ipcRenderer.on("route:push", (event, args) => {
    app.router.push(args.route);
  });
}
