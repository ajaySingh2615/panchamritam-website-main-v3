const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/categories', blogController.getAllCategories);
router.get('/tags', blogController.getAllTags);
router.get('/tags/popular', blogController.getPopularTags);
router.get('/category/:slug', blogController.getBlogsByCategory);
router.get('/tag/:slug', blogController.getBlogsByTag);
router.get('/:slug', blogController.getBlogBySlug);

// Protected routes (require authentication)
router.use(protect);

// Admin routes for blog management
router.get('/admin/statistics', restrictTo('admin'), blogController.getBlogStatistics);
router.get('/admin/:id', restrictTo('admin'), blogController.getBlogById);
router.post('/', restrictTo('admin'), blogController.createBlog);
router.put('/:id', restrictTo('admin'), blogController.updateBlog);
router.delete('/:id', restrictTo('admin'), blogController.deleteBlog);

// Admin routes for category management
router.post('/categories', restrictTo('admin'), blogController.createCategory);
router.put('/categories/:id', restrictTo('admin'), blogController.updateCategory);
router.delete('/categories/:id', restrictTo('admin'), blogController.deleteCategory);

// Admin routes for tag management
router.post('/tags', restrictTo('admin'), blogController.createTag);
router.put('/tags/:id', restrictTo('admin'), blogController.updateTag);
router.delete('/tags/:id', restrictTo('admin'), blogController.deleteTag);

module.exports = router; 