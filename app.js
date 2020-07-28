import routes from "./routes/routes.js";
import { globalRouter } from "./routes/globalRouter.js";
import { reserveRouter } from "./routes/reserveRouter.js";
import { userInfoRouter } from "./routes/userInfoRouter.js";
import {
  getCalendarReservation,
  getUserInfo_mail,
  processReservation,
} from "./controller/ajaxController.js";
import kakaoCallback from "./controller/globalController.js";
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
//app.use(passport.initialize());
//app.use(passport.session());

// passport.use(
//   new NaverStrategy(
//     {
//       clientID: "CuTBeZenCQneIcYe6ued",
//       clientSecret: "Y85pQez0Im",
//       callbackURL: "http://127.0.0.1:4001/auth/naver/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log(profile);
//     }
//   )
// );
passport.use(
  "login-kakao",
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: process.env.KAKAO_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
      const kakao = profile._json.kakao_account;
      console.log(accessToken);
      console.log(kakao);
      console.log(kakao.email);
      const user = await User.findOne({
        userId: kakao.email,
      });
      if (user) {
        console.log("기존 유저에 데이터만 넣자");
        user.name = kakao.profile.nickname;
        user.age = kakao.age_range.slice(0, 1);
        user.birthday = kakao.birthday;
        user.gender = kakao.gender;
        user.save();
      } else {
        console.log("새로 회원가입시키자");
        const newUser = await new User({
          userId: kakao.email,
          name: kakao.profile.nickname,
          age: kakao.age_range.slice(0, 1),
          birthday: kakao.birthday,
          gender: kakao.gender,
        });
        newUser.save();
      }
    }
  )
);

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
app.post("/ajax/postReservation", processReservation);
