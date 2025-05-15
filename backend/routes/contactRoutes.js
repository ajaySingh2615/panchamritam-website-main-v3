const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const contactController = require('../controllers/contactController');

// Public route for submitting contact form
router.post('/', contactController.submitContactForm);

// Admin routes - protected and restricted to admin role
// Uncomment the middleware when ready to implement authentication
// router.use(protect, restrictTo('admin'));

router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessageById);
router.put('/:id/status', contactController.updateMessageStatus);
router.post('/:id/reply', contactController.replyToMessage);
router.delete('/:id', contactController.deleteMessage);

module.exports = router; 