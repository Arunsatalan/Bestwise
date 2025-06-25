const Order = require('../models/Order');

// Get order history for logged-in user
exports.getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images salePrice retailPrice')
      .sort({ orderedAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order history', error: err.message });
  }
};
