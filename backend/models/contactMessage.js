const { pool } = require('../config/db');

class ContactMessage {
  static async findAll(limit = 20, offset = 0) {
    try {
      const numLimit = parseInt(limit);
      const numOffset = parseInt(offset);
      
      const query = `SELECT * FROM contact_messages 
         ORDER BY submitted_at DESC 
         LIMIT ${numLimit} OFFSET ${numOffset}`;
      
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findFiltered(params = {}) {
    try {
      const { limit = 20, page = 1, search, status, startDate, endDate } = params;
      const numLimit = parseInt(limit);
      const offset = (page - 1) * numLimit;
      
      // Base query without parameters
      let query = `SELECT * FROM contact_messages WHERE 1=1`;
      
      if (search) {
        const searchTerm = `%${search}%`;
        query += ` AND (name LIKE '${searchTerm}' OR email LIKE '${searchTerm}' OR subject LIKE '${searchTerm}' OR message LIKE '${searchTerm}')`;
      }
      
      if (status && status !== 'all') {
        query += ` AND status = '${status}'`;
      }
      
      if (startDate) {
        query += ` AND submitted_at >= '${new Date(startDate).toISOString()}'`;
      }
      
      if (endDate) {
        query += ` AND submitted_at <= '${new Date(endDate).toISOString()}'`;
      }
      
      query += ` ORDER BY submitted_at DESC LIMIT ${numLimit} OFFSET ${offset}`;
      
      // Execute the simple query without parameters using pool.query instead of pool.execute
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(messageId) {
    try {
      const query = `SELECT * FROM contact_messages WHERE message_id = ${messageId}`;
      
      const [rows] = await pool.query(query);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(messageData) {
    const { name, email, subject, message } = messageData;
    
    try {
      // Escape single quotes in the string values
      const escapedName = name.replace(/'/g, "''");
      const escapedEmail = email.replace(/'/g, "''");
      const escapedSubject = (subject || '').replace(/'/g, "''");
      const escapedMessage = message.replace(/'/g, "''");
      
      const query = `INSERT INTO contact_messages (name, email, subject, message) 
                     VALUES ('${escapedName}', '${escapedEmail}', '${escapedSubject}', '${escapedMessage}')`;
      
      const [result] = await pool.query(query);
      
      return {
        messageId: result.insertId,
        name,
        email,
        subject,
        message,
        submittedAt: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete(messageId) {
    try {
      const query = `DELETE FROM contact_messages WHERE message_id = ${messageId}`;
      
      const [result] = await pool.query(query);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(messageId, status) {
    try {
      const query = `UPDATE contact_messages SET status = '${status}' WHERE message_id = ${messageId}`;
      
      const [result] = await pool.query(query);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async countMessages(filters = {}) {
    try {
      const { search, status, startDate, endDate } = filters;
      
      // Base query without parameters
      let query = `SELECT COUNT(*) as total FROM contact_messages WHERE 1=1`;
      
      if (search) {
        const searchTerm = `%${search}%`;
        query += ` AND (name LIKE '${searchTerm}' OR email LIKE '${searchTerm}' OR subject LIKE '${searchTerm}' OR message LIKE '${searchTerm}')`;
      }
      
      if (status && status !== 'all') {
        query += ` AND status = '${status}'`;
      }
      
      if (startDate) {
        query += ` AND submitted_at >= '${new Date(startDate).toISOString()}'`;
      }
      
      if (endDate) {
        query += ` AND submitted_at <= '${new Date(endDate).toISOString()}'`;
      }
      
      // Execute the simple query without parameters using pool.query
      const [rows] = await pool.query(query);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactMessage; 