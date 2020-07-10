import {
  reserveHome,
  reserveSearch,
  reserveRestaurant,
} from "../controller/reserveController.js";
import routes from "./routes.js";
import express from "express";

export const reserveRouter = express.Router();

reserveRouter.get(routes.home, reserveHome);

reserveRouter.get(routes.search, reserveSearch);

reserveRouter.get(routes.restaurant, reserveRestaurant);
