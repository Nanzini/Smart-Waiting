import { User } from "../models/User";
import { Restaurant } from "../models/Restaurant";
import { Menu } from "../models/Menu";
import { Table } from "../models/Table";
var mongoose = require("mongoose");

export const posHome = async (req, res) => {
  const user = await User.findById(req.session.userId).populate("restaurants");
  res.render("pos/home.pug", { pageTitle: "posHome", user });
};

export const posOrder = async (req, res) => {
  const id = req.params.id;
  const ID = id.slice(1, id.length);
  const restaurant = await Restaurant.findById(ID).populate("menu");

  const menu = restaurant.menu;

  res.render("pos/order.pug", { pageTitle: "주문", restaurant, menu });
};

export const menuRegister = async (req, res) => {
  try {
    const menu = new Menu({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    });
    const restaurant = await Restaurant.findById(req.body.id);
    restaurant.menu.push(menu);
    restaurant.save();
    menu.save();
    res.json("이잉");
  } catch (error) {}
};

export const orderRegister = async (req, res) => {
  console.log(req.body);
  // mini일 때와 big일 때 구분하기

  if (req.body.table[0] === "b") {
    try {
      const restaurant = await Restaurant.updateMany(
        { _id: req.body.id },
        {
          $set: {
            "bigTables.$[row].$[].beUsing": true,
            "bigTables.$[row].$[].orderTime": req.body.createAt,
            "bigTables.$[row].$[].menu": req.body.menu,
            "bigTables.$[row].$[].price": req.body.price,
          },
        },
        {
          arrayFilters: [
            { "row._id": mongoose.mongo.ObjectID(req.body.tableId) },
          ],
        }
      );

      console.log(restaurant);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const restaurant = await Restaurant.updateMany(
        { _id: req.body.id },
        {
          $set: {
            "miniTables.$[row].$[].beUsing": true,
            "miniTables.$[row].$[].orderTime": req.body.createAt,
            "miniTables.$[row].$[].menu": req.body.menu,
            "miniTables.$[row].$[].price": req.body.price,
          },
        },
        {
          arrayFilters: [
            { "row._id": mongoose.mongo.ObjectID(req.body.tableId) },
          ],
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  res.json();
};

export const bill = async (req, res) => {
  console.log(req.body);
  // mini일 때와 big일 때 구분하기

  if (req.body.table[0] === "b") {
    try {
      const restaurant = await Restaurant.updateMany(
        { _id: req.body.id },
        {
          $set: {
            "bigTables.$[row].$[].beUsing": false,
            "bigTables.$[row].$[].orderTime": req.body.createAt,
            "bigTables.$[row].$[].menu": req.body.menu,
            "bigTables.$[row].$[].price": req.body.price,
          },
        },
        {
          arrayFilters: [
            { "row._id": mongoose.mongo.ObjectID(req.body.tableId) },
          ],
        }
      );

      console.log(restaurant);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const restaurant = await Restaurant.updateMany(
        { _id: req.body.id },
        {
          $set: {
            "miniTables.$[row].$[].beUsing": false,
            "miniTables.$[row].$[].orderTime": req.body.createAt,
            "miniTables.$[row].$[].menu": req.body.menu,
            "miniTables.$[row].$[].price": req.body.price,
          },
        },
        {
          arrayFilters: [
            { "row._id": mongoose.mongo.ObjectID(req.body.tableId) },
          ],
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  res.json();
};
