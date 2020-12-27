/* globals INCLUDE_RESOURCES_PATH */
import { app, Menu } from 'electron'
import vueDevtools from 'vue-devtools'
import MainMenu from './lib/menu'
import mainWinHandler from './mainWindow'

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) { console.error('[Main-process]: Resources path is undefined') }

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  vueDevtools.install()
  const mainMenu = MainMenu(mainWinHandler.browserWindow)
  const menu = Menu.buildFromTemplate(mainMenu)
  Menu.setApplicationMenu(menu)
})

// Load here all startup windows
require('./mainWindow')
