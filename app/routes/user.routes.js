const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router; 