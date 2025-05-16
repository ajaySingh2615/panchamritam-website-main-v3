# Email Reply Capture System and Template Management

This document provides information about the email reply capture system and template management functionality in the Panchamritam application.

## Overview

The system includes:

1. **Email Template Management**: Create, store, and manage reusable email templates
2. **Message Threading**: Track conversations with customers through message threads
3. **Reply Capture**: Automatically capture email replies and associate them with original contact messages
4. **Email Listener**: Background service to monitor the inbox for customer replies

## Database Structure

The following database tables have been added or modified:

1. **contact_messages**: Added columns for threading and reply tracking
   ```sql
   ALTER TABLE contact_messages 
   ADD COLUMN thread_id VARCHAR(50) NULL,
   ADD COLUMN is_reply BOOLEAN DEFAULT FALSE,
   ADD COLUMN parent_message_id INT NULL,
   ADD COLUMN message_reference VARCHAR(100) NULL,
   ADD INDEX idx_thread_id (thread_id),
   ADD INDEX idx_parent_message_id (parent_message_id),
   ADD FOREIGN KEY (parent_message_id) REFERENCES contact_messages(message_id);
   ```

2. **email_replies**: Tracks replies received via email
   ```sql
   CREATE TABLE email_replies (
     reply_id INT AUTO_INCREMENT PRIMARY KEY,
     original_message_id INT,
     reply_content TEXT,
     received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     reply_email VARCHAR(100),
     status ENUM('new', 'processed', 'ignored') DEFAULT 'new',
     FOREIGN KEY (original_message_id) REFERENCES contact_messages(message_id)
   );
   ```

3. **email_templates**: Stores reusable email templates
   ```sql
   CREATE TABLE email_templates (
     template_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     subject VARCHAR(200) NOT NULL,
     body TEXT NOT NULL,
     category VARCHAR(50),
     variables JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

## Configuration

### Environment Variables

Add the following to your .env file:

```
# Email Configuration for Sending
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Your Company Name <your_email@gmail.com>"

# Email Listener for Replies
ENABLE_EMAIL_LISTENER=true
EMAIL_IMAP_PORT=993

# Admin email that will receive contact form submissions
ADMIN_EMAIL=admin@yourdomain.com
```

### Gmail-Specific Setup

For Gmail accounts:

1. Enable 2-Factor Authentication for your Gmail account
2. Generate an "App Password" for this application
3. Use this App Password in the EMAIL_PASSWORD environment variable
4. Enable IMAP in your Gmail settings (Settings > Forwarding and POP/IMAP > Enable IMAP)

## API Endpoints

### Email Templates

- `GET /api/contact/templates` - Get all templates
- `POST /api/contact/templates` - Create a new template
- `GET /api/contact/templates/:id` - Get template by ID
- `PUT /api/contact/templates/:id` - Update a template
- `DELETE /api/contact/templates/:id` - Delete a template

### Email Listener

- `GET /api/admin/email-listener/status` - Get listener status
- `POST /api/admin/email-listener/start` - Start the listener
- `POST /api/admin/email-listener/stop` - Stop the listener
- `POST /api/admin/email-listener/check` - Manually check for new emails

### Contact Messages

- `POST /api/contact/:id/reply` - Reply to a contact message (now with template support)

## Template Variables

When creating templates, you can use the following variables that will be replaced with actual values when sending emails:

- `{{recipientName}}` - The recipient's name
- `{{messageContent}}` - The message content
- `{{currentYear}}` - The current year
- `{{subject}}` - The email subject

Example template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
    <h1>Response to Your Inquiry</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear {{recipientName}},</p>
    
    <div style="margin: 20px 0; white-space: pre-wrap;">{{messageContent}}</div>
    
    <p>Thank you for your interest in our products.</p>
    
    <p>Best regards,<br>
    Panchamritam Ayurvedic Foods Team</p>
  </div>
  
  <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© {{currentYear}} Panchamritam Ayurvedic Foods. All rights reserved.</p>
  </div>
</div>
```

## How It Works

1. **Replying to Messages**:
   - When an admin replies to a contact message, the system creates a message thread
   - The reply is stored in the database with thread information
   - An email is sent with special tracking headers

2. **Capturing Replies**:
   - The email listener service periodically checks for new emails
   - When a reply is received, it parses the headers to associate it with the original message
   - The reply is stored in the database and linked to the thread

3. **Template Management**:
   - Admins can create and manage reusable email templates
   - Templates support variable replacement for personalization
   - When sending a reply, admins can select a template to use

## Troubleshooting

- **Email listener not connecting**: Make sure EMAIL_PASSWORD is an app password for Gmail accounts
- **Replies not being captured**: Check if the email account has IMAP enabled
- **Templates not working**: Verify template variables are correctly formatted with double curly braces

## Security Considerations

- App passwords provide limited access to your Google account
- The system uses TLS for secure SMTP and IMAP connections
- Consider regularly rotating app passwords for better security

## Simplified Contact Form Email System

The contact form has been simplified to work as follows:

1. When a user submits the contact form, an email is sent directly to the admin email address
2. An optional auto-reply is sent to the user
3. The admin can reply directly from their email client without using the admin dashboard

### Configuration

Add the following environment variable to your `.env` file:

```
# Admin email that will receive contact form submissions
ADMIN_EMAIL=admin@yourdomain.com
```

### How It Works

1. User submits the contact form on the website
2. The form data is sent to the server
3. The server sends an email to the admin with the form details
   - The email's "Reply-To" is set to the user's email
   - This allows the admin to reply directly to the user
4. The server sends an auto-reply confirmation to the user (optional)
5. When the admin replies to the message from their email client, it goes directly to the user

### Benefits

- Simpler system with fewer moving parts
- No need to store contact messages in the database
- No need for the admin to log into the dashboard to manage messages
- Direct email communication between admin and users
- Compatible with any email client

### Implementation Details

The system uses the following components:

1. `sendContactFormToAdmin()` function in `emailService.js`
2. Updated `submitContactForm()` handler in `contactController.js`

The contact messages database functionality is still available but no longer used for new submissions 