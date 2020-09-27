import { Restaurant } from "../models/Restaurant";
import { User } from "../models/User";
import { Mail } from "../models/Mail";

export const userInfo_home = async (req, res, next) => {
  const user = await User.findById(req.session.userId)
    .populate("mails")
    .populate("comments")
    .populate("restaurants")
    .populate("reservations");

  let unreadMails = 0;
  for (let i = 0; i < user.mails.length; i++)
    if (user.mails[i].read === false) {
      console.log(user.mails[i]);
      unreadMails++;
    }

  res.render("userInfo/userInfo.pug", {
    pageTitle: "MyInfo",
    user,
    unreadMails,
  });
};

export const userInfo_restaurants = async (req, res) => {
  //User Id로 User을 찾은 후 User의 Restaurant의 id가 nested된 채로 나올것이다
  // 그걸 벗겨줄 때는 model.query({}).popualte('Model내의 프로퍼티')
  const myRestaurants = await User.findById(req.session.userId).populate(
    "restaurants"
  );

  res.render("userInfo/myRestaurants.pug", {
    pageTitle: "My Restaurants",
    myRestaurants: myRestaurants.restaurants,
  });
};

export const userInfo_showComments = (req, res, next) => {
  res.render("userInfo/showComments", { pageTitle: "My comments" });
};

export const userInfo_showReservations = (req, res) => {
  res.render("userInfo/showReservations", { pageTitle: "My Reservations" });
};

// post
export const userInfo_editReservation = (req, res) => {
  res.render("userInfo/editReservation");
};

export const userInfo_editComment = (req, res) => {
  res.render("userInfo/editProfile");
};
