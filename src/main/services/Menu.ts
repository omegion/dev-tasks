import os from "os";
import { app, shell, dialog, Menu, BrowserWindow } from "electron";
import Platform from "./Platform";

const { version, author } = require("../../../package.json");

const GITHUB_REPOSITORY = "https://github.com/omegion/dev-tasks";

const year = new Date().getFullYear();

export default class MainMenu {
  mainBrowserWindow: BrowserWindow;
  applicationMenu: Menu;
  dockMenu: Menu;
  trayMenu: Menu;

  constructor(mainBrowserWindow: BrowserWindow) {
    this.mainBrowserWindow = mainBrowserWindow;
    this.applicationMenu = this.getApplicationMenu();
    this.dockMenu = this.getDockMenu();
    this.trayMenu = this.getTrayMenu();

    if (Platform.isMac()) {
      app.setAboutPanelOptions({
        applicationName: "dev-tasks",
        applicationVersion: version,
        version,
        copyright: `${author} \n©2020-${year}`
      });
    }
  }

  getApplicationMenu() {
    const that = this;
    return Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "New Task",
            accelerator: "CommandOrControl+N",
            click() {
              that.mainBrowserWindow.webContents.send("menu:new-task");
            }
          },
          {
            label: "New Project",
            accelerator: "CommandOrControl+P",
            click() {
              that.mainBrowserWindow.webContents.send("menu:new-project");
            }
          },
          {
            label: "New Repository",
            accelerator: "CommandOrControl+R",
            click() {
              that.mainBrowserWindow.webContents.send("menu:new-repository");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click() {
              that.mainBrowserWindow.close();
            }
          }
        ]
      },
      {
        label: "Edit",
        submenu: [
          {
            role: "undo"
          },
          {
            role: "redo"
          },
          {
            type: "separator"
          },
          {
            role: "cut"
          },
          {
            role: "copy"
          },
          {
            role: "paste"
          },
          {
            role: "selectAll"
          }
        ]
      },
      {
        label: "Window",
        submenu: [
          {
            label: "Minimize",
            accelerator: "Command+M",
            role: "minimize"
          },
          {
            label: "Close",
            accelerator: "Command+W",
            role: "close"
          },
          {
            type: "separator"
          },
          {
            label: "Bring All to Front",
            role: "front"
          }
        ]
      },
      {
        label: "Developer",
        submenu: [
          {
            role: "forceReload"
          },
          {
            role: "toggleDevTools"
          },
          {
            type: "separator"
          },
          {
            role: "resetZoom"
          },
          {
            role: "zoomIn"
          },
          {
            role: "zoomOut"
          },
          {
            type: "separator"
          },
          {
            role: "togglefullscreen"
          }
        ]
      },
      {
        label: "Help",
        role: "help",
        submenu: [
          {
            label: "Shortcuts",
            click() {
              that.mainBrowserWindow.webContents.send("shortcuts:show");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Release Notes",
            click() {
              shell.openExternal(`${GITHUB_REPOSITORY}/releases`);
            }
          },
          {
            label: "View in GitHub",
            click() {
              shell.openExternal(`${GITHUB_REPOSITORY}`);
            }
          },
          {
            label: "Report Issue",
            click() {
              shell.openExternal(`${GITHUB_REPOSITORY}/issues/new/choose`);
            }
          },
          {
            type: "separator"
          },
          {
            label: "About",
            click() {
              dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                title: "Dev Tools",
                message: "Dev Tools",
                type: "info",
                detail: `
              Version: ${version}
              Electron: ${process.versions.electron}
              Chrome: ${process.versions.chrome}
              Node.js: ${process.versions.node}
              V8: ${process.versions.v8}
              OS: ${os.type()} ${os.arch()} ${os.release()}
            `
              });
            }
          },
          {
            type: "separator"
          },
          {
            label: "Open Developer Tools",
            accelerator: "Alt+CommandOrControl+I",
            click() {
              that.mainBrowserWindow.webContents.openDevTools({
                mode: "detach"
              });
            }
          }
        ]
      }
    ]);
  }

  getDockMenu() {
    const that = this;
    return Menu.buildFromTemplate([
      {
        label: "New Project",
        click() {
          that.mainBrowserWindow.webContents.send("menu:new-project");
        }
      },
      {
        label: "New Repository",
        click() {
          that.mainBrowserWindow.webContents.send("menu:new-repository");
        }
      }
    ]);
  }

  getTrayMenu() {
    const that = this;
    return Menu.buildFromTemplate([
      {
        label: "Show",
        click() {
          that.mainBrowserWindow.show();
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        click() {
          app.exit();
        }
      }
    ]);
  }
}
