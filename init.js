import { app } from "./app.js";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/SmartWaiting", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error"));
db.once("open", () => {
  console.log("DB connection Suceesed!");
});

app.listen(4001, () => {
  console.log("listening . . . 127.0.0.1.4001 or http://localhost:4001");
});
