const Order = require('../models/order');
const Address = require('../models/address');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { pool } = require('../config/db');
const { AppError } = require('../middlewares/errorHandler');
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const { sendInvoiceEmail, sendOrderConfirmation } = require('../utils/emailService');

// Create new order from cart (checkout)
exports.checkout = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { addressId, paymentMethod = 'Cash on Delivery' } = req.body;
    
    // Validate input
    if (!addressId) {
      return next(new AppError('Address ID is required', 400));
    }
    
    // Check if address exists and belongs to user
    const address = await Address.findById(addressId);
    
    if (!address) {
      return next(new AppError('Address not found', 404));
    }
    
    if (address.user_id !== userId) {
      return next(new AppError('This address does not belong to you', 403));
    }
    
    // Create order from cart
    try {
      const order = await Order.createFromCart(userId, addressId, paymentMethod);
      
      // Get user email to send confirmation
      const [userRows] = await pool.execute(
        'SELECT email FROM Users WHERE user_id = ?',
        [userId]
      );
      
      if (userRows && userRows.length > 0) {
        const userEmail = userRows[0].email;
        // Send order confirmation email
        try {
          await sendOrderConfirmation(order, userEmail);
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError);
          // Don't fail the order if email fails
        }
      }
      
      res.status(201).json({
        status: 'success',
        message: 'Order placed successfully',
        data: {
          order
        }
      });
    } catch (error) {
      if (error.message === 'Cart is empty') {
        return next(new AppError('Your cart is empty', 400));
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    
    const orders = await Order.findAll(limit, offset);
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      pagination: {
        page,
        limit,
        hasMore: orders.length === limit
      },
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Regular users can only view their own orders
    if (order.user_id !== userId && req.user.role_name !== 'admin') {
      return next(new AppError('You do not have permission to view this order', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for the current user
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    
    const orders = await Order.findByUserId(userId, limit, offset);
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      pagination: {
        page,
        limit,
        hasMore: orders.length === limit
      },
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError('Status is required', 400));
    }
    
    try {
      const result = await Order.updateStatus(id, status);
      
      if (!result) {
        return next(new AppError('Order not found', 404));
      }
      
      res.status(200).json({
        status: 'success',
        message: `Order status updated to '${status}'`,
        data: {
          order: result
        }
      });
    } catch (error) {
      if (error.message.includes('Invalid status')) {
        return next(new AppError(error.message, 400));
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Create a new order with tax calculations
exports.createOrderWithTax = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { address_id, payment_method = 'Cash on Delivery' } = req.body;
    
    if (!address_id) {
      return next(new AppError('Shipping address is required', 400));
    }
    
    // Get user's cart
    const cart = await Cart.findByUserId(userId);
    
    if (cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }
    
    // Create order with tax calculations
    const orderData = {
      user_id: userId,
      address_id,
      status: 'pending',
      payment_method
    };
    
    // Create order
    try {
      const order = await Order.createOrderWithTax(orderData, cart.items);
      
      // Reduce inventory for each ordered item
      for (const item of cart.items) {
        await Product.reduceInventory(item.product_id, item.quantity);
      }
      
      // Clear the cart after successful order
      await Cart.clearCart(userId);
      
      // Get user email
      const [userRows] = await pool.execute(
        'SELECT email, name FROM Users WHERE user_id = ?',
        [userId]
      );
      
      if (userRows && userRows.length > 0) {
        const userEmail = userRows[0].email;
        // Send order confirmation email
        try {
          await sendOrderConfirmation(order, userEmail);
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError);
          // Don't fail the order if email fails
        }
      }
      
      res.status(201).json({
        status: 'success',
        message: 'Order created successfully with tax calculations',
        data: {
          order
        }
      });
    } catch (error) {
      console.error('Error creating order with tax:', error);
      
      return next(new AppError(
        'Failed to process order. Please try again.',
        500
      ));
    }
  } catch (error) {
    next(error);
  }
};

// Generate tax invoice for an order
exports.generateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    // Get the order
    const order = await Order.findById(id);
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Check if user has permission to view this order
    if (order.user_id !== userId && req.user.role_name !== 'admin') {
      return next(new AppError('You do not have permission to access this invoice', 403));
    }
    
    // Generate tax invoice data
    const invoice = await Order.generateTaxInvoice(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        invoice
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;
    
    // Get the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Check if order belongs to user or user is admin
    if (order.user_id !== userId && req.user.role_name !== 'admin') {
      return next(new AppError('You do not have permission to cancel this order', 403));
    }
    
    // Check if order can be canceled (only pending or processing orders)
    if (order.status !== 'pending' && order.status !== 'processing') {
      return next(new AppError(`Order cannot be cancelled. Current status: ${order.status}`, 400));
    }
    
    // Update order status to cancelled
    const result = await Order.updateStatus(orderId, 'cancelled');
    
    // Return inventory items back to stock
    try {
      // Get order items
      const orderItems = await Order.getOrderItems(orderId);
      
      // Restore inventory for each item
      for (const item of orderItems) {
        // Update product quantity by adding back the ordered quantity
        await Product.updateProductQuantity(item.product_id, item.quantity);
      }
      
      res.status(200).json({
        status: 'success',
        message: 'Order cancelled successfully',
        data: {
          order: result
        }
      });
    } catch (error) {
      console.error('Error restoring inventory:', error);
      
      // Even if inventory restoration fails, the order is still cancelled
      res.status(200).json({
        status: 'success',
        message: 'Order cancelled but inventory restoration failed. Please contact support.',
        data: {
          order: result
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Generate PDF invoice for an order
exports.generateInvoicePDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    // Get the order
    const order = await Order.findById(id);
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Check if user has permission to view this order
    if (order.user_id !== userId && req.user.role_name !== 'admin') {
      return next(new AppError('You do not have permission to access this invoice', 403));
    }
    
    // Generate tax invoice data
    const invoice = await Order.generateTaxInvoice(id);
    
    // Use a temporary file stream
    const fs = require('fs');
    const path = require('path');
    const { Writable } = require('stream');
    const os = require('os');

    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `Invoice-${invoice.invoice.invoice_number}.pdf`);
    
    // Create a proper writable stream
    const pdfStream = fs.createWriteStream(tempFilePath);
    
    // Generate PDF
    await generateInvoicePDF(invoice, pdfStream);
    
    // Read the generated file
    const pdfBuffer = fs.readFileSync(tempFilePath);
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoice.invoice_number}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    next(error);
  }
};

// Email invoice to customer
exports.emailInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.user_id;
    
    if (!email) {
      return next(new AppError('Email address is required', 400));
    }
    
    // Get the order
    const order = await Order.findById(id);
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Check if user has permission to view this order
    if (order.user_id !== userId && req.user.role_name !== 'admin') {
      return next(new AppError('You do not have permission to access this invoice', 403));
    }
    
    // Generate tax invoice data
    const invoice = await Order.generateTaxInvoice(id);
    
    // Use a temporary file stream
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `Invoice-${invoice.invoice.invoice_number}.pdf`);
    
    // Create a proper writable stream
    const pdfStream = fs.createWriteStream(tempFilePath);
    
    // Generate PDF
    await generateInvoicePDF(invoice, pdfStream);
    
    // Read the generated file
    const pdfBuffer = fs.readFileSync(tempFilePath);
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    // Send email with invoice PDF
    await sendInvoiceEmail(email, invoice, pdfBuffer);
    
    res.status(200).json({
      status: 'success',
      message: `Invoice has been sent to ${email}`,
      data: {
        invoice_number: invoice.invoice.invoice_number,
        email
      }
    });
  } catch (error) {
    console.error('Error emailing invoice:', error);
    next(error);
  }
}; 