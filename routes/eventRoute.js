const express = require("express");
const {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  renderCreateEventPage,
  renderUpdateEventForm,
} = require("../controllers/event/eventController");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { restrictTo } = require("../utils/restrictTo");
// const { storage } = require("../cloudinary");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

router.route("/new").get(renderCreateEventPage);
router.route("/update").get(renderUpdateEventForm);
router
  .route("/")
  .get(catchAsync(getEvents))
  .post(restrictTo("admin"), catchAsync(createEvent));
router
  .route("/:id")
  .patch(restrictTo("admin"), catchAsync(updateEvent))
  .delete(restrictTo("admin"), catchAsync(deleteEvent));

module.exports = router;
