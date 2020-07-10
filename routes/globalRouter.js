import routes from "./routes.js";
import express from "express";
import { globalHome, login } from "../controller/globalController.js";

export const globalRouter = express.Router();

globalRouter.get(routes.home, globalHome);

globalRouter.get(routes.login, login);
