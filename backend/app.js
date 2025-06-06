const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const { errorHandler } = require('./middlewares/errorHandler');
const { testConnection } = require('./config/db');
const { checkReviewsTable, checkTaxTables } = require('./utils/dbCheck');
// Email listener import commented out as we're no longer using it
// const emailListener = require('./utils/emailListenerService');

// Load environment variables
dotenv.config();

// Import and configure passport
require('./config/passport');

// Import routes
const healthCheckRoutes = require('./routes/healthCheck');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const taxRoutes = require('./routes/taxRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api', healthCheckRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/upload', uploadRoutes);

// Email listener endpoints commented out as we're no longer using them
/*
// Email listener status endpoint
app.get('/api/admin/email-listener/status', (req, res) => {
  res.json({
    status: 'success',
    data: emailListener.getStatus()
  });
});

// Start email listener
app.post('/api/admin/email-listener/start', (req, res) => {
  const started = emailListener.startListening();
  res.json({
    status: started ? 'success' : 'error',
    message: started ? 'Email listener started' : 'Failed to start email listener'
  });
});

// Stop email listener
app.post('/api/admin/email-listener/stop', (req, res) => {
  const stopped = emailListener.stopListening();
  res.json({
    status: stopped ? 'success' : 'error',
    message: stopped ? 'Email listener stopped' : 'Email listener was not running'
  });
});
*/

// 404 route not found handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('WARNING: Could not connect to database. API calls that require database access will fail.');
  } else {
    // Check database tables and repair if needed
    try {
      console.log('Checking database tables...');
      await checkReviewsTable();
      await checkTaxTables();
    } catch (error) {
      console.error('Error checking database tables:', error);
    }
    
    // Email listener auto-start code removed as we're no longer using it
    console.log('Contact form system now uses direct email instead of database storage.');
  }
});

module.exports = app; 