const { pool } = require('../config/db');
const { AppError } = require('../middlewares/errorHandler');

// Get user dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    
    // Get total orders count
    const [orderCountResult] = await pool.execute(
      'SELECT COUNT(*) as total_orders FROM orders WHERE user_id = ?',
      [userId]
    );
    const totalOrders = orderCountResult[0].total_orders;
    
    // Get wishlist items count
    const [wishlistCountResult] = await pool.execute(
      'SELECT COUNT(*) as wishlist_items FROM wishlist WHERE user_id = ?',
      [userId]
    );
    const wishlistItems = wishlistCountResult[0].wishlist_items;
    
    // Get recent orders (last 3)
    const [recentOrders] = await pool.execute(
      `SELECT 
        o.order_id,
        o.total_price,
        o.status,
        o.order_date,
        o.payment_method
       FROM orders o 
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC 
       LIMIT 3`,
      [userId]
    );
    
    // Calculate account status based on user data
    let accountStatus = 'Active';
    if (!req.user.email) {
      accountStatus = 'Incomplete';
    } else if (req.user.google_id || req.user.phone_number) {
      accountStatus = 'Verified';
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        wishlistItems,
        recentOrders,
        accountStatus
      }
    });
  } catch (error) {
    console.error('Error getting user dashboard stats:', error);
    next(new AppError('Failed to retrieve dashboard statistics', 500));
  }
}; 