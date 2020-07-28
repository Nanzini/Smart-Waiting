import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  header: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Mail = mongoose.model("Mail", mailSchema);
