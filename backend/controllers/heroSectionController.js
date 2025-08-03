const HeroSection = require('../models/HeroSection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/hero-images/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hero-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get all slides (for admin)
const getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSection.find()
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: slides,
      count: slides.length
    });
  } catch (error) {
    console.error('Error fetching all slides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slides',
      error: error.message
    });
  }
};

// Get active slides (for public)
const getActiveSlides = async (req, res) => {
  try {
    const slides = await HeroSection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-createdBy -updatedBy');

    res.status(200).json({
      success: true,
      data: slides,
      count: slides.length
    });
  } catch (error) {
    console.error('Error fetching active slides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active slides',
      error: error.message
    });
  }
};

// Get slide by ID
const getSlideById = async (req, res) => {
  try {
    const slide = await HeroSection.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: slide
    });
  } catch (error) {
    console.error('Error fetching slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slide',
      error: error.message
    });
  }
};

// Create new slide
const createSlide = async (req, res) => {
  try {
    const { title, description, isActive, sortOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const slideData = {
      title,
      description,
      image: req.file.path,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
      createdBy: req.user?.id || null
    };

    const slide = new HeroSection(slideData);
    await slide.save();

    res.status(201).json({
      success: true,
      message: 'Slide created successfully',
      data: slide
    });
  } catch (error) {
    console.error('Error creating slide:', error);
    // Delete uploaded file if slide creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating slide',
      error: error.message
    });
  }
};

// Update slide
const updateSlide = async (req, res) => {
  try {
    const { title, description, isActive, sortOrder } = req.body;
    const slide = await HeroSection.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Update fields
    if (title !== undefined) slide.title = title;
    if (description !== undefined) slide.description = description;
    if (isActive !== undefined) slide.isActive = isActive;
    if (sortOrder !== undefined) slide.sortOrder = sortOrder;
    slide.updatedBy = req.user?.id || null;

    // Handle image update
    if (req.file) {
      // Delete old image
      if (slide.image && fs.existsSync(slide.image)) {
        fs.unlink(slide.image, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      slide.image = req.file.path;
    }

    await slide.save();

    res.status(200).json({
      success: true,
      message: 'Slide updated successfully',
      data: slide
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    // Delete uploaded file if update fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating slide',
      error: error.message
    });
  }
};

// Delete slide
const deleteSlide = async (req, res) => {
  try {
    const slide = await HeroSection.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Delete associated image file
    if (slide.image && fs.existsSync(slide.image)) {
      fs.unlink(slide.image, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await HeroSection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting slide',
      error: error.message
    });
  }
};

// Toggle slide status
const toggleSlideStatus = async (req, res) => {
  try {
    const slide = await HeroSection.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    slide.isActive = !slide.isActive;
    slide.updatedBy = req.user?.id || null;
    await slide.save();

    res.status(200).json({
      success: true,
      message: `Slide ${slide.isActive ? 'activated' : 'deactivated'} successfully`,
      data: slide
    });
  } catch (error) {
    console.error('Error toggling slide status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling slide status',
      error: error.message
    });
  }
};

// Update sort order
const updateSortOrder = async (req, res) => {
  try {
    const { slides } = req.body; // Array of {id, sortOrder}

    if (!Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'Slides array is required'
      });
    }

    const updatePromises = slides.map(({ id, sortOrder }) =>
      HeroSection.findByIdAndUpdate(
        id,
        { sortOrder, updatedBy: req.user?.id || null },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Sort order updated successfully'
    });
  } catch (error) {
    console.error('Error updating sort order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating sort order',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  getAllSlides,
  getActiveSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideStatus,
  updateSortOrder
};
