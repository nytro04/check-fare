const Trip = require("./../models/tripModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

// Routes Handlers

// get all trips
exports.getAllTrips = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Trip.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const trips = await features.query;

  // send response
  res.status(200).json({
    status: "success",
    results: trips.length,
    data: {
      trips
    }
  });
});

// get single trip
exports.getTrip = catchAsync(async (req, res, next) => {
  // const trip = await Trip.findById({_id: req.params.id})
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError("No trip found with ID", 404));
  }

  //send respond if trip was found
  res.status(200).json({
    status: "success",
    data: {
      trip
    }
  });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  // const newTrip = new Trip({})
  // newTrip.save()

  const newTrip = await Trip.create(req.body);

  // send respond
  res.status(201).json({
    status: "success",
    data: {
      trip: newTrip
    }
  });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!trip) {
    return next(new AppError("No trip found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      trip
    }
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);

  if (!trip) {
    return next(new AppError("No trip found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});
