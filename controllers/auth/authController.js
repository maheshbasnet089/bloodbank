const db = require("../../model/index");
const User = db.users;
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { createHmac } = require("crypto");
const sendEmail = require("../../utils/email");
const { Op } = require("sequelize");
const AppError = require("./../../utils/appError");

///SIGN IN JWT TOKEN
const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// COOKIE OPTION FOR COOKIE
const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
};

//CREATING TOKEN AS WELL SENDING THE TOKEN IN COOKIE
const createToken = (user, statusCode, res) => {
  // console.log(user.id);
  const token = signInToken(user.id);

  //send cookie in response
  res.cookie("jwtToken", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).redirect("/dashboard");
};
exports.renderRegister = (req, res) => {
  res.render("auth/register");
};
exports.createUser = async (req, res, next) => {
  const {
    fullName,
    bloodGroup,
    province,
    district,
    localLevel,
    email,
    dateOfBirth,
    phone,
    gender,
    password,
  } = req.body;
  if (
    !fullName ||
    !bloodGroup ||
    !province ||
    !district ||
    !localLevel ||
    !email ||
    !dateOfBirth ||
    !phone ||
    !password
  )
    return next(new AppError("Please provide all the fields", 400));
  const phoneExist = await User.findOne({
    where: { phone: phone },
  });
  const emailExist = await User.findOne({
    where: { email: email },
  });
  if (phoneExist || emailExist)
    return next(new AppError("User already exist", 400));
  const user = await User.create({
    fullName,
    bloodGroup,
    province,
    district,
    localLevel,
    email,
    dateOfBirth,
    phone,
  });
  if (user) res.redirect("/login");
};

exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

exports.loginUser = async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password)
    return next(new AppError("Please provide phone and password", 400));
  const user = await User.findOne({
    where: { phone: phone },
  });
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Incorrect phone or password", 400));
  createToken(user, 200, res);
};
