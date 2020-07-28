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

  // 메뉴는 아직 모르겟다
  menu: {
    type: String,
  },
});

export const Table = mongoose.model("Table", tableSchema);
