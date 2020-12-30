import { app } from "electron";
import Main from "./services/Main";

const main = new Main(app);
main.run();
