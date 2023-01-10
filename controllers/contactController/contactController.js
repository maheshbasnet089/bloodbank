const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const PDFDocument = require("pdfkit");

const { QueryTypes, DataTypes } = require("sequelize");
const sendEmail = require("../../utils/email");

exports.postContactMessage = async (req, res, next) => {
  const { fullName, email, message } = req.body;
  await sequelize.query(
    "CREATE TABLE IF NOT EXISTS contactMessage(id NOT NULL INT PRIMARY KEY AUTO_INCREMENT,fullName VARCHAR(255),email VARCHAR(255),message VARCHAR(255),createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)",
    {
      type: QueryTypes.CREATE,
    }
  );
  await sequelize.query(
    "INSERT INTO contactMessage (fullName,email,message) VALUES(?,?,?)",
    {
      type: QueryTypes.INSERT,
      replacements: [fullName, email, message],
    }
  );
  req.flash("success", "Message sent sucessfully");
  res.redirect("/");
};

exports.getContactMessage = async (req, res, next) => {
  const contactMessages = await sequelize.query(
    "SELECT * FROM contactMessage",
    {
      type: QueryTypes.SELECT,
    }
  );
  res.render("contactMessage/list", { contactMessages });
};
