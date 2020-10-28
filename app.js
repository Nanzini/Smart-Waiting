import routes from "./routes/routes.js";
import { globalRouter } from "./routes/globalRouter.js";
import { reserveRouter } from "./routes/reserveRouter.js";
import { userInfoRouter } from "./routes/userInfoRouter.js";
import {
  getCalendarReservation,
  getUserInfo_mail,
  processReservation,
  postEditUserInfo,
  postEditComment,
  postDeleteComment,
  postDeleteUser,
  deleteReservation,
  deleteRestaurant,
  editRestaurant,
  readMail,
  removeMail,
} from "./controller/ajaxController.js";
import { good } from "./controller/reserveController.js";
import helmet from "helmet";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import KakaoStrategy from "passport-kakao";
import { User } from "./models/User.js";
import morgan from "morgan";
dotenv.config();
import multer from "multer";
import {
  posHome,
  posOrder,
  menuRegister,
  orderRegister,
  bill,
  clickTable,
} from "./controller/posController.js";
const upload = multer({ dest: "uploads/" }); // /uploads/ 앞에 /를 붙이지 않는다.
export const app = express();

app.set("view engine", "pug");
app.use(morgan("dev"));
app.use(express.json()); //   req.body parser 접근 가능
app.use(express.urlencoded({ extended: false })); //  post로 요청했을 때 url 파싱
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard man",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(helmet());

passport.serializeUser((user, done) => {
  // Strategy 성공 시 호출됨
  done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => {
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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

// AJAX routing
app.post("/ajax/getReservation", getCalendarReservation);
app.post("/ajax/userInfo_mail", getUserInfo_mail);
app.post("/ajax/userInfo_postEditUserInfo", postEditUserInfo);
app.post("/ajax/postReservation", processReservation);
app.post("/ajax/postEditComment", postEditComment);
app.post("/ajax/postDeleteComment", postDeleteComment);
app.post("/ajax/postDeleteUser", postDeleteUser);
app.post("/ajax/deleteReservation", deleteReservation);
app.post("/ajax/deleteRestaurant", deleteRestaurant);
app.post(
  "/ajax/editRestaurant",
  upload.single("restaurantPic"),
  editRestaurant
);
app.post("/ajax/readMail", readMail);
app.post("/ajax/removeMail", removeMail);
app.post("/ajax/menuRegister", menuRegister);
app.post("/ajax/orderRegister", orderRegister);
app.post("/ajax/bill", bill);
app.post("/ajax/good", good);

app.get(routes.posHome, posHome);
app.get(routes.order(), posOrder);
