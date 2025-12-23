import apiClient from './api/apiClient';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   * @param {string} identifier - User's username or email
   * @param {string} password - User's password
   * @returns {Promise} Response with user data and token
   */
  async login(identifier, password) {
    try {
      // Determinar si el identifier es un email o username
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      const response = await apiClient.post('/auth/login', {
        ...(isEmail ? { email: identifier } : { username: identifier }),
        password,
      });

      // Store auth token if present
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');

        if (response.user?.rol) {
          localStorage.setItem('userRole', response.user.rol);
        }

        if (response.user) {
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userName', `${response.user.nombre} ${response.user.apellidos}`);
        }
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    }
  }

  /**
   * Verify token validity
   * @returns {Promise} User data if token is valid
   */
  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return localStorage.getItem('authToken') !== null &&
           localStorage.getItem('isAuthenticated') === 'true';
  }

  /**
   * Get current user role
   * @returns {string|null} User role
   */
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  /**
   * Get current user ID
   * @returns {string|null} User ID
   */
  getUserId() {
    return localStorage.getItem('userId');
  }

  /**
   * Get current user name
   * @returns {string|null} User name
   */
  getUserName() {
    return localStorage.getItem('userName');
  }
}

export default new AuthService();
