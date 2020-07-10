import routes from "../routes/routes.js";

export const globalHome = (req, res, next) => {
  res.render("home.pug", { pageTitle: "home" });
};

export const login = (req, res, next) => {
  res.render("login.pug", { pageTitle: "login" });
};
