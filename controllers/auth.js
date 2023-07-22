const path = require("path");
const fs = require("fs");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Register user
// @route  POST /api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, password, username } = req.body;

  // Check for user
  const user = await User.findOne({ username });

  if (user) {
    return next(new ErrorResponse("Bu foydalanuvchi mavjud !", 400));
  }

  // Create user
  const newUser = await User.create({
    first_name,
    last_name,
    username,
    password,
  });

  sendTokenResponse(newUser, 200, res);
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new ErrorResponse("Foydalanuvchi nomi va parolni kiriting !", 400)
    );
  }

  // Check for user
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Bu foydalanuvchi mavjud emas !", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Parol xato !", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc   Get current user data
// @route  GET /api/v1/auth/me
// @access private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidors: true,
  });

  res.status(200).json(user);
});

// @desc   Update User Password
// @route  POST /api/v1/auth/updatepassword
// @access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  const isEqual = await user.matchPassword(req.body.currentPassword);

  if (!isEqual) {
    return next(new ErrorResponse("Current Password is incorrect", 401));
  }

  user.password = req.body.password;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc   Get current user data
// @route  GET /api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(user);
});

// @desc   Upload photo for user
// @route  POST /api/v1/auth/photo
// @access Private

exports.uploadUserImage = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `user_${req.user._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await User.findByIdAndUpdate(req.user.id, { photo: file.name });
  });

  res.status(201).json(file.name);
});

exports.deleteUserImage = asyncHandler(async (req, res, next) => {
  try {
    fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${req.params.file}`);
    await User.findByIdAndUpdate(req.user.id, { photo: null });
    res.status(200).json({ message: "Image deleted" });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(`Problem with file delete`, 500));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  let data = {
    expire: Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    token,
    role: user.role,
  };
  res.status(statusCode).cookie("TOKEN", token, options).json(data);
};
