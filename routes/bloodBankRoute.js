const express = require("express");
const {
  getBloodBanks,
  createBloodBank,
  updateBloodBank,
  deleteBloodBank,
  renderCreateBloodBank,
  renderUpdateBloodBankForm,
} = require("../controllers/bloodBank/bloodBankController");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { restrictTo } = require("../utils/restrictTo");

router.route("/new").get(renderCreateBloodBank);
router.route("/update").get(renderUpdateBloodBankForm);
router
  .route("/")
  .get(catchAsync(getBloodBanks))
  .post(restrictTo("admin"), catchAsync(createBloodBank));
router
  .route("/:id")
  .patch(restrictTo("admin"), catchAsync(updateBloodBank))
  .delete(restrictTo("admin"), catchAsync(deleteBloodBank));

module.exports = router;
