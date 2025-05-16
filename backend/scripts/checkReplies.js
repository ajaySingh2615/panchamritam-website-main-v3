/**
 * Standalone script to check for new email replies
 * Run this script directly with Node.js to process new replies
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function processNewReplies() {
  console.log('\n===== EMAIL REPLY PROCESSOR =====');
  console.log(`Starting check at ${new Date().toISOString()}`);
  
  let connection;
  let unprocessedReplies = []; // Declare outside try block
  let processedCount = 0;
  let processedIds = new Set(); // Track IDs we've processed to avoid duplicates
  
  try {
    // Create a direct database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'panchamritam',
      multipleStatements: true // Enable multiple statements for transaction
    });
    
    console.log('Connected to database');
    
    // Check if the email_replies table exists
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'email_replies'
    `, [process.env.DB_NAME || 'panchamritam']);
    
    if (tables.length === 0) {
      console.log('Creating email_replies table...');
      
      // Create the email_replies table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS email_replies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          message_id VARCHAR(100) NOT NULL,
          thread_id VARCHAR(100),
          parent_message_id INT,
          from_email VARCHAR(255) NOT NULL,
          from_name VARCHAR(255),
          subject VARCHAR(255),
          body TEXT,
          received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          processed BOOLEAN DEFAULT FALSE,
          processed_at TIMESTAMP NULL,
          UNIQUE KEY (message_id)
        )
      `);
      
      console.log('Table created successfully');
    }
    
    // Start a transaction
    await connection.query('START TRANSACTION');
    
    // Get unprocessed email replies - using status='new' instead of processed=FALSE
    const [replies] = await connection.query(`
      SELECT * FROM email_replies 
      WHERE status = 'new' 
      ORDER BY received_at ASC
    `);
    
    if (replies.length === 0) {
      console.log('No new email replies to process');
      await connection.query('COMMIT');
      return { processedCount: 0, hasNewReplies: false };
    }
    
    console.log(`Found ${replies.length} unprocessed email replies`);
    unprocessedReplies = replies;
    
    // Process each reply
    for (const reply of replies) {
      // Skip if we've already processed this ID (prevents duplicates)
      if (processedIds.has(reply.reply_id)) {
        console.log(`Skipping duplicate reply ID: ${reply.reply_id}`);
        continue;
      }
      
      console.log(`Processing reply: ${reply.reply_id}`);
      
      try {
        // Find the original message this is replying to
        const originalMessageId = reply.original_message_id;
        
        if (!originalMessageId) {
          console.error(`Cannot find parent for reply: ${reply.reply_id}`);
          continue;
        }
        
        // Get the original message thread
        const [originalMessages] = await connection.query(`
          SELECT * FROM contact_messages 
          WHERE message_id = ?
          LIMIT 1
        `, [originalMessageId]);
        
        if (originalMessages.length === 0) {
          console.error(`Cannot find original message for reply: ${reply.reply_id}`);
          continue;
        }
        
        const originalMessage = originalMessages[0];
        const threadId = originalMessage.thread_id || originalMessage.message_id;
        
        // Check if this message has already been imported
        const [existingReplies] = await connection.query(`
          SELECT * FROM contact_messages 
          WHERE thread_id = ? AND message LIKE ?
        `, [
          threadId,
          `%${reply.reply_content.substring(0, 50).replace(/%/g, '\\%')}%`
        ]);
        
        if (existingReplies.length > 0) {
          console.log(`Reply already exists in contact_messages: ${reply.reply_id}`);
          
          // Mark as processed
          await connection.query(`
            UPDATE email_replies 
            SET status = 'processed'
            WHERE reply_id = ?
          `, [reply.reply_id]);
          
          processedIds.add(reply.reply_id);
          continue;
        }
        
        // Extract sender name from email
        let senderName = '';
        if (reply.reply_email) {
          // Try to extract name from format: "Name" <email>
          const nameMatch = reply.reply_email.match(/"([^"]+)"/);
          if (nameMatch && nameMatch[1]) {
            senderName = nameMatch[1];
          } else {
            // Use email address before the @ symbol
            senderName = reply.reply_email.split('@')[0].split('<').pop();
          }
        }
        
        // Generate a subject line
        const subject = `RE: ${originalMessage.subject || 'Your Message'}`;
        
        // Extract the actual reply content
        // Assuming the reply is above the quoted original message
        let replyContent = reply.reply_content.split('\n\nOn ')[0].trim();
        
        // If empty after splitting, use the whole content
        if (!replyContent) {
          replyContent = reply.reply_content.trim();
        }
        
        // Insert this reply as a new message in the thread
        await connection.query(`
          INSERT INTO contact_messages (
            name, email, subject, message, status, 
            thread_id, is_reply, parent_message_id, message_reference
          ) VALUES (?, ?, ?, ?, 'unread', ?, 1, ?, ?)
        `, [
          senderName,
          reply.reply_email,
          subject,
          replyContent,
          threadId,
          originalMessageId,
          `reply-${reply.reply_id}`
        ]);
        
        // Mark original message as unread since there's a new reply
        await connection.query(`
          UPDATE contact_messages
          SET status = 'unread'
          WHERE message_id = ?
        `, [originalMessageId]);
        
        // Mark as processed
        await connection.query(`
          UPDATE email_replies 
          SET status = 'processed'
          WHERE reply_id = ?
        `, [reply.reply_id]);
        
        processedIds.add(reply.reply_id);
        processedCount++;
        console.log(`Successfully processed reply: ${reply.reply_id}`);
      } catch (error) {
        console.error(`Error processing reply ${reply.reply_id}:`, error);
      }
    }
    
    // Commit the transaction
    await connection.query('COMMIT');
    console.log(`Successfully processed ${processedCount} replies`);
    
  } catch (error) {
    console.error('Error processing email replies:', error);
    if (connection) {
      try {
        // Rollback on error
        await connection.query('ROLLBACK');
        console.log('Transaction rolled back due to error');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
  
  return { 
    processedCount, 
    hasNewReplies: processedCount > 0,
    unprocessedReplies 
  };
}

// If this script is run directly
if (require.main === module) {
  processNewReplies()
    .then(result => {
      console.log(`Script completed. Processed ${result.processedCount} replies.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Script error:', error);
      process.exit(1);
    });
}

module.exports = { processNewReplies }; 