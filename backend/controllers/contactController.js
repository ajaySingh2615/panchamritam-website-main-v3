const { AppError } = require('../middlewares/errorHandler');
const ContactMessage = require('../models/contactMessage');
const EmailTemplate = require('../models/emailTemplate');
const EmailReply = require('../models/emailReply');
const { sendContactReply, sendContactFormToAdmin } = require('../utils/emailService');
const { pool } = require('../config/db');

// Helper to generate a unique message ID for tracking replies
const generateMessageId = (originalMessageId) => {
  return `msg-${originalMessageId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// Submit contact form (public)
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return next(new AppError('Name, email, and message are required', 400));
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
    
    // Send email to admin with auto-reply to user
    await sendContactFormToAdmin({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      phone
    }, true); // true = send auto-reply to user
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    next(new AppError('Failed to send your message. Please try again later.', 500));
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
      let messages = await ContactMessage.findFiltered({
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
      
      // For each message, get the replies if it has a thread_id
      const messagesWithReplies = await Promise.all(
        messages.map(async (message) => {
          // Skip if no thread_id
          if (!message.thread_id) {
            return message;
          }
          
          // Get all replies in this thread
          const replies = await ContactMessage.findByThreadId(
            message.thread_id, 
            message.message_id
          );
          
          // Get any email replies
          const emailReplies = await EmailReply.findByOriginalMessageId(
            message.message_id
          );
          
          // Combine all replies and sort by timestamp
          const allReplies = [
            ...replies.map(reply => ({
              reply_id: reply.message_id,
              original_message_id: reply.parent_message_id,
              message: reply.message,
              subject: reply.subject,
              timestamp: reply.submitted_at,
              sent_at: reply.submitted_at,
              is_admin: reply.name === 'Admin',
              sender: reply.name
            })),
            ...emailReplies.map(reply => ({
              reply_id: reply.reply_id,
              original_message_id: reply.original_message_id,
              message: reply.reply_content,
              timestamp: reply.received_at,
              is_admin: false,
              sender: message.name
            }))
          ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          // Return message with replies
          return {
            ...message,
            replies: allReplies,
            has_replies: allReplies.length > 0
          };
        })
      );
      
      res.status(200).json({
        status: 'success',
        results: messagesWithReplies.length,
        pagination: {
          page,
          limit,
          totalMessages,
          totalPages,
          hasMore: page < totalPages
        },
        data: {
          messages: messagesWithReplies
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
    
    // Get related replies if this is a threaded conversation
    let replies = [];
    
    if (message.thread_id) {
      // Get all messages in this thread
      replies = await ContactMessage.findByThreadId(message.thread_id, message.message_id);
    }
    
    // Get email replies if any
    const emailReplies = await EmailReply.findByOriginalMessageId(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        message,
        thread: {
          replies,
          emailReplies
        }
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
    
    // Validate status - ENUM values from database
    const validStatuses = ['unread', 'read', 'in_progress', 'replied', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
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
    const { subject, message, recipientEmail, recipientName, templateId } = req.body;
    
    // Validation
    if (!subject || !message || !recipientEmail || !recipientName) {
      return next(new AppError('Subject, message, recipient email and name are required', 400));
    }
    
    // Get the message to make sure it exists
    const contactMessage = await ContactMessage.findById(id);
    
    if (!contactMessage) {
      return next(new AppError('Message not found', 404));
    }
    
    // Get thread ID or create one if it doesn't exist
    const threadId = contactMessage.thread_id || 
                    `thread-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // If the original message doesn't have a thread ID, update it
    if (!contactMessage.thread_id) {
      await ContactMessage.updateThreadId(id, threadId);
    }
    
    // Create a message reference ID for tracking
    const messageReference = generateMessageId(id);
    
    // Create a new message for the reply in our system
    const replyMessage = await ContactMessage.create({
      name: 'Admin',
      email: process.env.EMAIL_USER,
      subject: subject,
      message: message,
      status: 'replied',
      thread_id: threadId,
      is_reply: true,
      parent_message_id: parseInt(id),
      message_reference: messageReference
    });
    
    // Send the email
    await sendContactReply(
      recipientEmail, 
      recipientName, 
      subject, 
      message, 
      id, 
      templateId
    );
    
    // Update the original message status to 'replied'
    await ContactMessage.updateStatus(id, 'replied');
    
    res.status(200).json({
      status: 'success',
      message: 'Reply sent successfully',
      data: {
        replyId: replyMessage.messageId
      }
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

// Get all email templates (admin only)
exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplate.findAll();
    
    res.status(200).json({
      status: 'success',
      results: templates.length,
      data: {
        templates
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new email template (admin only)
exports.createTemplate = async (req, res, next) => {
  try {
    const { name, subject, body, category, variables } = req.body;
    
    // Validation
    if (!name || !subject || !body) {
      return next(new AppError('Name, subject, and body are required', 400));
    }
    
    // Create template
    const newTemplate = await EmailTemplate.create({
      name,
      subject,
      body,
      category: category || 'general',
      variables
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        template: newTemplate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get email template by ID (admin only)
exports.getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findById(id);
    
    if (!template) {
      return next(new AppError('Template not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        template
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update email template (admin only)
exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject, body, category, variables } = req.body;
    
    // Validation
    if (!name && !subject && !body && !category && !variables) {
      return next(new AppError('At least one field must be provided for update', 400));
    }
    
    // Get existing template
    const existingTemplate = await EmailTemplate.findById(id);
    
    if (!existingTemplate) {
      return next(new AppError('Template not found', 404));
    }
    
    // Update template
    const updated = await EmailTemplate.update(id, {
      name: name || existingTemplate.name,
      subject: subject || existingTemplate.subject,
      body: body || existingTemplate.body,
      category: category || existingTemplate.category,
      variables: variables || existingTemplate.variables
    });
    
    if (!updated) {
      return next(new AppError('Failed to update template', 500));
    }
    
    // Get updated template
    const updatedTemplate = await EmailTemplate.findById(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        template: updatedTemplate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete email template (admin only)
exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await EmailTemplate.delete(id);
    
    if (!deleted) {
      return next(new AppError('Template not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Check for new email replies to contact messages
exports.checkNewReplies = async (req, res, next) => {
  try {
    // Import the dedicated script that handles reply processing
    const { processNewReplies } = require('../scripts/checkReplies');
    
    console.log("Checking for new replies...");
    
    // Use the dedicated script to process replies
    const result = await processNewReplies();
    
    // Fetch all updated messages that are related to this batch of replies
    // to ensure the frontend has the latest data
    const [updatedMessages] = await pool.query(`
      SELECT * FROM contact_messages 
      WHERE status = 'unread' 
      AND submitted_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      ORDER BY submitted_at DESC
      LIMIT 50
    `);
    
    // Get all thread messages for any updated conversations
    const threadIds = updatedMessages.map(msg => msg.thread_id || msg.message_id);
    let threadMessages = [];
    
    if (threadIds.length > 0) {
      const placeholders = threadIds.map(() => '?').join(',');
      const [threads] = await pool.query(`
        SELECT * FROM contact_messages 
        WHERE (thread_id IN (${placeholders}) OR message_id IN (${placeholders}))
        ORDER BY submitted_at DESC
      `, [...threadIds, ...threadIds]);
      
      threadMessages = threads;
    }
    
    return res.status(200).json({
      success: true, 
      message: 'Checked for new replies',
      hasNewReplies: result.processedCount > 0,
      processedCount: result.processedCount,
      updatedMessages,
      threadMessages
    });
    
  } catch (error) {
    console.error('Error checking for new replies:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error checking for new replies'
    });
  }
}; 