import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: "content is required",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // model 이름이 온다
  },
  starRating: {
    type: Number,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
