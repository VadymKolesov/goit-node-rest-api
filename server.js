import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST } = process.env;

console.log("starting...");

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server is running.");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
