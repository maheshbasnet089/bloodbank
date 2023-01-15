const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

//routes import
const authRoute = require("./routes/authRoute");
const eventRoute = require("./routes/eventRoute");
const bloodBankRoute = require("./routes/bloodBankRoute");
const donorRoute = require("./routes/donorRoute");
const donorHistoryRoute = require("./routes/donorHistoryRoute");
const bloodRequestRoute = require("./routes/bloodRequestRoute");
const bookAppointmentRoute = require("./routes/bookAppointmentRoute");
const ambulanceRoute = require("./routes/ambulanceRoute");
const contactRoute = require("./routes/contactRoute");
const homeRoute = require("./routes/homeRoute");
const {
  renderCreateEventPage,
} = require("./controllers/event/eventController");
const { restrictTo } = require("./utils/restrictTo");
const { protectMiddleware } = require("./utils/isAuthenticated");
const {
  renderCreateBloodBank,
} = require("./controllers/bloodBank/bloodBankController");
const { sequelize } = require("./model");

//ejs and json configuration
app.use(require("cookie-parser")());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//parsing incoming req body data to json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  // console.log(req.cookies.jwtToken);
  res.locals.currentUser = req.cookies.jwtToken;
  res.locals.hospitalId = req.cookies.hospitalId;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  res.locals.shortenText = function (text, length) {
    return text.substring(0, length);
  };

  next();
});

// app.get("/", renderCreateEventPage);
app.get(
  "/admin/dashboard/createEvent",
  protectMiddleware,
  restrictTo("admin"),
  renderCreateEventPage
);
app.get(
  "/admin/dashboard/createBloodBank",
  protectMiddleware,
  restrictTo("admin"),
  renderCreateBloodBank
);

app.get("/districts", async (req, res) => {
  const districts = await sequelize.query(
    "SELECT * FROM districts WHERE province_id=? ",
    {
      replacements: [req.query.province_id],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  res.json(districts);
});
app.get("/districtsByName", async (req, res) => {
  const districtsByName = await sequelize.query(
    "SELECT districts.name FROM districts LEFT JOIN provinces p ON p.id = districts.province_id WHERE p.name=? ",
    {
      replacements: [req.query.name],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  await sequelize.query(
    "CREATE TABLE IF NOT EXISTS localLevel(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,districtId INT REFERENCES districts ON DELETE CASCADE ON UPDATE CASCADE,name VARCHAR(255)) ",
    {
      type: sequelize.QueryTypes.CREATE,
    }
  );
  const localLevel = await sequelize.query("SELECT * FROM localLevel", {
    type: sequelize.QueryTypes.SELECT,
  });

  if (localLevel.length === 0) {
    await sequelize.query(
      "INSERT INTO localLevel(id,districtId,name) VALUES(1,8,'Dharan'),(2,8,'Itahari'),(3,8,'Pachruki')",
      {
        type: sequelize.QueryTypes.INSERT,
      }
    );
  }

  res.json(districtsByName);
});
app.get("/localLevelByName", async (req, res, next) => {
  try {
    const localLevels = await sequelize.query(
      "SELECT localLevel.name FROM localLevel LEFT JOIN districts d ON d.id = localLevel.districtId WHERE d.name=? ",
      {
        replacements: [req.query.name],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(localLevels);
  } catch (error) {
    res.render("error/pathError", { message: error.message, code: 500 });
  }
});
//routes
app.use("/", homeRoute);
app.use("/", authRoute);
app.use("/events", eventRoute);
app.use("/bloodBank", bloodBankRoute);
app.use("/donor", donorRoute);
app.use("/donorHistory", donorHistoryRoute);
app.use("/bookAppointment", bookAppointmentRoute);
app.use("/bloodRequest", bloodRequestRoute);
app.use("/ambulance", ambulanceRoute);
app.use("/contact", contactRoute);

//error beside routes route
app.all("*", (req, res, next) => {
  const message = `Cannot find the path ${req.originalUrl}`;
  res.render("error/pathError", { message, code: 404 });
});

module.exports = app;
