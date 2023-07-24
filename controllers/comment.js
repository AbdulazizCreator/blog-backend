const asyncHandler = require("../middleware/async");
const Comment = require("../models/Comment");
const ErrorResponse = require("../utils/errorResponse");

exports.getComments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(comment);
});

exports.createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({ ...req.body, user: req.user._id });
  res.status(201).json(comment);
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(comment);
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(null);
});
