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

//ejs and json configuration
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
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//routes
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
  res.status(404).send(`Cannot find the path ${req.originalUrl}`, 404);
});

module.exports = app;
