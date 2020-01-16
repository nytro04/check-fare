const express = require("express");

const { signup } = require("./../controllers/authController");

const router = express.Router();

// Auth Routes
router.post("/signup", signup);

router
  .route("/")
  .get()
  .post();

router
  .route("/:id")
  .get()
  .patch()
  .delete();

module.exports = router;
