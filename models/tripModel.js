const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The trip Name field is required"],
    trim: true,
    maxlength: [50, "The trip name must not be more more than 50"],
    minlength: [10, "The trip name must be at least 10 characters long"]
  },
  duration: {
    type: Date,
    required: [true, "The trip must have a duration"]
  },
  origin: {
    type: String,
    required: [true, "The trip must have an origin"]
  },
  destination: {
    type: String,
    required: [true, "The trip must have a destination"]
  },
  fare: {
    type: Number,
    required: [true, "The trip must have a fare"]
  },
  summary: {
    type: String,
    required: [true, "The trip must have a summary "]
  },
  imageCover: {
    type: String,
    required: [true, "The trip must have an image cover "]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  arrivalTimes: [Date],
  departureTimes: [Date]
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
