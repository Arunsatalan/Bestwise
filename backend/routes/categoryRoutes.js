const express = require("express")
const router = express.Router()
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController")

// Get all categories
router.get("/", getAllCategories)

// Get category by ID
router.get("/:id", getCategoryById)

// Create new category
router.post("/", createCategory)

// Update category
router.put("/:id", updateCategory)

// Delete category
router.delete("/:id", deleteCategory)

module.exports = router 