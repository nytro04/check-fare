const express = require("express");
const morgan = require("morgan");
const tripRouter = require("./routes/tripRoute");
const AppError = require("./utils/appError");

const app = express();

//Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/trips", tripRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 400));
});

module.exports = app;
