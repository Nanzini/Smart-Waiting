// 시간 인원 유저
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  guestId: {
    type: String,
    requited: true,
  },
  name: {
    type: String,
  },
  guests: {
    type: Number,
    required: true,
  },
  reservationDate: {
    type: String,
    requited: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Reservation = mongoose.model("Reservation", reservationSchema);
