const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel.js")(sequelize, DataTypes, bcrypt, crypto);

db.sequelize.sync({ force: false }).then(async () => {
  console.log("yes re-sync done");
});

module.exports = db;
