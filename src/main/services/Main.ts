import { app, Menu } from "electron";
import waitOn from "wait-on";
import useragent from "express-useragent";
import getPort from "get-port";
import MainWindow from "./MainWindow";
import MainMenu from "./Menu";
import Tray from "./Tray";
import Platform from "./Platform";
import * as core from "express-serve-static-core";

export default class Main {
  mainWindow: MainWindow;
  trayWindow: Tray;
  application: Electron.App;
  server: core.Express;

  constructor(app: Electron.App, server: core.Express) {
    this.application = app;
    this.server = server;
  }

  async run() {
    this.application.on("ready", async () => {
      await this.onReady();
    });
    this.application.on("quit", () => {
      this.onQuit();
    });
  }

  async setupDev() {
    // Waiting for web server
    waitOn({ resources: [`http://localhost:3000`] }, this.setupWindows);
  }

  async setupProd() {
    this.server.use(useragent.express());

    // Rejecting requests from browsers
    this.server.use((req, res, next) => {
      if (req.useragent.source.includes("Electron")) next();
      else res.end();
    });

    const port = await getPort();
    this.server.listen(port, "localhost", () => this.setupWindows(port));
  }

  async setupWindows(port = 3000) {
    this.mainWindow = new MainWindow(port);
    await this.mainWindow.create();

    const mainMenu = new MainMenu(this.mainWindow.browserWindow);

    this.trayWindow = new Tray(this.mainWindow, mainMenu.trayMenu, port);
    this.trayWindow.create();

    Menu.setApplicationMenu(mainMenu.applicationMenu);

    // Show doc for MacOS
    if (Platform.isMac()) {
      app.dock.setMenu(mainMenu.dockMenu);
    }

    // Show dev tools
    if (!Platform.isProduction()) {
      this.mainWindow.browserWindow.webContents.openDevTools();
    }
  }

  async onReady() {
    if (Platform.isProduction()) {
      await this.setupProd();
    } else {
      await this.setupDev();
    }
  }

  onQuit() {}
}
