const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION!!! 🦟 🐞 shutting down server");
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

// DB and DB connection
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB Connection successful 🚀 🚀 🚀 ... "));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port} 🔥 🔥 🔥 ...`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION!!! 🦟 🐞, shutting down server");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
