import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import Project from "~/models/Project";

export default defineNuxtMiddleware((ctx) => {
  const project =
    Project.query().where("is_default", true).first() ||
    Project.query().first();
  if (project) {
    return ctx.redirect({
      name: "projects.project_id.tasks",
      params: { project_id: project.$id },
    });
  } else {
    return Project.insertDefault()
      .then((data) => {
        console.log(data.projects[0].$id);
        return ctx.redirect({
          name: "projects.project_id.tasks",
          params: { project_id: data.projects[0].$id },
        });
      })
      .catch((err) => {
        console.error(err);
        return ctx.next();
      });
  }
});
