import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },

  password: String,
  name: String,
  age: String,
  birthday: String,
  gender: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  mails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mail",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
