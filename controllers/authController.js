const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true,
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // restrict to some roles, eg. sys-admin, sellers
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the right permissions to perform this action, contact the system admin",
          403
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // 2. Generate random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3. Send message to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Please visit this link:
  ${resetURL} to reset your password.
   \n If you didn't forget your password, Ignore this email`;

  try {
    await sendEmail({
      email,
      subject: "Password reset token(Valid for 15 minutes)",
      message
    });

    res.send(200).json({
      status: "success",
      message: "Token sent to email"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, try again later",
        5000
      )
    );
  }
});
