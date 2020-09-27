import { Restaurant } from "../models/Restaurant";
import { User } from "../models/User";
import { Comment } from "../models/Comment";
import { Reservation } from "../models/Reservation";
import routes from "../routes/routes.js";

export const times = (reservation) => {
  const current = new Date();
  const currentYear = current.getFullYear();
  const currentMonth =
    current.getMonth() < 9
      ? `0${current.getMonth() + 1}`
      : current.getMonth() + 1;
  const currentDate =
    current.getDate() < 10 ? `0${current.getDate()}` : current.getDate();
  const currentHour =
    current.getHours() < 10 ? `0${current.getHours()}` : current.getHours();
  return `${currentYear}${currentMonth}${currentDate}${currentHour}`;
};

export const reserveHome = async (req, res, next) => {
  const restaurants = await Restaurant.find({});

  res.render("reserve/reserve.pug", { pageTitle: "Reserve Home", restaurants });
};

export const reserveSearch = (req, res, next) => {};

export const reserveRestaurant = async (req, res, next) => {
  // 댓글
  const tmp = req.params.id;
  const id = tmp.slice(1, tmp.length);
  const restaurant = await Restaurant.findById(id).populate(
    "restaurant_comments"
  );

  const comments = restaurant.restaurant_comments; // Array
  const user = await User.findById(req.session.userId);

  const commenters = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = {
      id: comments[i]._id,
      realUser: await User.findById(comments[i].user),
      content: comments[i].content,
      createAt: comments[i].createAt,
    };
    commenters.push(comment);
  }

  res.render("reserve/reserveRestaurant.pug", {
    pageTitle: "Reserve Restaurant",
    restaurant,
    user,
    commenters,
  });
};

export const postReservation = async (req, res) => {
  console.log(req.body);

  const reservation = new reservation({
    guestId: req.body.id,
    guests,
    reservationDate: "1234",
  });
  res.redirect(`${routes.reserve}${routes.restaurant(restId)}`);
};

export const postComment = async (req, res) => {
  try {
    const restId = req.params.id.slice(1, req.params.id.length);
    const user = await User.findById(req.session.userId);
    const rest = await Restaurant.findById(restId);
    const comment = await new Comment({
      content: req.body.content,
      createAt: times(),
      user,
      // starRating
    });
    user.comments.push(comment);
    rest.restaurant_comments.push(comment);
    comment.save();
    user.save();
    rest.save();

    res.redirect(`${routes.reserve}${routes.restaurant(restId)}`);
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const finalReservaion = async (req, res) => {
  const tmp = req.params.id;
  const id = tmp.slice(1, tmp.length);
  const restaurant = await Restaurant.findById(id).populate(
    "restaurant_reservations"
  );
  const bigTables = restaurant.bigTables;
  const miniTables = restaurant.miniTables;

  res.render("reserve/finalReservation.pug", {
    restaurant,
    bigTables,
    miniTables,
  });
};

const getAllPeople = () => {};
