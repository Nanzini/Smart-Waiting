import routes from "../routes/routes.js";
import mongoose from "mongoose";
import { User } from "../init.js";

export const globalHome = async (req, res, next) => {
  //await User.deleteOne({name:"youngman"})
  const user = await User.findOne({ name: "youngman" });

  res.render("home.pug", {
    pageTitle: "home",
    user: user,
  });
};

export const login = (req, res, next) => {
  res.render("login.pug", { pageTitle: "login" });
};
