const express = require('express');

const {registerUser, loginUser, logoutUser, getUserProfile, changePassword, updateUserProfile} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/getUserProfile').get(isAuthenticated ,getUserProfile);
router.route('/changepassword').put(isAuthenticated ,changePassword);
router.route('/updateprofile').put(isAuthenticated, updateUserProfile);


module.exports = router;