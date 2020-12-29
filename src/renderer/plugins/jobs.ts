import RepositorySyncJob from "~/services/jobs/RepositorySyncJob.ts";
import Repository from "~/models/Repository.ts";
import Job from "~/services/jobs/Job";

let jobs: Array<Job> = [];

const syncRepositories = () => {
  const repositories = Repository.query()
    .where("sync_frequency", value => value > 0)
    .get();

  repositories.forEach(repo => {
    const repositorySyncJob = new RepositorySyncJob(repo);
    repositorySyncJob.run();
    jobs.push(repositorySyncJob);
  });
};

export default function(app) {
  syncRepositories();
  app.$emitter.on("repository:updated", e => {
    jobs.forEach(job => {
      job.stop();
    });
    syncRepositories();
    console.log("re-synced repositories");
  });
}
