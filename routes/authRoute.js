const express = require("express");
const {
  createUser,
  renderRegister,
} = require("../controllers/auth/authController");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.route("/register").post(catchAsync(createUser)).get(renderRegister);

module.exports = router;
