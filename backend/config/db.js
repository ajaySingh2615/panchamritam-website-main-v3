const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool for database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'panchamritam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection function
const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Test and maintain connection
const maintainConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection maintained');
  } catch (err) {
    console.error('Error maintaining connection:', err);
  }
};

// Keep connection alive with a ping every 5 minutes
setInterval(maintainConnection, 300000);

module.exports = { pool, testConnection }; 