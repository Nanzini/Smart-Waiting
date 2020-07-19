import routes from "../routes/routes.js";
import { User } from "../models/User.js";
import { Restaurant } from "../models/Restaurant.js";

export const globalHome = (req, res, next) => {
  res.render("home.pug", { pageTitle: "home" });
};

export const join = (req, res) => {
  res.render("join.pug", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const joinedPerson = await new User({
    userId: req.body.id,
    password: req.body.password,
    name: req.body.name,
  });
  joinedPerson.save();
  res.redirect(routes.home);
};

export const login = (req, res, next) => {
  res.render("login.pug", { pageTitle: "login" });
};

export const postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userId: req.body.id,
    });
    if (user.password === req.body.password) {
      req.session.userId = user._id;
      req.session.email = user.userId;

      res.locals.users.session = user._id;
      res.locals.users.userId = user.userId;

      res.redirect(routes.home);
    }
  } catch (error) {
    res.redirect(routes.login);
  }
};

export const logout = (req, res, next) => {
  req.session.destroy();
  res.locals.users.session = false;
  res.redirect(routes.home);
};

export const register = (req, res) => {
  console.log(req.session);
  res.render("register.pug", { pageTitle: "Restaurant Register" });
};

export const postRegister = async (req, res) => {
  try {
    const registerRest = await new Restaurant({
      restaurant_name: req.body.name,
      restaurant_tag: req.body.tag,
      restaurant_location: req.body.location,
      restaurant_owner: req.session.userId,
    });

    console.log(registerRest);
    registerRest.save();

    const user = await User.findById(req.session.userId);
    user.restaurants.push(registerRest);
    user.save();
    console.log(user);

    res.redirect(routes.home);
  } catch (error) {
    console.log(error);
    res.redirect(routes.register);
  }
};
