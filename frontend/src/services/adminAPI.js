import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with common config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// User related data
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserAddresses = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/addresses`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserActivity = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/activity`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Categories
export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Products
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.patch(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Upload single product image
export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/products/${productId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Upload multiple gallery images
export const uploadGalleryImages = async (productId, imageFiles) => {
  try {
    const formData = new FormData();
    
    // Append each image to the form data
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post(`/products/${productId}/upload-gallery`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Save video URL
export const saveVideoUrl = async (productId, videoUrl) => {
  try {
    const response = await api.post(`/products/${productId}/save-video-url`, {
      video_url: videoUrl
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Roles
export const getAllRoles = async () => {
  try {
    const response = await api.get('/admin/roles');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Contact Messages - These functions are retained as commented code for reference
// They are no longer actively used since contact forms now go directly to email

/*
// Contact Messages
export const getContactMessages = async (params = {}) => {
  try {
    const response = await api.get('/contact', { params });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getContactMessageById = async (messageId) => {
  try {
    const response = await api.get(`/contact/${messageId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateContactMessageStatus = async (messageId, status) => {
  try {
    const response = await api.put(`/contact/${messageId}/status`, { status });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteContactMessage = async (messageId) => {
  try {
    const response = await api.delete(`/contact/${messageId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const sendContactReply = async (messageId, replyData) => {
  try {
    const response = await api.post(`/contact/${messageId}/reply`, replyData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Email Templates
export const getEmailTemplates = async () => {
  try {
    const response = await api.get('/contact/templates');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getEmailTemplateById = async (templateId) => {
  try {
    const response = await api.get(`/contact/templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createEmailTemplate = async (templateData) => {
  try {
    const response = await api.post('/contact/templates', templateData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateEmailTemplate = async (templateId, templateData) => {
  try {
    const response = await api.put(`/contact/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteEmailTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/contact/templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Email Listener Management
export const getEmailListenerStatus = async () => {
  try {
    const response = await api.get('/admin/email-listener/status');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const startEmailListener = async () => {
  try {
    const response = await api.post('/admin/email-listener/start');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const stopEmailListener = async () => {
  try {
    const response = await api.post('/admin/email-listener/stop');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const checkEmails = async () => {
  try {
    const response = await api.post('/admin/email-listener/check');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Check for new email replies
export const checkNewReplies = async (timestamp) => {
  try {
    const response = await api.get(`/contact/check-replies?t=${timestamp}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
*/

// Orders Management
export const getAllOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status, notes });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOrderAnalytics = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders/analytics', { params });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const exportOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const bulkUpdateOrderStatus = async (orderIds, status, notes = '') => {
  try {
    const response = await api.patch('/admin/orders/bulk-update', { 
      orderIds, 
      status, 
      notes 
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOrderStatistics = async (dateRange = 'week') => {
  try {
    const response = await api.get(`/admin/orders/statistics?range=${dateRange}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    return {
      message: data.message || 'An error occurred',
      status
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response from server',
      status: 503
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message,
      status: 500
    };
  }
}; 