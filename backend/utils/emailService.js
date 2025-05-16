const nodemailer = require('nodemailer');
const { renderTemplate, generateMessageId } = require('./emailTemplateService');
const EmailTemplate = require('../models/emailTemplate');

// Create a transporter for sending emails
// For testing, we'll use Ethereal which provides disposable test accounts
let transporter;

// Create a test account and transporter
const createTestTransporter = async () => {
  // Generate test SMTP service account
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a SMTP transporter object using the test account
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  console.log('Created test email account:', {
    user: testAccount.user,
    pass: testAccount.pass,
    preview_url: 'https://ethereal.email/messages'
  });
  
  return transporter;
};

// Initialize transporter - either use env variables if available or create test account
const initializeTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    // Use configured email settings from environment variables
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    return transporter;
  } else {
    // Create test account for development
    return await createTestTransporter();
  }
};

/**
 * Send an order confirmation email
 * @param {Object} order - The order details
 * @param {string} email - The recipient email address
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendOrderConfirmation = async (order, email) => {
  // Make sure transporter is initialized
  if (!transporter) {
    await initializeTransporter();
  }
  
  // Format the order items for email
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  // Email content
  const mailOptions = {
    from: `"Panchamritam Ayurvedic Foods" <${process.env.EMAIL_USER || 'info@panchamritam.com'}>`,
    to: email,
    subject: `Order Confirmation #${order.order_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
          <h1>Order Confirmation</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${order.user_name || 'Customer'},</p>
          
          <p>Thank you for your order! We're pleased to confirm that we have received your order.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> #${order.order_id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Order Status:</strong> ${order.status}</p>
          
          <h3>Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: left;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 8px; text-align: right;">₹${parseFloat(order.subtotal || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 8px; text-align: right;">₹${parseFloat(order.total_tax || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 8px; text-align: right;"><strong>₹${parseFloat(order.total_price).toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <h3>Shipping Address</h3>
          <p>
            ${order.address_line || ''}<br>
            ${order.city || ''}, ${order.state || ''} ${order.zip_code || ''}<br>
            ${order.country || ''}
          </p>
          
          <p>You can track your order status by logging into your account.</p>
          
          <p>If you have any questions, please contact our customer support at <a href="mailto:support@panchamritam.com">support@panchamritam.com</a>.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Best regards,<br>
          Panchamritam Ayurvedic Foods Team</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Panchamritam Ayurvedic Foods. All rights reserved.</p>
          <p>This email was sent to you because you placed an order on our website.</p>
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // If using Ethereal, log the URL where the email can be viewed
  if (info.messageId && info.testMessageUrl) {
    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', info.testMessageUrl);
  }
  
  return info;
};

/**
 * Send an invoice via email
 * @param {string} email - The recipient email address
 * @param {Object} invoiceData - The invoice data
 * @param {Buffer} pdfBuffer - The invoice PDF as a buffer
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendInvoiceEmail = async (email, invoiceData, pdfBuffer) => {
  // Make sure transporter is initialized
  if (!transporter) {
    await initializeTransporter();
  }
  
  // Email content
  const mailOptions = {
    from: `"Panchamritam Ayurvedic Foods" <${process.env.EMAIL_USER || 'info@panchamritam.com'}>`,
    to: email,
    subject: `Invoice #${invoiceData.invoice.invoice_number} for Order #${invoiceData.invoice.order_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
          <h1>Your Invoice</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${invoiceData.customer.name || 'Customer'},</p>
          
          <p>Thank you for your order! Attached is the invoice for your recent purchase.</p>
          
          <h3>Invoice Details</h3>
          <p><strong>Invoice Number:</strong> ${invoiceData.invoice.invoice_number}</p>
          <p><strong>Order Number:</strong> #${invoiceData.invoice.order_id}</p>
          <p><strong>Invoice Date:</strong> ${new Date(invoiceData.invoice.invoice_date).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${invoiceData.summary.total.toFixed(2)}</p>
          
          <p>For detailed information, please check the attached PDF invoice.</p>
          
          <p>If you have any questions about your invoice, please contact our customer support at <a href="mailto:support@panchamritam.com">support@panchamritam.com</a>.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Best regards,<br>
          Panchamritam Ayurvedic Foods Team</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Panchamritam Ayurvedic Foods. All rights reserved.</p>
          <p>This email was sent to you because you placed an order on our website.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `Invoice-${invoiceData.invoice.invoice_number}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  
  // If using Ethereal, log the URL where the email can be viewed
  if (info.messageId && info.testMessageUrl) {
    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', info.testMessageUrl);
  }
  
  return info;
};

/**
 * Send a reply to a contact message
 * @param {string} recipientEmail - The recipient email address
 * @param {string} recipientName - The recipient name
 * @param {string} subject - The email subject
 * @param {string} messageContent - The email message content
 * @param {number} messageId - The ID of the original message (for tracking)
 * @param {string} templateId - Optional template ID to use
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendContactReply = async (recipientEmail, recipientName, subject, messageContent, messageId, templateId = null) => {
  // Make sure transporter is initialized
  if (!transporter) {
    await initializeTransporter();
  }
  
  let htmlContent = '';
  
  // If a template ID is provided, use the template
  if (templateId) {
    try {
      // Get the template
      const template = await EmailTemplate.findById(templateId);
      
      if (template) {
        // Replace variables in the template
        const templateData = {
          recipientName,
          messageContent: messageContent.replace(/\n/g, '<br/>'),
          currentYear: new Date().getFullYear(),
          subject
        };
        
        // Use the template body
        htmlContent = renderTemplate(template.body, templateData);
      }
    } catch (error) {
      console.error('Error fetching or rendering template:', error);
      // Fall back to default template
    }
  }
  
  // Use default template if no template was found or an error occurred
  if (!htmlContent) {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
          <h1>Response to Your Inquiry</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${recipientName},</p>
          
          <div style="margin: 20px 0; white-space: pre-wrap;">${messageContent.replace(/\n/g, '<br/>')}</div>
          
          <p>If you have any further questions, please don't hesitate to contact us again.</p>
          
          <p>Best regards,<br>
          Panchamritam Ayurvedic Foods Team</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Panchamritam Ayurvedic Foods. All rights reserved.</p>
          <p>This email was sent in response to your contact message on our website.</p>
        </div>
      </div>
    `;
  }
  
  // Generate a message ID for tracking replies
  const messageReferenceId = messageId ? generateMessageId(messageId) : null;
  
  // Email content
  const mailOptions = {
    from: `"Panchamritam Ayurvedic Foods" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'info@panchamritam.com'}>`,
    to: `"${recipientName}" <${recipientEmail}>`,
    subject: subject,
    html: htmlContent,
    messageId: messageReferenceId,
    headers: {
      'X-Contact-Message-ID': messageId
    }
  };

  const info = await transporter.sendMail(mailOptions);
  
  // If using Ethereal, log the URL where the email can be viewed
  if (info.messageId && info.testMessageUrl) {
    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', info.testMessageUrl);
  }
  
  return info;
};

/**
 * Send a contact form submission directly to admin email
 * @param {Object} contactData - The contact form data (name, email, subject, message)
 * @param {boolean} sendAutoReply - Whether to send an auto-reply to the user
 * @returns {Promise} - A promise that resolves when the emails are sent
 */
