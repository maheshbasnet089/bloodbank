const express = require("express");
const {
  createDonor,
  getDonors,
  deleteDonor,
} = require("../controllers/donor/donorController");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { restrictTo } = require("../utils/restrictTo");

router
  .route("/")
  .get(catchAsync(getDonors))
  .post(restrictTo("donor"), catchAsync(createDonor));

router.route("/:id").delete(catchAsync(deleteDonor));

module.exports = router;
