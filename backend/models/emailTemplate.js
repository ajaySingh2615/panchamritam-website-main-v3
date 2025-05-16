const { pool } = require('../config/db');

class EmailTemplate {
  static async findAll() {
    try {
      const query = `SELECT * FROM email_templates ORDER BY name ASC`;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByCategory(category) {
    try {
      const query = `SELECT * FROM email_templates WHERE category = ? ORDER BY name ASC`;
      const [rows] = await pool.query(query, [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `SELECT * FROM email_templates WHERE template_id = ?`;
      const [rows] = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(templateData) {
    try {
      const { name, subject, body, category, variables } = templateData;
      
      // Convert variables object to JSON string if it's an object
      const variablesJSON = typeof variables === 'object' ? 
        JSON.stringify(variables) : variables;
      
      const query = `
        INSERT INTO email_templates (name, subject, body, category, variables)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(
        query, 
        [name, subject, body, category, variablesJSON]
      );
      
      return {
        templateId: result.insertId,
        ...templateData
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, templateData) {
    try {
      const { name, subject, body, category, variables } = templateData;
      
      // Convert variables object to JSON string if it's an object
      const variablesJSON = typeof variables === 'object' ? 
        JSON.stringify(variables) : variables;
      
      const query = `
        UPDATE email_templates 
        SET name = ?, subject = ?, body = ?, category = ?, variables = ?
        WHERE template_id = ?
      `;
      
      const [result] = await pool.query(
        query, 
        [name, subject, body, category, variablesJSON, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM email_templates WHERE template_id = ?`;
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmailTemplate; 