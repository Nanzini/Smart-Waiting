import {
  reserveHome,
  reserveSearch,
  reserveRestaurant,
  postComment,
  postReservation,
  finalReservaion,
  tagSearch
} from "../controller/reserveController.js";
import routes from "./routes.js";
import express from "express";

export const reserveRouter = express.Router();

reserveRouter.get(routes.home, reserveHome);
reserveRouter.post(routes.home, reserveSearch);

reserveRouter.get(routes.search(), tagSearch);

reserveRouter.get(routes.restaurant(), reserveRestaurant);

reserveRouter.get(routes.reservation(), finalReservaion);
reserveRouter.post(routes.reservation(), postReservation); // 예약

reserveRouter.post(routes.comments(), postComment);
