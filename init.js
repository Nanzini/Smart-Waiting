import { app } from "./app.js";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/SmartWaiting", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error"));
db.once("open", () => {
  console.log("DB connection Suceesed!");
});

const userSchema = new mongoose.Schema({
  name: String,
});
export const User = mongoose.model("user", userSchema);

app.listen(4000, () => {
  console.log("listening . . . http://localhost:4000");
});
