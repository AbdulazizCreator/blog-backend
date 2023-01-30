const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

exports.getPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getLatestPost = asyncHandler(async (req, res, next) => {
  let post = await Post.findOne()
    .sort({ _id: -1 })
    .limit(1)
    .populate("user category photo");
  res.status(200).json(post);
});

exports.getLatestPosts = asyncHandler(async (req, res, next) => {
  let post = await Post.find()
    .sort({ _id: -1 })
    .limit(10)
    .populate("user category photo");

  res.status(200).json(post);
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    "user category photo"
  );

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(post);
});

exports.createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({ ...req.body, user: req.user._id });
  res.status(201).json(post);
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(post);
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(null);
});
