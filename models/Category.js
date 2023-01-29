const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: [true, "Please add a name"],
    },
    description: {
      type: String,
      minLength: 10,
      required: [true, "Please add a description"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    photo: {
      type: mongoose.Schema.ObjectId,
      ref: "Photo",
      required: [true, "Please add a photo of project"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
