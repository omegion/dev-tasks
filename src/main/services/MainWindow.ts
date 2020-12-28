export default class MainWindow {
  constructor() {
    console.log("hola!");
  }

  static _is_production(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
