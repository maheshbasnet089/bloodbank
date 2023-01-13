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

  if (agree !== "on")
    return res.render("error/pathError", {
      message: "Agree terms and policy to continue",
      code: 400,
    });
  if (
    !fullName ||
    !bloodGroup ||
    !email ||
    !dateOfBirth ||
    !phone ||
    !password ||
    !passwordConfirm
  ) {
    return res.render("error/pathError", {
      message: "Fill all the fields",
      code: 400,
    });
  }
  if (password.toLowerCase() !== passwordConfirm.toLowerCase()) {
    return res.render("error/pathError", {
      message: "password and passwordConfirm doesn't match",
      code: 400,
    });
    // return res.redirect("/register");
  }
  const phoneExist = await User.findOne({
    where: { phone: phone },
  });
  const emailExist = await User.findOne({
    where: { email: email },
  });
  if (phoneExist || emailExist)
    return res.render("error/pathError", {
      message: "User already exists",
      code: 400,
    });
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

  if (!email || !password)
    return res.render("error/pathError", {
      message: "Please provide email and password",
      code: 400,
    });
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user || !(await user.comparePassword(password))) {
    return res.render("error/pathError", {
      message: "Incorrect email or password",
      code: 400,
    });
  }

  createToken(user, 200, res, req);
};

exports.logOut = async (req, res) => {
  res.clearCookie("jwtToken");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
};
