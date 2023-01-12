const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// const User = require('../model/userModel')
const db = require("../model/index");
const AppError = require("./appError");
const User = db.users;

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to do that action ", 403)
      );
    }
    next();
  };
};
