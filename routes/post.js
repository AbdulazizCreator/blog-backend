const express = require("express");
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/post");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

const Post = require("../models/Post");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Post, null, ["title", "description"]), getPosts)
  .post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
