const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
