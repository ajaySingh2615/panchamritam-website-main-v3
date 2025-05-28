const { pool } = require('../config/db');

class BlogCategory {
  // Get all categories
  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT bc.*, 
               COUNT(b.blog_id) as post_count,
               parent.name as parent_name
        FROM blog_categories bc
        LEFT JOIN blogs b ON bc.category_id = b.category_id AND b.status = 'published'
        LEFT JOIN blog_categories parent ON bc.parent_id = parent.category_id
        GROUP BY bc.category_id
        ORDER BY bc.name ASC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get category by slug
  static async findBySlug(slug) {
    try {
      const [rows] = await pool.execute(`
        SELECT bc.*, 
               COUNT(b.blog_id) as post_count,
               parent.name as parent_name
        FROM blog_categories bc
        LEFT JOIN blogs b ON bc.category_id = b.category_id AND b.status = 'published'
        LEFT JOIN blog_categories parent ON bc.parent_id = parent.category_id
        WHERE bc.slug = ?
        GROUP BY bc.category_id
      `, [slug]);
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT bc.*, 
               COUNT(b.blog_id) as post_count,
               parent.name as parent_name
        FROM blog_categories bc
        LEFT JOIN blogs b ON bc.category_id = b.category_id
        LEFT JOIN blog_categories parent ON bc.parent_id = parent.category_id
        WHERE bc.category_id = ?
        GROUP BY bc.category_id
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new category
  static async create(categoryData) {
    try {
      const { name, description, parent_id, meta_title, meta_description } = categoryData;
      
      // Generate slug
      const slug = this.generateSlug(name);
      
      const [result] = await pool.execute(`
        INSERT INTO blog_categories (name, slug, description, parent_id, meta_title, meta_description)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [name, slug, description, parent_id, meta_title, meta_description]);
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update category
  static async update(id, categoryData) {
    try {
      const { name, slug, description, parent_id, meta_title, meta_description } = categoryData;
      
      await pool.execute(`
        UPDATE blog_categories SET
          name = ?, slug = ?, description = ?, parent_id = ?,
          meta_title = ?, meta_description = ?, updated_at = NOW()
        WHERE category_id = ?
      `, [name, slug, description, parent_id, meta_title, meta_description, id]);
      
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete category
  static async delete(id) {
    try {
      // Check if category has posts
      const [posts] = await pool.execute(
        'SELECT COUNT(*) as count FROM blogs WHERE category_id = ?', [id]
      );
      
      if (posts[0].count > 0) {
        throw new Error('Cannot delete category with existing posts');
      }
      
      // Check if category has subcategories
      const [subcategories] = await pool.execute(
        'SELECT COUNT(*) as count FROM blog_categories WHERE parent_id = ?', [id]
      );
      
      if (subcategories[0].count > 0) {
        throw new Error('Cannot delete category with subcategories');
      }
      
      const [result] = await pool.execute('DELETE FROM blog_categories WHERE category_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get category hierarchy
  static async getHierarchy() {
    try {
      const [rows] = await pool.execute(`
        SELECT bc.*, 
               COUNT(b.blog_id) as post_count
        FROM blog_categories bc
        LEFT JOIN blogs b ON bc.category_id = b.category_id AND b.status = 'published'
        GROUP BY bc.category_id
        ORDER BY bc.parent_id ASC, bc.name ASC
      `);
      
      // Build hierarchy
      const categories = {};
      const hierarchy = [];
      
      // First pass: create category objects
      rows.forEach(row => {
        categories[row.category_id] = { ...row, children: [] };
      });
      
      // Second pass: build hierarchy
      rows.forEach(row => {
        if (row.parent_id) {
          if (categories[row.parent_id]) {
            categories[row.parent_id].children.push(categories[row.category_id]);
          }
        } else {
          hierarchy.push(categories[row.category_id]);
        }
      });
      
      return hierarchy;
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

module.exports = BlogCategory; 