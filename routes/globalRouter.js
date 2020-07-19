import routes from "./routes.js";
import express from "express";
import {
  globalHome,
  login,
  postLogin,
  join,
  postJoin,
  logout,
  register,
  postRegister,
} from "../controller/globalController.js";

export const globalRouter = express.Router();

globalRouter.get(routes.home, globalHome);

globalRouter.get(routes.join, join);
globalRouter.post(routes.join, postJoin);

globalRouter.get(routes.login, login);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.logout, logout);

globalRouter.get(routes.register, register);
globalRouter.post(routes.register, postRegister);
