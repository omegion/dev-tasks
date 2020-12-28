import { BrowserWindow, ipcMain } from "electron";

export default class MainWindow {
  browserWindow: BrowserWindow;
  port: number;

  constructor(port = 3000) {
    this.browserWindow = null;
    this.port = port;
  }

  create() {
    this.browserWindow = new BrowserWindow({
      height: 800,
      width: 1280,
      webPreferences: {
        webSecurity: this.isProduction(),
        allowRunningInsecureContent: false,
        nodeIntegration: true
      }
    });

    this.browserWindow.on("close", evt => {
      evt.preventDefault();
      this.browserWindow.hide();
    });

    this.browserWindow.on("closed", evt => {
      this.browserWindow = null;
    });

    ipcMain.on("route:push", (event, args) => {
      this.browserWindow.show();
    });
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
