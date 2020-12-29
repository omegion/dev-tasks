import { app, BrowserWindow, Menu } from "electron";

import waitOn from "wait-on";
import express from "express";
import getPort from "get-port";
import useragent from "express-useragent";
import { resolve } from "path";
import MainWindow from "./services/MainWindow";
import Tray from "./services/Tray";
import MainMenu from "./services/Menu";
import Platform from "./services/Platform";

function loadContent(port = 3000) {
  // Main window
  const win = new MainWindow(port);
  win.create();
  win.browserWindow.loadURL(`http://localhost:${port}`);

  const mainMenu = new MainMenu(win.browserWindow);
  const menu = Menu.buildFromTemplate(mainMenu.menu);

  // Show dev tools
  if (process.env.NODE_ENV === "development") {
    win.browserWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(menu);
  }

  // Tray
  const tray = new Tray(win.browserWindow, port);
  tray.create();

  // Dock
  if (Platform.get() === "macOS") {
    app.dock.hide();
  }
}

app.on("ready", async () => {
  if (process.env.NODE_ENV === "development") {
    // Importing dev dependencies
    const devtools = await import("electron-devtools-installer");

    // Installing devtools
    await devtools.default(devtools.VUEJS_DEVTOOLS);

    // Waiting for web server
    waitOn({ resources: [`http://localhost:3000`] }, loadContent);
  } else {
    const server = express();
    server.use(useragent.express());

    // Rejecting requests from browsers
    server.use((req, res, next) => {
      if (req.useragent.source.includes("Electron")) next();
      else res.end();
    });

    server.use(express.static(resolve(__dirname, "../renderer")));

    const port = await getPort();
    server.listen(port, "localhost", () => loadContent(port));
  }
});
