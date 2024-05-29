import User from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import mail from "../helpers/mail.js";
import { nanoid } from "nanoid";

const avatarsDir = path.resolve("public/avatars");

const { EMAIL, API_BASE_URL } = process.env;

const message = (userEmail, verificationToken) => {
  return {
    from: EMAIL,
    to: userEmail,
    subject: `Thank you for your choice!`,
    html: `<h1>Hi!</h1><p>To continue you should verify your email. Just click on this <a href="${API_BASE_URL}/api/users/verify/${verificationToken}">link</a></a></p>`,
    text: `Hi! To continue you should verify your email. Just click on this link`,
  };
};

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL,
  });

  try {
    await mail.send(message(newUser.email, verificationToken));
  } catch (error) {
    throw HttpError(500);
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Please, verify your email");
  }

  const { SECRET_KEY } = process.env;

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);

  if (!user) {
    throw HttpError(401);
  }

  await User.findByIdAndUpdate(id, { token: null });

  res.status(204).json();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { subscription } = req.body;

  console.log(subscription);

  const user = await User.findByIdAndUpdate(id, { subscription });

  if (!user) {
    throw HttpError(404, "User not found");
  } else if (subscription === user.subscription) {
    throw HttpError(409, "User already have this subscription");
  }

  res.json({
    message: "Subscription updated",
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Image is required");
  }

  const { path: filePath } = req.file;

  const image = await Jimp.read(filePath);
  image.resize(250, 250).write(filePath);

  const resultDir = avatarsDir + "/" + req.file.filename;

  const avatarURL = `/avatars/${req.file.filename}`;

  await User.findByIdAndUpdate(req.user.id, { avatarURL });

  await fs.rename(filePath, resultDir);

  res.json({ avatarURL });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json("Verification successful");
};

const repeatVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  } else if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationToken = nanoid();

  await User.findOneAndUpdate({ email }, { verificationToken });

  try {
    await mail.send(message(user.email, verificationToken));
  } catch (error) {
    throw HttpError(500);
  }

  res.status(200).json({
    message: "Verification email sent",
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  repeatVerify: ctrlWrapper(repeatVerify),
};
