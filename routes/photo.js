const express = require("express");
const { uploadImage, deleteImage } = require("../controllers/photo");

const { protect } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(protect, uploadImage);

router.route("/:id").delete(protect, deleteImage);

module.exports = router;
