const { pool } = require('../config/db');

class Blog {
  // Get all blogs with pagination and filters
  static async findAll(options = {}) {
    try {
      const {
        limit = 10,
        offset = 0,
        status = 'published',
        category_id = null,
        tag = null,
        search = null,
        is_featured = null,
        author_id = null
      } = options;

      // Ensure limit and offset are valid numbers
      const validLimit = Math.max(1, parseInt(limit) || 10);
      const validOffset = Math.max(0, parseInt(offset) || 0);

      let query = `
        SELECT b.*, u.name as author_name, bc.name as category_name, bc.slug as category_slug
        FROM blogs b
        LEFT JOIN users u ON b.author_id = u.user_id
        LEFT JOIN blog_categories bc ON b.category_id = bc.category_id
        WHERE 1=1
      `;
      
      const params = [];

      // Add filters
      if (status && status !== 'all') {
        query += ` AND b.status = ?`;
        params.push(status);
      }

      if (category_id) {
        query += ` AND b.category_id = ?`;
        params.push(category_id);
      }

      if (author_id) {
        query += ` AND b.author_id = ?`;
        params.push(author_id);
      }

      if (is_featured !== null) {
        query += ` AND b.is_featured = ?`;
        params.push(is_featured);
      }

      if (search) {
        query += ` AND (b.title LIKE ? OR b.content LIKE ? OR b.excerpt LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Add published date filter for published posts
      if (status === 'published') {
        query += ` AND (b.published_at IS NULL OR b.published_at <= NOW())`;
      }

      // Use string interpolation for LIMIT and OFFSET as they can't be parameterized
      query += ` ORDER BY b.created_at DESC LIMIT ${validLimit} OFFSET ${validOffset}`;

      const [rows] = await pool.execute(query, params);
      
      // Get tags for each blog post
      for (let blog of rows) {
        blog.tags = await this.getBlogTags(blog.blog_id);
      }

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get blog by slug
  static async findBySlug(slug) {
    try {
      const [rows] = await pool.execute(`
        SELECT b.*, u.name as author_name, u.email as author_email, 
               bc.name as category_name, bc.slug as category_slug
        FROM blogs b
        LEFT JOIN users u ON b.author_id = u.user_id
        LEFT JOIN blog_categories bc ON b.category_id = bc.category_id
        WHERE b.slug = ? AND b.status = 'published'
        AND (b.published_at IS NULL OR b.published_at <= NOW())
      `, [slug]);

      if (rows.length === 0) return null;

      const blog = rows[0];
      blog.tags = await this.getBlogTags(blog.blog_id);
      
      return blog;
    } catch (error) {
      throw error;
    }
  }

  // Get blog by ID (for admin)
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT b.*, u.name as author_name, bc.name as category_name
        FROM blogs b
        LEFT JOIN users u ON b.author_id = u.user_id
        LEFT JOIN blog_categories bc ON b.category_id = bc.category_id
        WHERE b.blog_id = ?
      `, [id]);

      if (rows.length === 0) return null;

      const blog = rows[0];
      blog.tags = await this.getBlogTags(blog.blog_id);
      
      return blog;
    } catch (error) {
      throw error;
    }
  }

  // Create new blog post
  static async create(blogData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        title, slug, content, excerpt, featured_image, gallery_images,
        status, published_at, scheduled_at, meta_title, meta_description,
        meta_keywords, og_title, og_description, og_image, reading_time,
        is_featured, allow_comments, category_id, author_id, tags
      } = blogData;

      // Generate slug if not provided
      const finalSlug = slug || this.generateSlug(title);

      // Calculate reading time if not provided
      const finalReadingTime = reading_time || this.calculateReadingTime(content);

      // Helper function to convert empty strings to null
      const emptyToNull = (value) => (value === '' || value === undefined) ? null : value;

