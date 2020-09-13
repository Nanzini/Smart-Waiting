import routes from "../routes/routes.js";
import { User } from "../models/User.js";
import { Restaurant } from "../models/Restaurant.js";
import { Mail } from "../models/Mail.js";
import { Reservation } from "../models/Reservation.js";
import { Comment } from "../models/Comment.js";
import dotenv from "dotenv";

dotenv.config();

const getReservedPeople = async (reservations, reservationDate, restaurant) => {
  // 예약하 ㄴ사람
  let reservedPeople = 0;
  const totalPeople =
    restaurant.bigTables.length * 4 + restaurant.miniTables.length * 2;

  for (let i = 0; i < reservations.length; i++) {
    const reservation = await Reservation.findById(reservations[i]);
    if (reservation !== null && reservation.reservationDate === reservationDate)
      reservedPeople += reservation.guests;
  }
  return [reservedPeople, totalPeople];
};

export const getCalendarReservation = async (req, res) => {
  const restaurantUrl = req.body.url;
  const id = restaurantUrl.slice(
    restaurantUrl.indexOf(":") + 1,
    restaurantUrl.length
  );
  const restaurant = await Restaurant.findById(id).populate("reservations");
  const reservations = restaurant.restaurant_reservations;
  const reservationDate =
    req.body.time === undefined
      ? req.body.year + req.body.month + req.body.date
      : req.body.year + req.body.month + req.body.date + req.body.time;

  const reservedPeople = await getReservedPeople(
    reservations,
    reservationDate,
    restaurant
  );
  console.log("예약한 사람 " + reservedPeople);
  res.json(reservedPeople[1] - reservedPeople[0]);
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
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      const restaurant = await Restaurant.findById(req.body.restaurant)
        .populate("restaurant_owner")
        .populate("reservations");
      const reservationDate =
        req.body.time === undefined
          ? req.body.year + req.body.month + req.body.date
          : req.body.year + req.body.month + req.body.date + req.body.time;

      const reservations = restaurant.restaurant_reservations;

      const reservedPeople = await getReservedPeople(
        reservations,
        reservationDate,
        restaurant
      );

      const possibleReservation = reservedPeople[1] - reservedPeople[0];
      if (req.body.guests > possibleReservation)
        return res.json({ user: true, accepted: false });

      const owner = await User.findById(restaurant.restaurant_owner._id);

      const reservation = await new Reservation({
        guestId: user._id,
        name: req.body.name,
        guests: req.body.guests,
        restaurant: req.body.restaurant,
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
      console.log("끝");
      res.json({ url: "/", user: true });
    } catch (error) {
      console.log(error);
    }
  }
  res.json({ url: `${routes.login}`, user: false });
};

// 해당시간 예약한 사람 반환

export const postEditUserInfo = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.body.email },
      {
        password: req.body.password,
        name: req.body.name,
        birthday: req.body.birthday,
      },
      { returnNewDocument: true }
    );

    user.save();
    res.json(user);
  } catch (error) {}
};

export const postEditComment = async (req, res) => {
  console.log(req.body);
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.body.id },
      { content: req.body.content },
      { returnNewDocument: true }
    );
    comment.save();
    console.log(comment);
    res.json(comment);
  } catch (error) {}
};

export const postDeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.body.id });
    res.json(comment);
  } catch (error) {}
};

export const postDeleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.id });
    await Restaurant.deleteMany({ restaurant_owner: user._id });
    await Comment.deleteMany({ user: user._id });
    await Reservation.deleteMany({ guestId: user._id });
    await User.findOneAndDelete({ userId: req.body.id });

    res.locals.users.id = false;
    res.locals.users.email = false;
    res.json(user);
  } catch (error) {}
};

export const deleteReservation = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.session.userId);
    const restaurant = await Restaurant.findById(req.body.restaurant)
      .populate("restaurant_owner")
      .populate("reservations");
    const owner = await User.findById(restaurant.restaurant_owner._id);
    const reservation = await Reservation.findOne({ _id: req.body.id });

    const userMail = await new Mail({
      header: `${restaurant.restaurant_name}을 예약을 취소하셨습니다!`,
      content: `예약날짜 : ${reservation.reservationDate}
      예약식당 : ${restaurant.restaurant_name}
      예약자 : ${reservation.name}님
      예약인원 : ${reservation.guests}분
    `,
    });

    const ownerMail = await new Mail({
      header: `${reservation.name}님께서 예약을 취소하셨습니다!`,
      content: `예약날짜 : ${reservation.reservationDate}
    예약식당 : ${restaurant.restaurant_name}
    예약자 : ${reservation.name}님
    예약인원 : ${reservation.guests}분    
  `,
    });
    await Reservation.findOneAndDelete({ _id: req.body.id });
    ownerMail.save();
    userMail.save();
    user.mails.push(userMail);
    owner.mails.push(ownerMail);

    user.save();
    owner.save();
    res.json("ehheee");
  } catch (error) {}
};

export const deleteRestaurant = async (req, res) => {
  await Restaurant.findOneAndDelete({ _id: req.body.id });
  res.json();
};

export const editRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOneAndUpdate(
    {
      _id: req.body.id,
    },
    {
      restaurant_name: req.body.name,
      restaurant_pic:
        req.file === undefined ? process.env.DEFAULT_IMAGE : req.file.filename,
      restaurant_tag: req.body.tag,
      // location
    },
    {
      returnNewDocument: true,
    }
  );
  restaurant.save();
  res.json();
};

export const readMail = async (req, res) => {
  try {
    const mail = await Mail.findOneAndUpdate(
      { _id: req.body.id },
      { read: true },
      { returnNewDocument: true }
    );
    mail.save();
    console.log(mail);
    res.json(mail);
  } catch (error) {}
};

export const removeMail = async (req, res) => {
  try {
    const mail = await Mail.findOneAndDelete({ _id: req.body.id });
    res.json(Number(mail._id));
  } catch (error) {}
};
