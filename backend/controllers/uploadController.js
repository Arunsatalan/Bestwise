const cloudinary = require("../config/cloudinary")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// Configure multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm"],
    resource_type: "auto",
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."), false)
    }
  },
})

// Upload single file
exports.uploadSingle = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        })
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        })
      }

      res.json({
        success: true,
        message: "File uploaded successfully",
        data: {
          id: req.file.filename,
          url: req.file.path,
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        },
      })
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    })
  }
}

// Upload multiple files
exports.uploadMultiple = async (req, res) => {
  try {
    upload.array("files", 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        })
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        })
      }

      const uploadedFiles = req.files.map((file) => ({
        id: file.filename,
        url: file.path,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
      }))

      res.json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles,
      })
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    })
  }
}

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      })
    }

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "File deleted successfully",
      })
    } else {
      res.status(404).json({
        success: false,
        message: "File not found or already deleted",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    })
  }
}

// Get upload signature for direct uploads
exports.getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const params = {
      timestamp: timestamp,
      folder: "ecommerce-products",
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: "ecommerce-products",
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating upload signature",
      error: error.message,
    })
  }
}
