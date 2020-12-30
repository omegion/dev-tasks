import { app, BrowserWindow, Menu } from "electron";
import waitOn from "wait-on";
import express from "express";
import useragent from "express-useragent";
import { resolve } from "path";
import getPort from "get-port";
import MainWindow from "./MainWindow";
import MainMenu from "./Menu";
import Tray from "./Tray";
import Platform from "./Platform";

export default class Main {
  mainWindow: MainWindow;
  trayWindow: Tray;
  application: Electron.App;

  constructor(app: Electron.App) {
    this.application = app;
  }

  async run() {
    this.application.on("window-all-closed", () => {
      this.onWindowAllClosed();
    });
    this.application.on("ready", () => {
      this.onReady();
    });
  }

  async setupDev() {
    // Importing dev dependencies
    const devtools = await import("electron-devtools-installer");

    // Installing devtools
    // await devtools.default(devtools.VUEJS_DEVTOOLS);

    // Waiting for web server
    waitOn({ resources: [`http://localhost:3000`] }, this.setupWindows);
  }

  async setupProd() {
    const server = express();
    server.use(useragent.express());

    // Rejecting requests from browsers
    server.use((req, res, next) => {
      if (req.useragent.source.includes("Electron")) next();
      else res.end();
    });

    server.use(express.static(resolve(__dirname, "../renderer")));

    const port = await getPort();
    server.listen(port, "localhost", () => this.setupWindows(port));
  }

  setupWindows(port = 3000) {
    this.mainWindow = new MainWindow(port);
    this.trayWindow = new Tray(this.mainWindow.browserWindow, port);

    this.mainWindow.create();
    this.trayWindow.create();

    const mainMenu = new MainMenu(this.mainWindow.browserWindow);
    const menu = Menu.buildFromTemplate(mainMenu.menu);

    // Show doc for MacOS
    if (Platform.get() === "macOS") {
      app.dock.hide();
    }

    // Show dev tools
    if (Platform.isProduction()) {
      Menu.setApplicationMenu(menu);
    } else {
      this.mainWindow.browserWindow.webContents.openDevTools();
    }
  }

  onWindowAllClosed() {}

  async onReady() {
    if (Platform.isProduction()) {
      await this.setupProd();
    } else {
      await this.setupDev();
    }
  }
}
