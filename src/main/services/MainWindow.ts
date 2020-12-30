import { app, BrowserWindow, ipcMain } from "electron";
import Platform from "./Platform";

export default class MainWindow {
  browserWindow: BrowserWindow;
  port: number;

  constructor(port = 3000) {
    this.browserWindow = null;
    this.port = port;
  }

  async create() {
    this.browserWindow = new BrowserWindow({
      height: 800,
      width: 1280,
      webPreferences: {
        webSecurity: this.isProduction(),
        allowRunningInsecureContent: false,
        contextIsolation: false,
        nodeIntegration: true
      }
    });

    await this.browserWindow.loadURL(`http://localhost:${this.port}`);

    this.browserWindow.on("close", evt => {
      evt.preventDefault();
      this.browserWindow.hide();

      if (Platform.isMac()) {
        app.dock.hide();
      }
    });

    this.browserWindow.on("show", evt => {
      if (Platform.isMac()) {
        app.dock.show();
      }
    });

    ipcMain.on("route:push", (event, args) => {
      this.browserWindow.show();
    });
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
