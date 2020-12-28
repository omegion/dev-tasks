import VuexPersist from "~/services/persistance/VuexPersist";

import { homedir, platform } from "os";
import * as fs from "fs";

export default class PersistStore {
  private readonly defaultPath: string;

  constructor() {
    const isWin = platform() === "win32";
    this.defaultPath = isWin
      ? homedir() + "\\devTasks"
      : homedir() + "/devTasks";

    this.makeDirectory();
  }

  private makeDirectory() {
    fs.mkdir(this.defaultPath, { recursive: true }, err => {
      if (err) throw err;
    });
  }

  persist() {
    return new VuexPersist({
      path: this.defaultPath,
      file: "data.json"
    });
  }
}
