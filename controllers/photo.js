const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");
const PhotoSchema = require("../models/Photo");
const asyncHandler = require("../middleware/async");
const cloudinary = require("cloudinary");

// upload image
exports.uploadImage = asyncHandler(async (req, res, next) => {
  // we will upload image on cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

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
  photo = await PhotoSchema.create({ name: database_name });

  file.name = `${photo.id}${path.parse(file.name).ext}`;

  let file_name = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;

  file.mv(file_name, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });
  // cloudinary.v2.uploader.upload(
  //   file_name,
  //   { folder: "blog" },
  //   (err, result) => {
  //     if (err) throw err;
  //     console.log(result);
  //     res
  //       .status(201)
  //       .json({ public_id: result.public_id, url: result.secure_url });
  //   }
  // );

  // res.status(201).json(photo);
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
    return next(new ErrorResponse(`Problem with file delete`, 500));
  }
});
