const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/apiFeatures");

const signToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, role, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    role,
    confirmPassword
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password were provided
  if (!email || !password) {
    return next(new AppError("Please provide email and/or password", 400));
  }

  // 2. check if user exist and if password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"));
  }

  createSendToken(user, 200, res);
});

// access protected/authenticated routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1. get token if it exist
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please log in access this resources", 401));
  }

  // 2. Verify token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if user still exists
  const currentAuthUser = await User.findById(decodedToken.id);
  if (!currentAuthUser) {
    return next(
      new AppError("The user who owns this token no longer exist", 401)
    );
  }

  // 4. Check if user changed password after the token
  if (currentAuthUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password, please log in again")
    );
  }

  // GRANT USER ACCESS TO PROTECTED ROUTE
  req.user = currentAuthUser;

  next();
});
