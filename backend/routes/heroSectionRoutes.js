const express = require('express');
const router = express.Router();
const {
  upload,
  getAllSlides,
  getActiveSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideStatus,
  updateSortOrder
} = require('../controllers/heroSectionController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveSlides);

// Admin routes (with authentication)
router.get('/', getAllSlides);
router.get('/:id', getSlideById);
router.post('/', isAuthenticated, authorizeRoles('admin'), upload.single('image'), createSlide);
router.put('/:id', isAuthenticated, authorizeRoles('admin'), upload.single('image'), updateSlide);
router.patch('/:id/toggle', isAuthenticated, authorizeRoles('admin'), toggleSlideStatus);
router.patch('/sort-order', isAuthenticated, authorizeRoles('admin'), updateSortOrder);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteSlide);

module.exports = router;
