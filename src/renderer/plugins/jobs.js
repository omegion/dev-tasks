import SyncJob from '~/services/jobs/PullRequest/SyncJob'

export default function ({ redirect }) {
  const pullRequestSyncJob = new SyncJob()
  pullRequestSyncJob.run()
}
