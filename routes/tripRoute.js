const express = require("express");
const {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip
} = require("./../controllers/tripController");

const router = express.Router();

router
  .route("/")
  .get(getAllTrips)
  .post(createTrip);

router
  .route("/:id")
  .get(getTrip)
  .patch(updateTrip)
  .delete(deleteTrip);

module.exports = router;
