import routes from "./routes/routes.js";

import { globalRouter, reserve } from "./routes/globalRouter.js";
import { reserveRouter } from "./routes/reserveRouter.js";
import { userInfoRouter } from "./routes/userInfoRouter.js";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";

export const app = express();

app.set("view engine", "pug");
app.use(express.json()); //req.body parser 접근 가능
app.use(express.urlencoded({ extended: false })); //post로 요청했을 때 url 파싱
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard man",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/static", express.static(path.join(__dirname, "static")));
app.use((req, res, next) => {
  res.locals.users = {
    id: req.session.userId || false,
    email: req.session.email || false,
  };
  res.locals.routes = routes;
  next();
});

app.use(routes.home, globalRouter);
app.use(routes.reserve, reserveRouter);
app.use(routes.userInfo(), userInfoRouter);
