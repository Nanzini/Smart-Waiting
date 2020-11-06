import routes from "../routes/routes.js";
import { User } from "../models/User.js";
import { Restaurant } from "../models/Restaurant.js";
import { Mail } from "../models/Mail.js";
import dotenv from "dotenv";
import { Table } from "../models/Table.js";
dotenv.config();

export const globalHome = (req, res, next) => {
  res.render("home/home.pug", { pageTitle: "home" });
};

export const join = (req, res) => {
  res.render("home/join.pug", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const now = new Date();
  const parseYear = req.body.birthday.slice(0, 4);
  const age = now.getFullYear() - parseYear;
  const birthday =
    req.body.birthday.slice(5, 7) + req.body.birthday.slice(8, 10);
  const joinedPerson = await new User({
    userId: req.body.id,
    password: req.body.password,
    name: req.body.name,
    age,
    birthday,
    gender: req.body.gender,
  });
  joinedPerson.save();
  res.redirect(routes.home);
};


export const login = (req, res, next) => {
  res.render("home/login.pug", { pageTitle: "login" });
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
  res.render("home/register.pug", { pageTitle: "Restaurant Register" });
};

export const postRegister = async (req, res) => {
  try {
    const registerRest = await new Restaurant({
      restaurant_name: req.body.name,
      restaurant_tag: req.body.tag,
      restaurant_location: req.body.location,
      restaurant_pic:
        req.file === undefined ? process.env.DEFAULT_IMAGE : req.file.filename,
      restaurant_owner: req.session.userId,
      // await 없으면 기다려주지 않고 다음으로 넘어가서 데이터저장이 안된다 콜백이 반드시 필요하다.
      bigTables: await makeTable(req.body.bigTables, 4),
      miniTables: await makeTable(req.body.miniTables, 2),
    });

    // user에 푸쉬하기
    try {
      const user = await User.findById(req.session.userId);
      user.restaurants.push(registerRest);

      // user에게 가게등록 메일 보내기
      const mail = new Mail({
        header: `${req.body.name}을 등록하셨습니다!`,
        content: 
          `가게이름 : ${req.body.name}` +
          `위치 : ${req.body.location}` +
          `위의 내용으로 ${process.env.MAIL_REGISTER_RESTAUANT}`
        ,
      });
      user.mails.push(mail);
      mail.save();

      registerRest.save();
      user.save();

      res.redirect(routes.home);
    } catch (error) {
      res.send("회원이 아닙니다");
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.register);
  }
};

// API

const kakaoCallback = (accessToken, refreshToken, profile, done) => {};

const makeTable = async (tableNum, tableSize) => {
  try {
    const entireBigTable = [];
    for (let i = 0; i < tableNum; i++) {
      const newBigTable = [];
      for (let j = 0; j < tableSize; j++) {
        const table = await new Table({
          reserved: false,
          beUsing: false,
          orderTime: 0,
          menu: "Not yet",
          price: 0,
        });
        newBigTable.push(table);
        table.save();
      }
      entireBigTable.push(newBigTable);
    }
    console.log(entireBigTable);
    return entireBigTable;
  } catch (error) {
    console.log(error);
  }
};
