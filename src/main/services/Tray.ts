import { app, BrowserWindow, ipcMain, Menu, Tray as ETray } from "electron";
import path from "path";
import Platform from "./Platform";
import MainWindow from "./MainWindow";

const positioner = require("electron-traywindow-positioner");

export default class Tray {
  browserWindow: BrowserWindow;
  mainWindow: MainWindow;
  port: number;
  tray: ETray;
  contextMenu: Menu;

  constructor(mainWindow: MainWindow, contextMenu: Menu, port = 3000) {
    this.browserWindow = null;
    this.mainWindow = mainWindow;
    this.port = port;
    this.tray = null;
    this.contextMenu = contextMenu;
  }

  create() {
    this.tray = new ETray(this.getTrayIconPath());
    this.tray.setIgnoreDoubleClickEvents(true);

    this.tray.on("click", evt => {
      this.tray.setContextMenu(null);
      this.showTrayWindow();
    });

    this.tray.on("right-click", evt => {
      this.tray.setContextMenu(this.contextMenu);
      this.tray.popUpContextMenu();
    });

    this.createWindow();
  }

  createWindow() {
    this.browserWindow = new BrowserWindow({
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
        contextIsolation: false,
        allowRunningInsecureContent: false,
        devTools: false
      }
    });

    this.browserWindow.loadURL(`http://localhost:${this.port}/tray`);

    this.browserWindow.on("blur", () => {
      this.browserWindow.hide();
    });

    this.browserWindow.on("show", () => {
      this.browserWindow.focus();
    });

    this.browserWindow.on("close", evt => {
      evt.preventDefault();
      this.browserWindow.hide();
    });

    ipcMain.on("route:push", (event, args) => {
      this.browserWindow.hide();
      this.mainWindow.browserWindow.webContents.send("route:push", args);
    });
  }

  showTrayWindow() {
    const points = positioner.calculate(
      this.browserWindow.getBounds(),
      this.tray.getBounds()
    );

    this.browserWindow.setBounds(points);
    this.browserWindow.show();
  }

  getTrayIconPath() {
    return path.join(__dirname, "../assets/tray-icon.png");
  }
}
