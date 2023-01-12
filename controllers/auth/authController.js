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
const createToken = (user, statusCode, res, req) => {
  // console.log(user.id);
  const token = signInToken(user.id);

  //send cookie in response
  res.cookie("jwtToken", token, cookieOptions);
  user.password = undefined;
  req.flash("success", "Logged in successfully");
  res.redirect("/");
};
exports.renderRegister = (req, res) => {
  req.flash("success", "Welcome to the register page");
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
    passwordConfirm,
    agree,
  } = req.body;
  const role = req.body.role || "patient";

  if (agree !== "on") return res.send("Agree all the terms");
  if (
    !fullName ||
    !bloodGroup ||
    !email ||
    !dateOfBirth ||
    !phone ||
    !password ||
    !passwordConfirm
  ) {
    return res.send("please provide all fields");
  }
  if (password.toLowerCase() !== passwordConfirm.toLowerCase()) {
    req.flash("error", "Password and confirm password does not match");
    return res.send("password and passwordConfirm don't match");
    // return res.redirect("/register");
  }
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
    password,
  });
  console.log(user);
  if (user) {
    req.flash("success", "User created successfully");
    return res.redirect("/login");
  }
};

exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) return res.send("Please provide phone and password");
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user || !(await user.comparePassword(password))) {
    // return req.flash("error", "Invalid username or password");
    return next(new AppError("Invalid username or password", 400));
  }

  createToken(user, 200, res, req);
};

exports.logOut = async (req, res) => {
  res.clearCookie("jwtToken");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
};
