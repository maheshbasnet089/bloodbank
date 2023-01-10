const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderBloodRequestForm = async (req, res, next) => {
  res.render("bloodRequest/createBloodRequest");
};
exports.createBloodRequest = async (req, res, next) => {
  const userId = req.user.id;
  const {
    patientName,
    contactPerson,
    bloodGroup,
    province,
    district,
    localLevel,
    hospital,
    requiredPint,
    phone,
    requiredDate,
    requiredTime,
    caseDetail,
  } = req.body;
  if (
    !patientName ||
    !bloodGroup ||
    !province ||
    !district ||
    !localLevel ||
    !hospital ||
    !requiredPint ||
    !phone ||
    !requiredDate ||
    !requiredTime ||
    !caseDetail
  ) {
    req.flash("error", "Please fill all the fields");
    res.redirect(req.headers.referer || "/");
    await sequelize.query(
      " CREATE TABLE bloodRequest IF NOT EXISTS(id NOT NULL INT PRIMARY KEY AUTO_INCREMENT,userId INT,patientName VARCHAR(255),contactPerson VARCHAR(255),bloodGroup VARCHAR(255),province VARCHAR(255),district VARCHAR(255),localLevel VARCHAR(255),hospital VARCHAR(255),requiredPint INT,phone INT,requiredDate DATE,requiredTime VARCHAR(255),caseDetail VARCHAR(255)) ",
      {
        type: QueryTypes.CREATE,
      }
    );
    await sequelize.query(
      " INSERT INTO bloodRequest (userId,patientName,contactPerson,bloodGroup,province,district,localLevel,hospital,requiredPint,phone,requiredDate,requiredTime,caseDetail) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ",
      {
        type: QueryTypes.INSERT,
        replacements: [
          userId,
          patientName,
          contactPerson || null,
          bloodGroup,
          province,
          district,
          localLevel,
          hospital,
          requiredPint,
          phone,
          requiredDate,
          requiredTime,
          caseDetail,
        ],
      }
    );
    req.flash("success", "Blood request created successfully");
    res.redirect("/bloodRequest");
  }
};
exports.getBloodRequests = async (req, res, next) => {
  const bloodRequests = await sequelize.query(
    "SELECT * FROM bloodRequest WHERE userId = ?",
    {
      type: QueryTypes.SELECT,
      replacements: [req.user.id],
    }
  );
  res.render("bloodRequest/bloodRequest", { bloodRequests });
};

exports.getIndividualBloodRequest = async (req, res, next) => {
  const bloodRequest = await sequelize.query(
    "SELECT * FROM bloodRequest WHERE id = ? AND userId=?",
    {
      type: QueryTypes.SELECT,
      replacements: [req.params.id, req.user.id],
    }
  );
  res.render("bloodRequest/individualBloodRequest", { bloodRequest });
};

exports.deleteBloodRequest = async (req, res, next) => {
  await sequelize.query(
    "DELETE FROM bloodRequest WHERE id = ? AND userId = ?",
    {
      type: QueryTypes.DELETE,
      replacements: [req.params.id, req.user.id],
    }
  );
  req.flash("success", "Blood request deleted successfully");
  res.redirect("/bloodRequest");
};
