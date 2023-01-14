const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderCreateBloodBank = async (req, res, next) => {
  const provinces = await sequelize.query(`SELECT * FROM provinces`, {
    type: QueryTypes.SELECT,
  });
  res.render("bloodbank/createForm", { provinces });
};
exports.createBloodBank = async (req, res, next) => {
  const { name, address, phone, province, district, localLevel, email } =
    req.body;

  if (!name || !phone || !province || !district || !localLevel || !email)
    return res.render("error/pathError", {
      message: "Please provide all fields",
      code: 400,
    });

  try {
    await sequelize.query(
      `CREATE TABLE  IF NOT EXISTS bloodBank(id INT NOT NUll AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),address VARCHAR(255),phone VARCHAR(255),province VARCHAR(255),district VARCHAR(255),localLevel VARCHAR(255), email VARCHAR(255) ,createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      {
        type: QueryTypes.CREATE,
      }
    );
    await sequelize.query(
      `INSERT INTO bloodBank (name,address,phone,province,district,localLevel,email) VALUES (?,?,?,?,?,?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          name,
          address || null,
          phone,
          province,
          district,
          localLevel,
          email,
        ],
      }
    );
    req.flash("success", "Successfully made a new bloodBank!");

    res.redirect("/bloodBank");
  } catch (error) {
    return res.render("error/pathError", { message: error, code: 400 });
  }
};

exports.getBloodBanks = async (req, res, next) => {
  const province = req.query.province;
  const district = req.query.district;
  const localLevel = req.query.localLevel;

  let bloodBanks;
  if (!province && !district && !localLevel) {
    // if no query parameters are provided, retrieve all users
    bloodBanks = await sequelize.query(`SELECT * FROM bloodBank`, {
      type: QueryTypes.SELECT,
    });
  } else if (!province && !district) {
    // if only the localLevel parameter is provided, filter by localLevel

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE localLevel='${localLevel}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  } else if (!province && !localLevel) {
    // if only the district parameter is provided, filter by district

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  } else if (!district && !localLevel) {
    // if only the province parameter is provided, filter by province

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE province='${province}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  } else if (!province) {
    // if district and localLevel parameters are provided, filter by both

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE localLevel='${localLevel}' AND district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  } else if (!district) {
    // if province and localLevel parameters are provided, filter by both

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE localLevel='${localLevel}' AND province='${province}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
  } else if (!localLevel) {
    // if province and district parameters are provided, filter by both

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE province='${province}' AND district='${district}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log("hello");
  } else {
    // if all parameters are provided, filter by all

    bloodBanks = await sequelize.query(
      `SELECT * FROM bloodBank WHERE localLevel='${localLevel}' AND district='${district}' AND province='${province}' `,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  const provinces = await sequelize.query("SELECT * FROM provinces", {
    type: QueryTypes.SELECT,
  });

  res.render("bloodBank/index", { bloodBanks, provinces });
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
