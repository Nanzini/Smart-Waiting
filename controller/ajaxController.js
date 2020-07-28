import routes from "../routes/routes.js";
import { User } from "../models/User.js";
import { Restaurant } from "../models/Restaurant.js";
import { Mail } from "../models/Mail.js";
import dotenv from "dotenv";
import { Reservation } from "../models/Reservation.js";

dotenv.config();

export const getCalendarReservation = async (req, res) => {
  const restaurantUrl = req.body.url;
  const id = restaurantUrl.slice(
    restaurantUrl.indexOf(":") + 1,
    restaurantUrl.length
  );

  const restaurant = await Restaurant.findById(id).populate("reservations");

  // 레스토랑 예약에 대한 데이터 파싱
  console.log(req.body.month.length);
  const reservationYear = req.body.year;
  const reservationMonth = req.body.month;
  const reservationDate = req.body.date;
  console.log(reservationYear, reservationMonth, reservationDate);

  console.log(restaurant.reservations);
  res.json(restaurant.reservations);
};

export const getUserInfo_mail = async (req, res) => {
  console.log(req.body.url);
  const parseUrl = req.body.url;
  const id = parseUrl.slice(parseUrl.indexOf(":") + 1, parseUrl.length);
  console.log(id);
  const mail = await User.findById(id).populate("mails");
  console.log(mail.mails);
  res.json(mail.mails);
};

export const processReservation = async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      const restaurant = await Restaurant.findById(
        req.body.restaurant
      ).populate("restaurant_owner");

      const owner = await User.findById(restaurant.restaurant_owner._id);

      const reservation = await new Reservation({
        guestId: user._id,
        name: req.body.name,
        guests: req.body.guests,
        reservationDate: req.body.date,
      });

      const userMail = await new Mail({
        header: `${restaurant.restaurant_name}을 예약하셨습니다!`,
        content: `예약날짜 : ${reservation.reservationDate}
          예약식당 : ${restaurant.restaurant_name}
          예약자 : ${reservation.name}님
          예약인원 : ${reservation.guests}분

          ${process.env.MIAL_USER_RESERVATION}
        `,
      });

      const ownerMail = await new Mail({
        header: `${reservation.name}님께서 예약하셨습니다!`,
        content: `예약날짜 : ${reservation.reservationDate}
        예약식당 : ${restaurant.restaurant_name}
        예약자 : ${reservation.name}님
        예약인원 : ${reservation.guests}분

        ${process.env.MIAL_OWNER_RESERVATION}
      `,
      });
      reservation.save();
      ownerMail.save();
      userMail.save();

      // 예약푸쉬
      restaurant.restaurant_reservations.push(reservation);
      user.reservations.push(reservation);

      // 메일푸쉬
      user.mails.push(userMail);
      owner.mails.push(ownerMail);

      restaurant.save();
      user.save();
      owner.save();
      res.json({ url: "/", user: true });
    }
    console.log(`${routes.login}`);
    res.json({ url: `${routes.login}`, user: false });
  } catch (error) {}
};