const sendContactFormToAdmin = async (contactData, sendAutoReply = true) => {
  // Make sure transporter is initialized
  if (!transporter) {
    await initializeTransporter();
  }
  
  const { name, email, subject, message, phone } = contactData;
  
  // Email content for admin notification
  const adminMailOptions = {
    from: `"Panchamritam Website" <${process.env.EMAIL_USER || 'noreply@panchamritam.com'}>`,
    to: process.env.ADMIN_EMAIL || 'admin@panchamritam.com',
    replyTo: email, // Set reply-to as the customer's email for easy replies
    subject: `Contact: ${subject || 'Website Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
          <h1>Customer Message</h1>
        </div>
        
        <div style="padding: 20px;">
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject || 'Website Inquiry'}</p>
          
          <h3>Message</h3>
          <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #9bc948; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>To reply, simply respond directly to this email.</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Panchamritam Ayurvedic Foods. All rights reserved.</p>
          <p>This email was sent from your website contact form.</p>
        </div>
      </div>
    `
  };

  // Send email to admin
  const adminInfo = await transporter.sendMail(adminMailOptions);
  
  // If auto-reply is enabled, send confirmation to the user
  let userInfo = null;
  if (sendAutoReply) {
    const userMailOptions = {
      from: `"Panchamritam Ayurvedic Foods" <${process.env.EMAIL_USER || 'info@panchamritam.com'}>`,
      to: `"${name}" <${email}>`,
      subject: `Thank you for contacting us`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #9bc948; padding: 20px; text-align: center; color: white;">
            <h1>Thank You for Reaching Out</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            
            <p>Thank you for contacting Panchamritam Ayurvedic Foods. This email confirms that we have received your message.</p>
            
            <p>We will review your inquiry and get back to you within 24 hours.</p>
            
            <p>For your reference, here's a copy of your message:</p>
            
            <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #9bc948; margin: 20px 0;">
              <p><strong>Subject:</strong> ${subject || 'Website Inquiry'}</p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>If you have any additional questions or information to add, please feel free to reply to this email.</p>
            
            <p>Best regards,<br>
            Panchamritam Ayurvedic Foods Team</p>
          </div>
          
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Panchamritam Ayurvedic Foods. All rights reserved.</p>
            <p>This is an automatic confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    };
    
    userInfo = await transporter.sendMail(userMailOptions);
  }
  
  // If using Ethereal, log the URLs where the emails can be viewed
  if (adminInfo.messageId && adminInfo.testMessageUrl) {
    console.log('Admin notification email sent: %s', adminInfo.messageId);
    console.log('Preview URL: %s', adminInfo.testMessageUrl);
  }
  
  if (userInfo && userInfo.messageId && userInfo.testMessageUrl) {
    console.log('User auto-reply email sent: %s', userInfo.messageId);
    console.log('Preview URL: %s', userInfo.testMessageUrl);
  }
  
  return { adminInfo, userInfo };
};

// Initialize the transporter
initializeTransporter().catch(console.error);

module.exports = {
  sendOrderConfirmation,
  sendInvoiceEmail,
  sendContactReply,
  sendContactFormToAdmin
}; 