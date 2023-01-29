const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name of a photo"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
