const express = require("express");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

const Category = require("../models/Category");

const router = express.Router();

router
  .route("/")
  .get(
    advancedResults(Category, {
      path: "photo",
      select: "name",
    }),
    getCategories
  )
  .post(protect, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
