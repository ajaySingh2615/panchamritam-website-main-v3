const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { extractMessageId } = require('./emailTemplateService');
const EmailReply = require('../models/emailReply');
const ContactMessage = require('../models/contactMessage');
const { AppError } = require('../middlewares/errorHandler');

// Email connection config
let imap = null;
let isListening = false;
let checkInterval = null;

/**
 * Initialize the IMAP connection with credentials from environment variables
 */
const initializeImap = () => {
  if (imap) return imap; // Return existing instance if available
  
  try {
    // Create IMAP connection with env configuration
    imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_IMAP_PORT || 993, // Default IMAP port for Gmail with SSL
      tls: true,
      tlsOptions: { rejectUnauthorized: false } // For development
    });
    
    // Set up error handling
    imap.on('error', (err) => {
      console.error('IMAP connection error:', err);
    });
    
    return imap;
  } catch (error) {
    console.error('Failed to initialize IMAP:', error);
    return null;
  }
};

/**
 * Process an email to extract reply information
 * @param {Object} mail - Parsed email object from mailparser
 */
const processEmail = async (mail) => {
  try {
    // Check if this is a reply by checking the headers
    const references = mail.references || mail.inReplyTo;
    
    if (!references) {
      // Not a reply to our messages
      return;
    }
    
    // Try to extract the original message ID from references
    const messageId = extractMessageId(references);
    
    if (!messageId) {
      // Couldn't extract a valid message ID
      return;
    }
    
    // Check if the original message exists
    const originalMessage = await ContactMessage.findById(messageId);
    
    if (!originalMessage) {
      // Original message not found
      return;
    }
    
    // Create a new reply entry
    await EmailReply.create({
      original_message_id: messageId,
      reply_content: mail.text || mail.html || 'No content',
      reply_email: mail.from.text,
      status: 'new'
    });
    
    // Update the original message status
    await ContactMessage.updateStatus(messageId, 'replied');
    
    console.log(`Processed reply to message ${messageId}`);
  } catch (error) {
    console.error('Error processing email:', error);
  }
};

/**
 * Fetch and process new emails from the inbox
 */
const checkEmails = () => {
  if (!imap || imap.state !== 'authenticated') {
    console.log('IMAP not connected. Will try to reconnect.');
    startListening();
    return;
  }
  
  imap.openBox('INBOX', false, (err, mailbox) => {
    if (err) {
      console.error('Error opening mailbox:', err);
      return;
    }
    
    // Search for unread messages
    imap.search(['UNSEEN'], (err, results) => {
      if (err) {
        console.error('Error searching emails:', err);
        return;
      }
      
      if (!results || !results.length) {
        // No new messages
        return;
      }
      
      console.log(`Found ${results.length} new messages`);
      
      // Create a message fetch stream
      const fetch = imap.fetch(results, { bodies: '' });
      
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          // Parse the email
          simpleParser(stream, async (err, mail) => {
            if (err) {
              console.error('Error parsing email:', err);
              return;
            }
            
            // Process the email
            await processEmail(mail);
          });
        });
      });
      
      fetch.on('error', (err) => {
        console.error('Error fetching emails:', err);
      });
    });
  });
};

/**
 * Start listening for new emails
 */
const startListening = () => {
  if (isListening) return;
  
  // Initialize IMAP connection
  const imap = initializeImap();
  
  if (!imap) {
    console.error('Failed to initialize IMAP connection');
    return false;
  }
  
  // Connect to mailbox
  imap.connect();
  
  // Set up connection event handlers
  imap.once('ready', () => {
    console.log('IMAP connection established');
    isListening = true;
    
    // Check emails immediately on connection
    checkEmails();
    
    // Set up interval to check for new emails (every 5 minutes)
    const checkIntervalTime = 5 * 60 * 1000; // 5 minutes
    checkInterval = setInterval(checkEmails, checkIntervalTime);
  });
  
  imap.once('close', () => {
    console.log('IMAP connection closed');
    isListening = false;
    
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  });
  
  return true;
};

/**
 * Stop listening for new emails
 */
const stopListening = () => {
  if (!isListening || !imap) return;
  
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  
  imap.end();
  isListening = false;
  
  return true;
};

/**
 * Get the current listening status
 */
const getStatus = () => {
  return {
    isListening,
    connected: imap ? (imap.state === 'authenticated') : false
  };
};

module.exports = {
  startListening,
  stopListening,
  getStatus,
  checkEmails
}; 