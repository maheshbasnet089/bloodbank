const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderCreateBloodBank = async (req, res, next) => {
  res.render("bloodbank/createForm");
};
exports.createBloodBank = async (req, res, next) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone)
    return next(new AppError("Please provide all fields", 400));
  try {
    await sequelize.query(
      `CREATE TABLE bloodBank IF NOT EXISTS (id NOT NULL PRIMARY KEY AUTO_INCREMENT,name,address,phone)`,
      {
        type: QueryTypes.CREATE,
      }
    );
    await sequelize.query(
      `INSERT INTO bloodBank (name,address,phone) VALUES (?,?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [name, address, phone],
      }
    );
    req.flash("success", "Successfully made a new bloodBank!");

    res.redirect("/bloodBank");
  } catch (error) {
    res.render("error", { error });
  }
};

exports.getBloodBanks = async (req, res, next) => {
  const bloodBanks = await sequelize.query(`SELECT * FROM bloodBank`, {
    type: QueryTypes.SELECT,
  });
  res.render("bloodBanks/index", { bloodBanks });
};

exports.getBloodBank = async (req, res, next) => {
  const bloodBank = await sequelize.query(
    `SELECT * FROM bloodBank WHERE id = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [req.params.id],
    }
  );
  if (!bloodBank) {
    req.flash("error", "Cannot find that bloodBank!");

    return res.render("error", { message: "Not found with that id" });
  }
  res.render("bloodBank/showIndividual", { bloodBank });
};

exports.renderUpdateBloodBankForm = async (req, res, next) => {
  const bloodBank = await sequelize.query(
    `SELECT * FROM bloodBank WHERE id = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [req.params.id],
    }
  );
  if (!bloodBank) {
    req.flash("error", "Cannot find that bloodBank!");

    return res.render("error", { message: "Not found with that id" });
  }
  res.render("bloodBank/updateForm", { bloodBank });
};
exports.updateBloodBank = async (req, res, next) => {
  const { name, address, phone } = req.body;
  await sequelize.query(
    `UPDATE bloodBank SET name=?,address=?,phone=? WHERE id = ?`,
    {
      type: QueryTypes.UPDATE,
      replacements: [name, address, phone, req.params.id],
    }
  );
  req.flash("success", "Successfully updated bloodBank!");

  res.redirect("/bloodBank");
};

exports.deleteBloodBank = async (req, res, next) => {
  await sequelize.query(`DELETE FROM bloodBank WHERE id=?`, {
    type: QueryTypes.DELETE,
    replacements: [req.params.id],
  });
  req.flash("success", "Successfully deleted bloodBank!");

  res.redirect("/bloodBank");
};
