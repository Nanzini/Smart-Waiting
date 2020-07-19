import { Restaurant } from "../models/Restaurant";
import { User } from "../models/User";

export const userInfo_home = (req, res, next) => {
  res.render("userInfo.pug", { pageTitle: "MyInfo" });
};

export const userInfo_restaurants = async (req, res) => {
  //User Id로 User을 찾은 후 User의 Restaurant의 id가 nested된 채로 나올것이다
  // 그걸 벗겨줄 때는 model.query({}).popualte('Model내의 프로퍼티')
  const myRestaurants = await User.findById(req.session.userId).populate(
    "restaurants"
  );

  console.log(myRestaurants);
  console.log(myRestaurants.restaurants[0]);

  res.render("myRestaurants.pug", {
    pageTitle: "My Restaurants",
    myRestaurants: myRestaurants.restaurants,
  });
};

export const userInfo_showComments = (req, res, next) => {
  res.render("showComments", { pageTitle: "My comments" });
};

export const userInfo_showReservations = (req, res) => {
  res.render("showReservations", { pageTitle: "My Reservations" });
};

// post
export const userInfo_editReservation = (req, res) => {
  res.render("editReservation");
};

export const userInfo_editComment = (req, res) => {
  res.render("editProfile");
};