      const [result] = await connection.execute(`
        INSERT INTO blogs (
          title, slug, content, excerpt, featured_image, gallery_images,
          status, published_at, scheduled_at, meta_title, meta_description,
          meta_keywords, og_title, og_description, og_image, reading_time,
          is_featured, allow_comments, category_id, author_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, 
        finalSlug, 
        content, 
        emptyToNull(excerpt), 
        emptyToNull(featured_image), 
        gallery_images ? JSON.stringify(gallery_images) : null,
        status || 'draft', 
        emptyToNull(published_at), 
        emptyToNull(scheduled_at), 
        emptyToNull(meta_title), 
        emptyToNull(meta_description),
        emptyToNull(meta_keywords), 
        emptyToNull(og_title), 
        emptyToNull(og_description), 
        emptyToNull(og_image), 
        finalReadingTime,
        is_featured || false, 
        allow_comments !== false, 
        emptyToNull(category_id), 
        author_id
      ]);

      const blogId = result.insertId;

      // Add tags if provided
      if (tags && tags.length > 0) {
        await this.addTagsToBlog(connection, blogId, tags);
      }

      await connection.commit();
      return await this.findById(blogId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update blog post
  static async update(id, blogData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        title, slug, content, excerpt, featured_image, gallery_images,
        status, published_at, scheduled_at, meta_title, meta_description,
        meta_keywords, og_title, og_description, og_image, reading_time,
        is_featured, allow_comments, category_id, tags
      } = blogData;

      // Calculate reading time if content changed
      const finalReadingTime = reading_time || this.calculateReadingTime(content);

      // Helper function to convert empty strings to null
      const emptyToNull = (value) => (value === '' || value === undefined) ? null : value;

      await connection.execute(`
        UPDATE blogs SET
          title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
          gallery_images = ?, status = ?, published_at = ?, scheduled_at = ?,
          meta_title = ?, meta_description = ?, meta_keywords = ?, og_title = ?,
          og_description = ?, og_image = ?, reading_time = ?, is_featured = ?,
          allow_comments = ?, category_id = ?, updated_at = NOW()
        WHERE blog_id = ?
      `, [
        title, 
        slug, 
        content, 
        emptyToNull(excerpt), 
        emptyToNull(featured_image),
        gallery_images ? JSON.stringify(gallery_images) : null,
        status, 
        emptyToNull(published_at), 
        emptyToNull(scheduled_at), 
        emptyToNull(meta_title), 
        emptyToNull(meta_description),
        emptyToNull(meta_keywords), 
        emptyToNull(og_title), 
        emptyToNull(og_description), 
        emptyToNull(og_image), 
        finalReadingTime,
        is_featured, 
        allow_comments, 
        emptyToNull(category_id), 
        id
      ]);

      // Update tags
      if (tags !== undefined) {
        // Remove existing tags
        await connection.execute('DELETE FROM blog_post_tags WHERE post_id = ?', [id]);
        
        // Add new tags
        if (tags.length > 0) {
          await this.addTagsToBlog(connection, id, tags);
        }
      }

      await connection.commit();
      return await this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete blog post
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM blogs WHERE blog_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get blog tags
  static async getBlogTags(blogId) {
    try {
      const [rows] = await pool.execute(`
        SELECT bt.tag_id, bt.name, bt.slug, bt.color
        FROM blog_tags bt
        JOIN blog_post_tags bpt ON bt.tag_id = bpt.tag_id
        WHERE bpt.post_id = ?
      `, [blogId]);
      return rows;
    } catch (error) {
      return [];
    }
  }

  // Add tags to blog
  static async addTagsToBlog(connection, blogId, tags) {
    for (const tag of tags) {
      let tagId;
      
      if (typeof tag === 'object' && tag.tag_id) {
        tagId = tag.tag_id;
      } else {
        // Create tag if it doesn't exist
        const tagName = typeof tag === 'string' ? tag : tag.name;
        const tagSlug = this.generateSlug(tagName);
        
        const [existingTag] = await connection.execute(
          'SELECT tag_id FROM blog_tags WHERE slug = ?', [tagSlug]
        );
        
        if (existingTag.length > 0) {
          tagId = existingTag[0].tag_id;
        } else {
          const [newTag] = await connection.execute(
            'INSERT INTO blog_tags (name, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          tagId = newTag.insertId;
        }
      }
      
      // Link tag to blog
      await connection.execute(
        'INSERT IGNORE INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
        [blogId, tagId]
      );
    }
  }

  // Get related posts
  static async getRelatedPosts(blogId, limit = 5) {
    try {
      const [rows] = await pool.execute(`
        SELECT DISTINCT b.blog_id, b.title, b.slug, b.excerpt, b.featured_image, b.published_at
        FROM blogs b
        JOIN blog_post_tags bpt1 ON b.blog_id = bpt1.post_id
        JOIN blog_post_tags bpt2 ON bpt1.tag_id = bpt2.tag_id
        WHERE bpt2.post_id = ? AND b.blog_id != ? AND b.status = 'published'
        AND (b.published_at IS NULL OR b.published_at <= NOW())
        ORDER BY b.published_at DESC
        LIMIT ?
      `, [blogId, blogId, limit]);
      
      return rows;
    } catch (error) {
      return [];
    }
  }

  // Increment view count
  static async incrementViewCount(id) {
    try {
      await pool.execute('UPDATE blogs SET view_count = view_count + 1 WHERE blog_id = ?', [id]);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Get blog statistics
  static async getStatistics() {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_posts,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_posts,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_posts,
          SUM(view_count) as total_views,
          AVG(view_count) as avg_views
        FROM blogs
      `);
      
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Utility functions
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  static calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Count total blogs
  static async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM blogs WHERE 1=1';
      const params = [];

      if (filters.status && filters.status !== 'all') {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.category_id) {
        query += ' AND category_id = ?';
        params.push(filters.category_id);
      }

      if (filters.search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      const [rows] = await pool.execute(query, params);
      return rows[0].count;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = Blog; 