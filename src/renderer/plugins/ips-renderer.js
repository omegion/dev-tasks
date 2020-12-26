import { ipcRenderer } from 'electron'
import Project from '~/models/Project'
import Repository from '~/models/Repository'

export default function ({ app }) {
  ipcRenderer.on('menu:new-project', () => {
    Project.insertDefault().then(r => {})
  })
  ipcRenderer.on('menu:new-repository', () => {
    app.router.push('/repositories').then(r => {})
    Repository.insertDefault().then(r => {})
  })
}
