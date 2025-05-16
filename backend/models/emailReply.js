const { pool } = require('../config/db');

class EmailReply {
  static async findAll(limit = 20, offset = 0, noCache = false) {
    try {
      let query = `
        SELECT * FROM email_replies
        ORDER BY received_at DESC
        LIMIT ? OFFSET ?
      `;
      
      // Add cache-busting if requested
      if (noCache) {
        query = `
          SELECT SQL_NO_CACHE * FROM email_replies
          WHERE 1=1 /* Force no cache */
          ORDER BY received_at DESC
          LIMIT ? OFFSET ?
        `;
      }
      
      const [rows] = await pool.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByOriginalMessageId(messageId) {
    try {
      const query = `
        SELECT * FROM email_replies
        WHERE original_message_id = ?
        ORDER BY received_at ASC
      `;
      
      const [rows] = await pool.query(query, [messageId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(replyId) {
    try {
      const query = `SELECT * FROM email_replies WHERE reply_id = ?`;
      
      const [rows] = await pool.query(query, [replyId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(replyData) {
    try {
      const { 
        original_message_id, 
        reply_content, 
        reply_email,
        status = 'new'
      } = replyData;
      
      const query = `
        INSERT INTO email_replies 
        (original_message_id, reply_content, reply_email, status)
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(
        query, 
        [original_message_id, reply_content, reply_email, status]
      );
      
      return {
        replyId: result.insertId,
        ...replyData,
        received_at: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(replyId, status) {
    try {
      const query = `
        UPDATE email_replies 
        SET status = ?
        WHERE reply_id = ?
      `;
      
      const [result] = await pool.query(query, [status, replyId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(replyId) {
    try {
      const query = `DELETE FROM email_replies WHERE reply_id = ?`;
      
      const [result] = await pool.query(query, [replyId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async countByStatus(status) {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM email_replies 
        WHERE status = ?
      `;
      
      const [rows] = await pool.query(query, [status]);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmailReply; 