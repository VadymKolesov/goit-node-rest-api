import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const emailRegexp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

export default User;
