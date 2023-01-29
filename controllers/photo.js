const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");
const PhotoSchema = require("../models/Photo");
const asyncHandler = require("../middleware/async");

// upload image
exports.uploadImage = asyncHandler(async (req, res, next) => {
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
  database_name = `photo${path.parse(file.name).ext}`;
  console.log(database_name);
  photo = await PhotoSchema.create({ name: database_name });

  file.name = `${photo.id}${path.parse(file.name).ext}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });
  res.status(201).json({ success: true, data: photo });
});

exports.deleteImage = asyncHandler(async (req, res, next) => {
  try {
    const photo = await PhotoSchema.findById(req.params.id);
    fs.unlinkSync(
      `${process.env.FILE_UPLOAD_PATH}/${req.params.id}.${
        photo.name.split(".")[1]
      }`
    );
    await PhotoSchema.findByIdAndDelete(photo.id);
    res.status(200).json({ message: "Image deleted" });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(`Problem with file delete`, 500));
  }
});
