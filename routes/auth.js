const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  uploadUserImage,
  updatePassword,
  deleteUserImage,
} = require("../controllers/auth");

router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/details", protect, updateDetails);
router.put("/password", protect, updatePassword);
router.post("/upload", protect, uploadUserImage);
router.delete("/upload/:file", protect, deleteUserImage);

module.exports = router;
