const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");
exports.renderCreateAmbulanceForm = async (req, res) => {
  res.render("ambulance/createForm");
};
exports.createAmbulance = async (req, res, next) => {
  const userId = req.user.id;
  const { hospitalName, address, phone } = req.body;
};
