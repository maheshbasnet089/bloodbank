const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderCreateDonorForm = async (req, res, next) => {
  res.render("donor/createForm");
};

exports.createDonor = async (req, res, next) => {
  const {
    fullName,
    bloodGroup,
    province,
    district,
    localLevel,
    email,
    dob,
    phone,
    gender,
    password,
  } = req.body;
  const { id } = req.user;
  const user = await User.findByPk(id);
  setTimeout(async () => {
    user.availiabilityStatus = "yes";
    user.donatedDate = null;
    await user.save();
  }, 30 * 24 * 60 * 60 * 1000);
  const availiabilityStatus = user.availiabilityStatus;
  if (!user || !(await user.comparePassword(password))) {
    req.flash("error", "Invalid password ");
    return res.redirect("/donor");
  }
  if (availiabilityStatus !== "yes") {
    req.flash("error", "You cannot donate for next 3 months");
    return res.redirect("/");
  }
  try {
    await sequelize.query(
      "CREATE TABLE IF NOT EXISTS donor (id NOT NULL PRIMARY KEY AUTO_INCREMENT,fullName VARCHAR(255),bloodGroup VARCHAR(255),province VARCHAR(255),district VARCHAR(255),localLevel VARCHAR(255),email VARCHAR(255),dob VARCHAR(255),phone VARCHAR(255),gender VARCHAR(255))",
      {
        type: QueryTypes.CREATE,
      }
    );
    await sequelize.query(
      "INSERT INTO donor(fullName,bloodGroup,province,district,localLevel,email,dob,phone,gender) VALUES(?,?,?,?,?,?,?,?,?) ",
      {
        type: QueryTypes.INSERT,
        replacements: [
          fullName,
          bloodGroup,
          province,
          district,
          localLevel,
          email,
          dob,
          phone,
          gender,
        ],
      }
    );
    user.role = "donor";
    user.donatedDate = new Date();
    user.availiabilityStatus = "no";
    await user.save();
    req.flash("success", "You are donor now");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong");
    res.redirect("/donor");
  }
};

exports.getDonors = async (req, res, next) => {
  const donors = await sequelize.query("SELECT * FROM donor", {
    type: QueryTypes.SELECT,
  });

  res.render("donors/index", { donors });
};

exports.getDonor = async (req, res, next) => {
  const donor = await sequelize.query("SELECT * FROM donor WHERE id=?", {
    type: QueryTypes.SELECT,
    replacements: [req.params.id],
  });
  if (!donor) {
    req.flash("error", "Not found for that id");
    res.redirect("/");
  }
  res.render("donor/showIndividual", { donor });
};
exports.deleteDonor = async (req, res, next) => {
  await sequelize.query("DELETE FROM donor WHERE id=?", {
    type: QueryTypes.DELETE,
    replacements: [req.params.id],
  });
  req.flash("success", "Deleted the donation portal sucessfully");
  res.redirect("/");
};
