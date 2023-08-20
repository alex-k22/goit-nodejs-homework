import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email, {
    protocol: "https",
    s: "250",
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click to verify your email</a>`,
  }

  sendEmail(verifyEmail);

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

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");    
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
};

const addAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  //Read image and resize it
  const image = await Jimp.read(oldPath);
  await image.resize(250, 250).writeAsync(oldPath);

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL: avatarURL,
  });
};

const verify = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if (!user) {
    throw HttpError(404, "User not found")
  }

  await User.findOneAndUpdate(user._id, {verify: true, verificationToken: null});

  res.status(200).json({
    message: 'Verification successful',
  })
};

const resendVerifyEmail = async(req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(404, "User not found")
  }
  if (user.verify) {
    throw HttpError (400, "Verification has already been passed")
  }

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a>`,
  }

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent"
  })
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  addAvatar: ctrlWrapper(addAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
