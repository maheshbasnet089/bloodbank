const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderHomePage = async (req, res, next) => {
  res.render("home/index");
};
