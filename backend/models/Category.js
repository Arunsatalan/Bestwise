const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Category key is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    attributes: {
      type: Map,
      of: [String],
      default: {},
    },
    icon: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for product count
categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "key",
  foreignField: "mainCategory",
  count: true,
})

// Indexes
categorySchema.index({ key: 1 })
categorySchema.index({ isActive: 1 })
categorySchema.index({ sortOrder: 1 })

module.exports = mongoose.model("Category", categorySchema)
