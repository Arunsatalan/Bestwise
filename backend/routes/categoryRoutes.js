const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const Category = require("../models/Category");

// Get all categories
router.get("/", getAllCategories);

// ✅ Add nested route before generic :id route
router.get("/:categoryKey/attributes/:attributeName/items/:itemValue", async (req, res) => {
    const { categoryKey, attributeName, itemValue } = req.params;
    try {
        const category = await Category.findOne({ key: categoryKey });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        const attribute = category.attributes.find(attr => attr.name === attributeName);
        if (!attribute) {
            return res.status(404).json({ success: false, message: "Attribute not found in this category" });
        }
        const itemExists = attribute.items.includes(itemValue);
        if (!itemExists) {
            return res.status(404).json({ success: false, message: "Item not found under this attribute" });
        }
        res.json({
            success: true,
            message: "Item found under attribute",
            data: {
                category: categoryKey,
                attribute: attributeName,
                item: itemValue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Get category by ID
router.get("/:id", getCategoryById);

// Create new category
router.post("/", createCategory);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

// Add a new value to a category's attribute
router.post("/:categoryKey/attributes/:attributeName/items", async (req, res) => {
    const { categoryKey, attributeName } = req.params;
    const { value } = req.body;
    const Category = require("../models/Category");

    try {
        if (!value || !value.trim()) {
            return res.status(400).json({ success: false, message: "Value is required" });
        }

        const category = await Category.findOne({ key: categoryKey });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const attribute = category.attributes.find(attr => attr.name === attributeName);
        if (!attribute) {
            return res.status(404).json({ success: false, message: "Attribute not found in this category" });
        }

        // Check if value already exists
        if (attribute.items.includes(value.trim())) {
            return res.status(400).json({ success: false, message: "Value already exists in this attribute" });
        }

        // Add the new value to the attribute's items array
        attribute.items.push(value.trim());

        await category.save();

        res.json({
            success: true,
            message: "Value added to attribute successfully",
            data: {
                category: categoryKey,
                attribute: attributeName,
                addedValue: value.trim()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding value", error: error.message });
    }
});

// Delete a value from a category's attribute
router.delete("/:categoryKey/attributes/:attributeName/items/:itemValue", async (req, res) => {
    const { categoryKey, attributeName, itemValue } = req.params;
    const Category = require("../models/Category"); // Make sure this path matches your model filename

    try {
        const category = await Category.findOne({ key: categoryKey });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const attribute = category.attributes.find(attr => attr.name === attributeName);
        if (!attribute) {
            return res.status(404).json({ success: false, message: "Attribute not found in this category" });
        }

        // Remove the item from the attribute's items array
        const itemIndex = attribute.items.indexOf(itemValue);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found under this attribute" });
        }
        attribute.items.splice(itemIndex, 1);

        await category.save();

        res.json({
            success: true,
            message: "Item deleted from attribute",
            data: {
                category: categoryKey,
                attribute: attributeName,
                deletedItem: itemValue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting item", error: error.message });
    }
});

router.get('/:categoryKey', async (req, res) => {
    const { categoryKey } = req.params;
    const Category = require("../models/Category"); // Make sure this matches your model filename

    try {
        const category = await Category.findOne({ key: categoryKey });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
    }
});

module.exports = router;
