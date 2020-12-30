import {app} from "electron";

export default class Platform {
  static get(): "macOS" | "Windows" | "Linux" {
    const platformName = process.platform;
    if (platformName === "darwin") {
      return "macOS";
    }
    if (platformName === "win32") {
      return "Windows";
    }
    if (platformName === "linux") {
      return "Linux";
    }
  }

  static isMac(): boolean {
    return Platform.get() === "macOS";
  }

  static isProduction(): boolean {
    return app.isPackaged;
  }
}
