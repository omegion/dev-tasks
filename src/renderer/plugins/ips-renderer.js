import { ipcRenderer } from "electron";
import Project from "~/models/Project";
import Repository from "~/models/Repository";

export default function({ app }) {
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
