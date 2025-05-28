const { pool } = require('../config/db');

class BlogTag {
  // Get all tags
  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.*, COUNT(bpt.post_id) as post_count
        FROM blog_tags bt
        LEFT JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        LEFT JOIN blogs b ON bpt.post_id = b.blog_id AND b.status = 'published'
        GROUP BY bt.tag_id
        ORDER BY bt.name ASC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get tag by slug
  static async findBySlug(slug) {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.*, COUNT(bpt.post_id) as post_count
        FROM blog_tags bt
        LEFT JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        LEFT JOIN blogs b ON bpt.post_id = b.blog_id AND b.status = 'published'
        WHERE bt.slug = ?
        GROUP BY bt.tag_id
      `, [slug]);
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get tag by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.*, COUNT(bpt.post_id) as post_count
        FROM blog_tags bt
        LEFT JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        LEFT JOIN blogs b ON bpt.post_id = b.blog_id
        WHERE bt.tag_id = ?
        GROUP BY bt.tag_id
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new tag
  static async create(tagData) {
    try {
      const { name, description, color } = tagData;
      
      // Generate slug
      const slug = this.generateSlug(name);
      
      const [result] = await pool.execute(`
        INSERT INTO blog_tags (name, slug, description, color)
        VALUES (?, ?, ?, ?)
      `, [name, slug, description, color || '#3B82F6']);
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update tag
  static async update(id, tagData) {
    try {
      const { name, slug, description, color } = tagData;
      
      await pool.execute(`
        UPDATE blog_tags SET
          name = ?, slug = ?, description = ?, color = ?
        WHERE tag_id = ?
      `, [name, slug, description, color, id]);
      
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete tag
  static async delete(id) {
    try {
      // Remove tag associations first
      await pool.execute('DELETE FROM blog_post_tags WHERE tag_id = ?', [id]);
      
      // Delete the tag
      const [result] = await pool.execute('DELETE FROM blog_tags WHERE tag_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get popular tags
  static async getPopular(limit = 10) {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.*, COUNT(bpt.post_id) as post_count
        FROM blog_tags bt
        JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        JOIN blogs b ON bpt.post_id = b.blog_id AND b.status = 'published'
        GROUP BY bt.tag_id
        HAVING post_count > 0
        ORDER BY post_count DESC, bt.name ASC
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search tags
  static async search(query) {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.*, COUNT(bpt.post_id) as post_count
        FROM blog_tags bt
        LEFT JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        WHERE bt.name LIKE ? OR bt.description LIKE ?
        GROUP BY bt.tag_id
        ORDER BY bt.name ASC
      `, [`%${query}%`, `%${query}%`]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Generate slug
  static generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
}

module.exports = BlogTag; 