import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: String,
  password: String,
  name: String,
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
