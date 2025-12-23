import apiClient from './api/apiClient';

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  /**
   * Get all users (Admin only)
   * @returns {Promise} List of users
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Create new user (Admin only)
   * @param {Object} userData - User data
   * @returns {Promise} Created user data
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return response;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Update user (Admin only)
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete user (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} Current user data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/users/me');
      return response.success ? response.user : null;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}

export default new UserService();
