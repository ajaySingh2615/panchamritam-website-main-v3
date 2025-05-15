const ContactMessage = require('../models/contactMessage');
const { AppError } = require('../middlewares/errorHandler');
const { sendContactReply } = require('../utils/emailService');

// Submit contact form (public)
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return next(new AppError('Name, email, and message are required', 400));
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
    
    // Create contact message
    const newMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully',
      data: {
        id: newMessage.messageId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact messages (admin only)
exports.getAllMessages = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const { search, status, startDate, endDate } = req.query;
    
    // Get messages with filters
    try {
      const messages = await ContactMessage.findFiltered({
        limit,
        page,
        search,
        status,
        startDate,
        endDate
      });
      
      // Count total messages for pagination
      const totalMessages = await ContactMessage.countMessages({
        search,
        status,
        startDate,
        endDate
      });
      
      const totalPages = Math.ceil(totalMessages / limit);
      
      res.status(200).json({
        status: 'success',
        results: messages.length,
        pagination: {
          page,
          limit,
          totalMessages,
          totalPages,
          hasMore: page < totalPages
        },
        data: {
          messages
        }
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// Get contact message by ID (admin only)
exports.getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);
    
    if (!message) {
      return next(new AppError('Message not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update contact message status (admin only)
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['unread', 'read', 'in_progress', 'replied', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return next(new AppError('Invalid status. Must be one of: unread, read, in_progress, replied, archived', 400));
    }
    
    const updated = await ContactMessage.updateStatus(id, status);
    
    if (!updated) {
      return next(new AppError('Message not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Message status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reply to contact message (admin only)
exports.replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, message, recipientEmail, recipientName } = req.body;
    
    // Validation
    if (!subject || !message || !recipientEmail || !recipientName) {
      return next(new AppError('Subject, message, recipient email and name are required', 400));
    }
    
    // Get the message to make sure it exists
    const contactMessage = await ContactMessage.findById(id);
    
    if (!contactMessage) {
      return next(new AppError('Message not found', 404));
    }
    
    // Send the email
    await sendContactReply(recipientEmail, recipientName, subject, message);
    
    // Update the message status to 'replied'
    await ContactMessage.updateStatus(id, 'replied');
    
    res.status(200).json({
      status: 'success',
      message: 'Reply sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact message (admin only)
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.delete(id);
    
    if (!deleted) {
      return next(new AppError('Message not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 