const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Middleware to verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado'
      });
    }

    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.status === 'bloqueado') {
      return res.status(403).json({
        success: false,
        message: 'Usuario bloqueado'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware to verify admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren privilegios de administrador'
    });
  }
};

/**
 * Middleware to verify user role
 */
const isUser = (req, res, next) => {
  if (req.user && req.user.rol === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren privilegios de usuario'
    });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isUser
};
