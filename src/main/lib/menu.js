import os from 'os'

const { app, shell, dialog, BrowserWindow } = require('electron')
const { version, author } = require('../../../package.json')

const GITHUB_REPOSITORY = 'https://github.com/omegion/dev-tasks'

const isMac = process.platform === 'darwin'
const year = new Date().getFullYear()

if (isMac) {
  app.setAboutPanelOptions({
    applicationName: 'dev-tasks',
    applicationVersion: version,
    version,
    copyright: `${author} \n©2020-${year}`
  })
}

export default function MainMenu (browserWindow) {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CommandOrControl+N',
          click () {
            browserWindow.webContents.send('menu:new-project')
          }
        },
        {
          label: 'New Repository',
          accelerator: 'CommandOrControl+T',
          click () {
            browserWindow.webContents.send('menu:new-repository')
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CommandOrControl+Z',
          click (menuItem, focusedWin) {
            browserWindow.webContents.send('menu:undo')
            focusedWin.webContents.undo()
          },
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CommandOrControl+Z',
          click (menuItem, focusedWin) {
            browserWindow.webContents.send('menu:redo')
            focusedWin.webContents.redo()
          },
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CommandOrControl+X',
          click (menuItem, focusedWin) {
            browserWindow.webContents.send('menu:cut')
            focusedWin.webContents.cut()
          },
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CommandOrControl+C',
          click (menuItem, focusedWin) {
            browserWindow.webContents.send('menu:copy')
            focusedWin.webContents.copy()
          },
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          click (menuItem, focusedWin) {
            browserWindow.webContents.send('menu:paste')
            focusedWin.webContents.paste()
          },
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CommandOrControl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Release Notes',
          click () {
            shell.openExternal(`${GITHUB_REPOSITORY}/releases`)
          }
        },
        {
          label: 'View in GitHub',
          click () {
            shell.openExternal(`${GITHUB_REPOSITORY}`)
          }
        },
        {
          label: 'Report Issue',
          click () {
            shell.openExternal(`${GITHUB_REPOSITORY}/issues/new`)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'About',
          click () {
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              title: 'Dev Tools',
              message: 'Dev Tools',
              type: 'info',
              detail: `
              Version: ${version}
              Electron: ${process.versions.electron}
              Chrome: ${process.versions.chrome}
              Node.js: ${process.versions.node}
              V8: ${process.versions.v8}
              OS: ${os.type()} ${os.arch()} ${os.release()}
            `
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Developer Tools',
          accelerator: 'Alt+CommandOrControl+I',
          click () {
            browserWindow.webContents.openDevTools({ mode: 'detach' })
          }
        }
      ]
    }
  ]
}
