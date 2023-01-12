const express = require("express");
const {
  createUser,
  renderRegister,
  loginUser,
  renderLogin,
  logOut,
} = require("../controllers/auth/authController");
const { renderHomePage } = require("../controllers/home/homeController");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.route("/register").post(catchAsync(createUser)).get(renderRegister);
router.route("/login").post(catchAsync(loginUser)).get(renderLogin);
router.route("/logOut").get(catchAsync(logOut));

module.exports = router;
