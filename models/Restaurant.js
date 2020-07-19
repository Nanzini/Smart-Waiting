import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurant_name: String,
  restaurant_tag: String,
  restaurant_location: String,

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
      ref: "comment",
    },
  ],
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
