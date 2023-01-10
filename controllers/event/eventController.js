const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");
const { cloudinary } = require("../../cloudinary");

const { QueryTypes, DataTypes } = require("sequelize");
exports.renderCreateEventPage = async (req, res, next) => {
  res.render("events/createForm");
};
exports.createEvent = async (req, res, next) => {
  const {
    title,

    date,
    description,
    phone,
    province,
    district,
    localLevel,
    time,
    streetAddress,
  } = req.body;
  const madeBy = "Admin";
  const address = province + "," + district + " ," + localLevel;

  if (
    !title ||
    !madeBy ||
    !date ||
    !description ||
    !address ||
    !phone ||
    !province ||
    !district ||
    !time ||
    !streetAddress
  )
    return next(new AppError("Please provide all fields", 400));
  try {
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS events(id NOT NULL PRIMARY KEY AUTO_INCREMENT,title VARCHAR(255),description VARCHAR(255),address VARCHAR(255),phone VARCHAR(255),province VARCHAR(255),district VARCHAR(255),localLevel VARCHAR(255),time DATETIME,streetAddress VARCHAR(255), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,date DATE`,
      {
        types: QueryTypes.CREATE,
      }
    );
    await sequelize.query(
      "INSERT INTO events (title,description,address,phone,date,madeBy,province,district,localLevel,time,streetAddress) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      {
        types: QueryTypes.INSERT,
        replacements: [
          title,
          description,
          address,
          phone,
          date,
          madeBy,
          province,
          district,
          localLevel,
          time,
          streetAddress,
        ],
      }
    );
    req.flash("success", "Successfully made a new event!");
    res.render("events/index", { events });
  } catch (error) {
    return res.json({
      status: 400,
      err: error,
    });
  }
};

exports.getEvents = async (req, res, next) => {
  const events = await sequelize.query(`SELECT * FROM events`, {
    types: QueryTypes.SELECT,
  });
  res.render("events/index", { events });
};

exports.getIndividualEvent = async (req, res, next) => {
  const event = await sequelize.query(`SELECT * FROM events WHERE id=?`, {
    types: QueryTypes.SELECT,
    replacements: [req.params.id],
  });
  if (!event) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/events");
  }
  res.render("events/showIndividual", { event });
};

exports.renderUpdateEventForm = async (req, res, next) => {
  const event = await sequelize.query(`SELECT * FROM events WHERE id=?`, {
    types: QueryTypes.SELECT,
    replacements: [req.params.id],
  });
  if (!event) {
    req.flash("error", "Cannot find that event!");

    return res.render("error", { message: "Cannot find event with that id " });
  }
  res.render("events/updateForm", { event });
};

exports.updateEvent = async (req, res, next) => {
  const {
    title,
    madeBy,
    date,
    description,
    phone,
    province,
    district,
    localLevel,
    time,
    streetAddress,
  } = req.body;
  const address =
    province + "," + district + " ," + localLevel + "," + streetAddress;

  await sequelize.query(
    `UPDATE events SET title=?,madeBy=?,description=?,address=?,phone=?,date=?,province=?,district=?,,localLevel=?,time=?,streetAddress=? WHERE id=?`,
    {
      types: QueryTypes.UPDATE,
      replacements: [
        title,
        madeBy,
        description,
        address,
        phone,
        date,
        province,
        district,
        localLevel,
        time,
        streetAddress,
        req.params.id,
      ],
    }
  );
  req.flash("success", "Successfully updated event!");

  res.redirect("/events");
};

exports.deleteEvent = async (req, res, next) => {
  await sequelize.query(`DELETE FROM events WHERE id=?`, {
    types: QueryTypes.DELETE,
    replacements: [req.params.id],
  });
  req.flash("success", "Successfully deleted event!");

  res.redirect("/events");
};
