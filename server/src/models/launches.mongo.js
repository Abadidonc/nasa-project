const { Schema, model } = require("mongoose");

const launchesSchema = new Schema({
  flightNumber: {
    type: Number,
    require: true,
  },
  launchDate: {
    type: Date,
    require: true,
  },
  mission: {
    type: String,
    require: true,
  },
  rocket: {
    type: String,
    require: true,
  },
  destination: {
    type: String,
  },
  upcoming: {
    type: Boolean,
    require: true,
  },
  success: {
    type: Boolean,
    require: true,
    default: true,
  },
  customers: [String],
});

module.exports = model("Launch", launchesSchema);
