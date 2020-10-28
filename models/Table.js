import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  reserved: {
    type: Boolean,
    default: false,
  },
  beUsing: {
    type: Boolean,
  },
  orderTime: {
    type: String,
  },

  menu: {
    type: Array(),
    ref: "Menu",
  },
  price: Number,
  tmp : Number()
});

export const Table = mongoose.model("Table", tableSchema);
