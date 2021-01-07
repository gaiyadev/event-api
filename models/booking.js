const mongoose = require("mongoose");
require("../database/db");

const BookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Event",
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
