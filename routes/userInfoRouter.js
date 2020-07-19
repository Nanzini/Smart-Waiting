import routes from "./routes.js";
import express from "express";
import {
  userInfo_home,
  userInfo_showComments,
  userInfo_editComment,
  userInfo_showReservations,
  userInfo_editReservation,
  userInfo_restaurants,
} from "../controller/userInfoController.js";

export const userInfoRouter = express.Router();

userInfoRouter.get(routes.home, userInfo_home);

userInfoRouter.get(routes.comments, userInfo_showComments);

userInfoRouter.get(routes.editComment, userInfo_editComment);

userInfoRouter.get(routes.reservations, userInfo_showReservations);

userInfoRouter.get(routes.restaurants, userInfo_restaurants);

userInfoRouter.get(routes.editReservation, userInfo_editReservation);
