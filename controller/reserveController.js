import { Restaurant } from "../models/Restaurant";
import { User } from "../models/User";
import { Comment } from "../models/Comment";
import { Reservation } from "../models/Reservation";
import { Mail } from "../models/Mail.js";

import routes from "../routes/routes.js";
var mongoose = require("mongoose");

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

/* 검색 */
export const reserveSearch = async(req, res, next) => {
  let restaurants;
  if(req.body.tag === '가게명'){
    restaurants = await Restaurant.find({
    restaurant_name: { $regex: req.body.key, $options: "i" },
  });
}
  else if(req.body.tag === '주소'){
    restaurants = await Restaurant.find({
    restaurant_location: { $regex: req.body.key, $options: "i" },
    });
  }

  res.render("reserve/reserve.pug", { pageTitle: "Reserve Home",restaurants });
};

export const tagSearch =async (req,res,next)=>{
  try {
    const tag = req.params.id.slice(1,req.params.id.length);
    const restaurants = await Restaurant.find({
      restaurant_tag: tag,
      });
    res.render("reserve/reserve.pug", { pageTitle: "Reserve Home",restaurants })  
  } catch (error) {}
}

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

export const good = async(req,res) => {
  try {
      if(req.body.good === true){
      const restaurant = await Restaurant.findOneAndUpdate(
        { _id: req.body.url }, 
        { $set : {numGood :  req.body.numGood+1 }}, 
      );

      const owner = await User.findById(restaurant.restaurant_owner);
      const mail = await new Mail({
        header: `${req.body.email}님께서 ${restaurant.restaurant_name}에 좋아요를 눌렀습니다`,
        content: `${req.body.email}님께서 ${restaurant.restaurant_name}에 좋아요를 눌렀습니다`
      });
      mail.save();
      owner.mails.push(mail);
      owner.save();

      res.send();
      
      } 
      else{
        const restaurant = await Restaurant.findOneAndUpdate(
          { _id: req.body.url }, 
          { $set:{ numGood :req.body.numGood-1 }}, 
        );
        res.json();
      }
      

  }
  catch (error) {}
}