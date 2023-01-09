const express = require("express");
const {
  getBloodBanks,
  createBloodBank,
  updateBloodBank,
  deleteBloodBank,
} = require("../controllers/bloodBank/bloodBankController");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { restrictTo } = require("../utils/restrictTo");

router
  .route("/")
  .get(catchAsync(getBloodBanks))
  .post(restrictTo("admin"), catchAsync(createBloodBank));
router
  .route("/:id")
  .patch(restrictTo("admin"), catchAsync(updateBloodBank))
  .delete(restrictTo("admin"), catchAsync(deleteBloodBank));

module.exports = router;
