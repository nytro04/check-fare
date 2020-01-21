const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The Product Name field is required"],
    trim: true,
    maxlength: [50, "The Product name must not be more more than 50"],
    minlength: [10, "The Product name must be at least 10 characters long"]
  },
  // origin: {
  //   type: String,
  //   trim: true,
  //   required: [true, "The Product must have an origin"]
  // },
  // destination: {
  //   type: String,
  //   required: [true, "The Product must have a destination"]
  // },
  price: {
    type: Number,
    required: [true, "The Product must have a fare"]
  },
  description: {
    type: String,
    required: [true, "The Product must have a summary "]
  },
  imageCover: {
    type: String,
    required: [true, "The Product must have an image cover "]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
  // arrivalTimes: [Date],
  // departureTimes: [Date]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
