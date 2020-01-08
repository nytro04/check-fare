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

  const {
    tripName,
    duration,
    origin,
    destination,
    fare,
    summary,
    imageCover,
    images,
    createdAt,
    arrivalTimes,
    departureTimes
  } = req.body;

  const newTrip = Trip.create(
    tripName,
    duration,
    origin,
    destination,
    fare,
    summary,
    imageCover,
    images,
    createdAt,
    arrivalTimes,
    departureTimes
  );

  // send respond
  res.status(201).json({
    status: "success",
    data: {
      trip: newTrip
    }
  });
});
