const express = require('express');
const { getUserOrderHistory } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Get order history for logged-in user
router.get('/history', isAuthenticated, getUserOrderHistory);

module.exports = router;
