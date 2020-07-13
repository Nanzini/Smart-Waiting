import routes from "./routes/routes.js";

import { globalRouter, reserve } from "./routes/globalRouter.js";
import { reserveRouter } from "./routes/reserveRouter.js";
import { userInfoRouter } from "./routes/userInfoRouter.js";
import express from "express";
import path from "path";

export const app = express();

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/static", express.static(path.join(__dirname, "static")));

app.use((req, res, next) => {
  res.locals.user = {
    id: 1,
  };
  res.locals.routes = routes;
  next();
});
app.use(routes.home, globalRouter);

app.use(routes.reserve, reserveRouter);
app.use(routes.userInfo, userInfoRouter);
