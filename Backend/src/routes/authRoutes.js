const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
