import { app, BrowserWindow, ipcMain, Menu, Tray as ETray } from "electron";
import path from "path";
import Platform from "./Platform";

const positioner = require("electron-traywindow-positioner");

export default class Tray {
  browserWindow: BrowserWindow;
  mainBrowserWindow: BrowserWindow;
  port: number;
  tray: ETray;

  constructor(mainBrowserWindow: BrowserWindow, port = 3000) {
    this.browserWindow = null;
    this.mainBrowserWindow = mainBrowserWindow;
    this.port = port;
    this.tray = null;
  }

  create() {
    this.tray = new ETray(this.getTrayIconPath());

    this.tray.on("click", event => {
      event.preventDefault();
      this.showTrayWindow();
    });

    this.tray.on("right-click", () => {
      const that = this;
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Show",
          click() {
            that.mainBrowserWindow.show();
          }
        },
        {
          label: "Close",
          click() {
            app.exit();
          }
        }
      ]);
      this.tray.setContextMenu(contextMenu);
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
        allowRunningInsecureContent: false,
        devTools: false
      }
    });

    this.browserWindow.loadURL(`http://localhost:${this.port}/tray`);

    // this.browserWindow.webContents.openDevTools();

    this.browserWindow.on("blur", () => {
      this.browserWindow.hide();
    });

    this.browserWindow.on("show", () => {
      this.browserWindow.focus();
    });

    ipcMain.on("route:push", (event, args) => {
      this.browserWindow.hide();
      this.mainBrowserWindow.webContents.send("route:push", args);
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
    const platform = Platform.get()
    if (platform === "macOS") {
      return path.join(__dirname, "../assets/tray-icon@16x16.png")
    }
    return path.join(__dirname, "../assets/tray-icon@400x400.png")
  }
}
