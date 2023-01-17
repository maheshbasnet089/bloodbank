const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");

const { QueryTypes, DataTypes } = require("sequelize");

exports.renderHomePage = async (req, res, next) => {
  await sequelize.query(
    " CREATE TABLE IF NOT EXISTS bloodGroup(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255))",
    {
      type: QueryTypes.CREATE,
    }
  );
  const bloodGroup = await sequelize.query("SELECT * FROM bloodGroup", {
    type: QueryTypes.SELECT,
  });
  if (bloodGroup.length == 0) {
    await sequelize.query(
      "INSERT INTO bloodGroup (name) VALUES ('A+'),('A-'),('B+'),('B-'),('AB+'),('AB-'),('O+'),('O-')",
      {
        type: QueryTypes.INSERT,
      }
    );
  }

  const events = await sequelize.query("SELECT * FROM events", {
    type: QueryTypes.SELECT,
  });

  res.render("home/index", { events });
};
