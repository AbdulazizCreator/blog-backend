const express = require("express");
const {
  getComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

const Comment = require("../models/Comment");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Comment), getComments)
  .post(protect, createComment);

router
  .route("/:id")
  .get(getComment)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
