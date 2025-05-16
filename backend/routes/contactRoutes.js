const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Public route for submitting contact form
router.post('/', contactController.submitContactForm);

// All other routes have been removed as we're now using direct email
// instead of storing messages in the database

// NOTE: The following routes are kept commented out for reference only
// Admin routes for managing contact messages
/*
router.get('/', isAuthenticated, isAdmin, contactController.getAllMessages);
router.get('/:id', isAuthenticated, isAdmin, contactController.getMessageById);
router.put('/:id/status', isAuthenticated, isAdmin, contactController.updateMessageStatus);
router.post('/:id/reply', isAuthenticated, isAdmin, contactController.replyToMessage);
router.delete('/:id', isAuthenticated, isAdmin, contactController.deleteMessage);

// Email templates
router.get('/templates', isAuthenticated, isAdmin, contactController.getAllTemplates);
router.post('/templates', isAuthenticated, isAdmin, contactController.createTemplate);
router.get('/templates/:id', isAuthenticated, isAdmin, contactController.getTemplateById);
router.put('/templates/:id', isAuthenticated, isAdmin, contactController.updateTemplate);
router.delete('/templates/:id', isAuthenticated, isAdmin, contactController.deleteTemplate);

// Checking for new email replies
router.get('/check-replies', isAuthenticated, isAdmin, contactController.checkNewReplies);
*/

module.exports = router; 