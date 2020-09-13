import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurant_name: String,
  restaurant_tag: String,
  restaurant_location: String,

  restaurant_pic: {
    type: String,
    default: "2973194cb8047237c8f850c7ffd0e9a8",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  restaurant_reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  restaurant_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurant_comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  mails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mail",
    },
  ],
  bigTables: {
    //type: Array(),
    //ref: "Table",
  },
  miniTables: {
    //type: Array(),
    //ref: "Table",
  },
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
