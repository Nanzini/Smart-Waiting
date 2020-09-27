import routes from "../routes/routes.js";
import { User } from "../models/User.js";
import { Restaurant } from "../models/Restaurant.js";
import { Mail } from "../models/Mail.js";
import { Reservation } from "../models/Reservation.js";
import { Comment } from "../models/Comment.js";
import dotenv from "dotenv";
var mongoose = require("mongoose");
dotenv.config();
const waitQ = [];
const cnt_interval = 0;
export const getUserInfo_mail = async (req, res) => {
  console.log(req.body.url);
  const parseUrl = req.body.url;
  const id = parseUrl.slice(parseUrl.indexOf(":") + 1, parseUrl.length);
  console.log(id);
  const mail = await User.findById(id).populate("mails");
  console.log(mail.mails);
  res.json(mail.mails);
};

const tables = (guest) => {
  let bigTables = parseInt(guest / 4);
  let miniTables = 0;
  if (bigTables === guest / 4) bigTables;
  else if (1 <= guest % 4 && guest % 4 <= 2) miniTables++;
  else bigTables++;
  return [bigTables, miniTables];
};

const times = () => {
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

const subTime = (future, now) => {
  const reservation = String(future);
  const current = String(now);
  const year = reservation.slice(0, 4) - current.slice(0, 4);
  const month = reservation.slice(4, 6) - current.slice(4, 6);
  const date = reservation.slice(6, 8) - current.slice(6, 8);
  const hours = reservation.slice(8, 10) - current.slice(8, 10);

  let m = 12 * year + month;
  let d = m * 30 + date;
  let h = d * 24 + hours;
  let seconds = h * 3600;

  return seconds - 1200; //20분전부터 예약석으로 등록
};

const getReservedPeople = async (reservations, Date, restaurant, guests) => {
  let reservedBigTable = restaurant.bigTables.length;
  let reservedMiniTable = restaurant.miniTables.length;
  let table;

  if (reservations.length === 0 || typeof reservations === "undefined") {
    let tmp1 = reservedBigTable;
    let tmp2 = reservedMiniTable;
    table = tables(guests);
    if (reservedBigTable - table[0] >= 0) reservedBigTable -= table[0];
    if (reservedMiniTable - table[1] >= 0) reservedMiniTable -= table[1];
    if (tmp1 - table[0] < 0 || tmp2 - table[1] < 0) {
      console.log("false입니다아아");
      return [reservedBigTable, reservedMiniTable, false];
    } else return [reservedBigTable, reservedMiniTable, true];
  }

  for (let i = 0; i < reservations.length; i++) {
    try {
      table = tables(reservations[i].guests);
      if (reservations[i].reservationDate === String(Date)) {
        let tmp1 = reservedBigTable;
        let tmp2 = reservedMiniTable;

        if (reservedBigTable - table[0] >= 0) reservedBigTable -= table[0];
        if (reservedMiniTable - table[1] >= 0) reservedMiniTable -= table[1];
        if (tmp1 - table[0] < 0 || tmp2 - table[1] < 0)
          return [reservedBigTable, reservedMiniTable, false];
      }
    } catch (error) {}
  }
  return [reservedBigTable, reservedMiniTable, true];
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
  console.log("getCalendar에서의 결과괎 : " + reservedPeople);
  res.json(reservedPeople);
};

export const processReservation = async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      const restaurant = await Restaurant.findById(req.body.restaurant)
        .populate("reservations")
        .populate("restaurant_owner")
        .populate("bigTables")
        .populate("miniTables");

      try {
        const reservation = await new Reservation({
          guestId: user._id,
          name: req.body.name,
          guests: req.body.guests, // String "2"
          restaurant: req.body.restaurant,
          reservationDate: req.body.date, // Number 2020091717
        });
        reservation.save();
        restaurant.restaurant_reservations.push(reservation);

        const reservations = restaurant.restaurant_reservations;
        restaurant.save();

        const reservedPeople = await getReservedPeople(
          reservations,
          req.body.date,
          restaurant,
          req.body.guests
        );

        if (reservedPeople[2] === false) {
          console.log("false라구!");
          restaurant.restaurant_reservations.pop(reservation);
          restaurant.save();
          res.json({ user: true, accepted: false });
        } else {
          //20분 마다 확인
          setInterval(intervalReservation, 120000, reservation, req.body);
        }

        const owner = await User.findById(restaurant.restaurant_owner._id);
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
        restaurant.save();
        ownerMail.save();
        userMail.save();

        // 예약푸쉬
        user.reservations.push(reservation);

        // 메일푸쉬
        user.mails.push(userMail);
        owner.mails.push(ownerMail);

        //restaurant.save();
        user.save();
        owner.save();

        res.json({ url: "/", user: true });
      } catch (error) {}
    } catch (error) {
      console.log(error);
    }
  } else res.json({ url: `${routes.login}`, user: false });
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
    await User.update(
      { _id: req.session.userId },
      { $pull: { comments: req.body.id } }
    );

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
    await Restaurant.update(
      { _id: req.body.restaurant },
      {
        $pull: {
          restaurant_reservations: {
            _id: mongoose.mongo.ObjectID(req.body.reservationId),
          },
        },
      }
    );
    await User.update(
      { _id: req.session.userId },
      { $pull: { reservations: req.body.reservationId } }
    );
    ownerMail.save();
    userMail.save();
    restaurant.save();
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
    res.json(mail);
  } catch (error) {}
};

