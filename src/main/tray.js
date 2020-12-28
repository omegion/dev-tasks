import path from 'path'
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray
} from 'electron'

let tray
let trayWindow

const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/#tray'
    : `file://${__dirname}/index.html#tray`

function createTray (mainWindow) {
  console.log(path.join(__dirname, 'trayTemplate.png'))
  tray = new Tray(path.join(__dirname, 'trayTemplate.png'))

  tray.on('click', () => {
    showTray()
  })

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click () {
          console.log(mainWindow)
          mainWindow.browserWindow.show()
        }
      },
      {
        label: 'Close',
        click () {
          app.quit()
        }
      }
    ])
    tray.setContextMenu(contextMenu)
  })

  createTrayWindow()

  ipcMain.on('preferences:assistant:shortcut', (e, shortcuts) => {
    globalShortcut.unregister(shortcuts.old)
    globalShortcut.register(shortcuts.new, () => {
      showTray()
    })
  })
}

function createTrayWindow () {
  trayWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  })

  trayWindow.loadURL(winURL)

  trayWindow.on('blur', () => {
    trayWindow.hide()
    trayWindow.webContents.send('tray:hide')
  })

  trayWindow.on('show', () => {
    trayWindow.focus()
    trayWindow.webContents.send('tray:show')
  })

  ipcMain.on('tray:hide', () => {
    trayWindow.hide()
  })
}

function showTray () {
  const trayWindowBounds = trayWindow.getBounds()

  console.log('window', trayWindowBounds)
  console.log('tray', tray.getBounds())
  let { x, y, width, height } = tray.getBounds()
  x = x - (trayWindowBounds.width / 2 - width / 2)
  y = y + height + 3

  // trayWindow.setBounds({ x, y });
  trayWindow.show()
}

function destroyTray () {
  trayWindow.destroy()
  tray.destroy()
}

export { createTray, createTrayWindow, showTray, destroyTray }
