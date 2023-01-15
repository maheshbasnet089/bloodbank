const express = require("express");
const {
  getBloodBanks,
  createBloodBank,
  updateBloodBank,
  deleteBloodBank,
  renderCreateBloodBank,
  renderUpdateBloodBankForm,
  renderHospitalLogin,
  hospitalLogin,
  renderHospitalDashboard,
} = require("../controllers/bloodBank/bloodBankController");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { protectMiddleware } = require("../utils/isAuthenticated");
const { restrictTo } = require("../utils/restrictTo");

// router
//   .route("/new")
//   .get(protectMiddleware, restrictTo("admin"), renderCreateBloodBank);
router.route("/update").get(renderUpdateBloodBankForm);
router
  .route("/")
  .get(catchAsync(getBloodBanks))
  .post(protectMiddleware, catchAsync(createBloodBank));
router
  .route("/:id")
  .patch(restrictTo("admin"), catchAsync(updateBloodBank))
  .delete(restrictTo("admin"), catchAsync(deleteBloodBank));

router
  .route("/hospitalLogin")
  .get(renderHospitalLogin)
  .post(catchAsync(hospitalLogin));
router.route("/dashboard/:id").get(renderHospitalDashboard);
module.exports = router;
