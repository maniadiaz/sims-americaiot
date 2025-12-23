const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input - debe tener (username o email) y password
    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username o email, y password son requeridos'
      });
    }

    // Find user by username or email
    const whereClause = username
      ? { username }
      : { email };

    const user = await User.findOne({ where: whereClause });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Check if user is blocked
    if (user.status === 'bloqueado') {
      return res.status(403).json({
        success: false,
        message: 'Usuario bloqueado. Contacte al administrador'
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      rol: user.rol
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        username: user.username,
        rol: user.rol,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * Verify token
 */
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        nombre: req.user.nombre,
        apellidos: req.user.apellidos,
        email: req.user.email,
        username: req.user.username,
        rol: req.user.rol,
        status: req.user.status
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

module.exports = {
  login,
  logout,
  verifyToken
};
