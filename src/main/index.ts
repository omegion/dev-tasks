import { app } from "electron";
import express from "express";
import { resolve } from "path";
import Main from "./services/Main";

const server = express();
server.use(express.static(resolve(__dirname, "../renderer")));

const main = new Main(app, server);
main.run();
