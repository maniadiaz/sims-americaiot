const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Get current user (any authenticated user)
router.get('/me', authenticateToken, getCurrentUser);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.post('/', authenticateToken, isAdmin, createUser);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
