const express = require("express");
const {
  getDonationHistory,
  createDonorHistory,
  deleteDonorHistory,
} = require("../controllers/donorHistory/donorHistory");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router
  .route("/")
  .get(catchAsync(getDonationHistory))
  .post(catchAsync(createDonorHistory));
router.route("/:id").delete(catchAsync(deleteDonorHistory));

module.exports = router;
