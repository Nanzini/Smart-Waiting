import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  header: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Mail = mongoose.model("Mail", mailSchema);