export const removeMail = async (req, res) => {
  try {
    const mail = await Mail.findOneAndDelete({ _id: req.body.id });
    await User.update(
      { _id: req.session.userId },
      { $pull: { mails: req.body.id } }
    );
    res.json(Number(mail._id));
  } catch (error) {}
};

const intervalReservation = async (reservation, body) => {
  waitQ.push(reservation);
  const tmp = await Restaurant.findById(body.restaurant)
    .populate("bigTables")
    .populate("miniTables");
  waitQ.sort((a, b) => {
    if (a.reservationDate > b.reservationDate) return 1;
    if (a.reservationDate < b.reservationDate) return -1;
    return 0;
  });
  const bigTables = tmp.bigTables;
  const miniTables = tmp.miniTables;

  // waitQ null일때 오류뿜는다 ㅜㅜㅠㅠ
  // Q에 암것도없을 때 setInterval 못하게 할 순 없나?
  const table = tables(waitQ[0].guests);

  for (let j = 0; j < waitQ.length; j++) {
    console.log("waitq : " + waitQ[j]);
    if (Number(waitQ[j].reservationDate) === Number(times()) + 1) {
      // big에 넣기
      for (let i = 0; i < bigTables.length; i++) {
        console.log("table : " + table);
        if (table[0] > 0) {
          if (bigTables[i][0].reserved === false) {
            console.log("자 넣을수있는 상황   " + i);
            try {
              const a = await Restaurant.updateMany(
                { _id: body.restaurant },
                {
                  $set: { "bigTables.$[row].$[].reserved": true },
                },
                {
                  arrayFilters: [
                    {
                      "row._id": mongoose.mongo.ObjectID(body.bigId[i]),
                    },
                  ],
                }
              );
              table[0]--;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
      // mini에 넣기
      for (let i = 0; i < miniTables.length; i++) {
        if (table[1] > 0) {
          if (miniTables[i][0].reserved === false) {
            console.log("자 넣을수있는 상황   " + i);
            try {
              const a = await Restaurant.updateMany(
                { _id: body.restaurant },
                {
                  $set: { "miniTables.$[row].$[].reserved": true },
                },
                {
                  arrayFilters: [
                    {
                      "row._id": mongoose.mongo.ObjectID(body.miniId[i]),
                    },
                  ],
                }
              );
              table[1]--;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }

      await Restaurant.update(
        { _id: body.restaurant },
        { $pull: { restaurant_reservations: { _id: waitQ[j]._id } } }
      );
      await Reservation.findOneAndDelete({ _id: waitQ[j]._id });
      waitQ.splice(j, 1);
    } else console.log("아직이네..");
  }
};
