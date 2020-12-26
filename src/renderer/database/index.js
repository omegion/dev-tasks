import { Database } from '@vuex-orm/core'
import Task from '@/models/Task'
import Setting from '@/models/Setting'
import Tag from '@/models/Tag'
import TagTask from '@/models/TagTask'
import Project from '~/models/Project'
import Repository from '~/models/Repository'
import PullRequest from '~/models/PullRequest'
import PullRequestTask from '~/models/PullRequestTask'

const database = new Database()

database.register(Project)
database.register(Task)
database.register(Setting)
database.register(Tag)
database.register(TagTask)
database.register(Repository)
database.register(PullRequest)
database.register(PullRequestTask)

export default database
