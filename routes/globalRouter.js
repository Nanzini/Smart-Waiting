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
  tagSearch
} from "../controller/globalController.js";
import passport from "passport";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // /uploads/ 앞에 /를 붙이지 않는다.

export const globalRouter = express.Router();

globalRouter.get(routes.home, globalHome);

globalRouter.get(routes.join, join);
globalRouter.post(routes.join, postJoin);

globalRouter.get(routes.login, login);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.logout, logout);


globalRouter.get(routes.register, register);
globalRouter.post(
  routes.register,
  upload.single("restaurantPic"),
  postRegister
);

globalRouter.get("/auth/kakao", passport.authenticate("login-kakao"));

globalRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("login-kakao", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
