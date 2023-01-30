const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 3,
      required: [true, "Please add a name"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please add a category"],
    },
    tags: {
      type: [String],
      required: [true, "Please add a tags"],
    },
    description: {
      type: String,
      minLength: 10,
      required: [true, "Please add a description"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    photo: {
      type: mongoose.Schema.ObjectId,
      ref: "Photo",
      required: [true, "Please add a photo of project"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
