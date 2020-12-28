/* globals INCLUDE_RESOURCES_PATH */
import { app, Menu } from 'electron'
import MainMenu from './lib/menu'
import mainWinHandler from './mainWindow'
import { createTray } from './tray'
import MainWindow from './services/MainWindow.ts'

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) {
  console.error('[Main-process]: Resources path is undefined')
}

function initTray () {
  createTray(mainWinHandler)
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") app.quit();
})

app.on('ready', () => {
  initTray()
  const mainMenu = MainMenu(mainWinHandler.browserWindow)
  const menu = Menu.buildFromTemplate(mainMenu)
  Menu.setApplicationMenu(menu)
})

const holder = new MainWindow()

// Load here all startup windows
require('./mainWindow')
