const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");

const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//parsing incoming req body data to json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRoute);

app.all("*", (req, res, next) => {
  res.status(404).send(`Cannot find the path ${req.originalUrl}`, 404);
});

module.exports = app;
