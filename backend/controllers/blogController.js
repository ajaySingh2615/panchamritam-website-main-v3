const Blog = require('../models/blog');
const BlogCategory = require('../models/blogCategory');
const BlogTag = require('../models/blogTag');
const { AppError } = require('../middlewares/errorHandler');

// Get all blogs with filters and pagination
exports.getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      category_id,
      tag,
      search,
      is_featured,
      author_id
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      limit: parseInt(limit),
      offset,
      status,
      category_id,
      tag,
      search,
      is_featured: is_featured !== undefined ? is_featured === 'true' : null,
      author_id
    };

    const blogs = await Blog.findAll(options);
    const totalBlogs = await Blog.count({ status, category_id, search });
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalBlogs,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      data: {
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findBySlug(slug);
    
    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Increment view count
    await Blog.incrementViewCount(blog.blog_id);

    // Get related posts
    const relatedPosts = await Blog.getRelatedPosts(blog.blog_id, 5);

    res.status(200).json({
      status: 'success',
      data: {
        blog,
        relatedPosts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by ID (admin)
exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        blog
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new blog post
exports.createBlog = async (req, res, next) => {
  try {
    const blogData = {
      ...req.body,
      author_id: req.user.user_id
    };

    // Validate required fields
    if (!blogData.title || !blogData.content) {
      return next(new AppError('Title and content are required', 400));
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      status: 'success',
      message: 'Blog post created successfully',
      data: {
        blog
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('A blog post with this slug already exists', 400));
    }
    next(error);
  }
};

// Update blog post
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Check if user is author or admin
    if (existingBlog.author_id !== req.user.user_id && req.user.role_name !== 'admin') {
      return next(new AppError('You can only edit your own blog posts', 403));
    }

    const blog = await Blog.update(id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Blog post updated successfully',
      data: {
        blog
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('A blog post with this slug already exists', 400));
    }
    next(error);
  }
};

// Delete blog post
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Check if user is author or admin
    if (existingBlog.author_id !== req.user.user_id && req.user.role_name !== 'admin') {
      return next(new AppError('You can only delete your own blog posts', 403));
    }

    const deleted = await Blog.delete(id);
    
    if (!deleted) {
      return next(new AppError('Blog post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Get category
    const category = await BlogCategory.findBySlug(slug);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      limit: parseInt(limit),
      offset,
      status: 'published',
      category_id: category.category_id
    };

    const blogs = await Blog.findAll(options);
    const totalBlogs = await Blog.count({ status: 'published', category_id: category.category_id });
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalBlogs,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      data: {
        category,
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get blogs by tag
exports.getBlogsByTag = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Get tag
    const tag = await BlogTag.findBySlug(slug);
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      limit: parseInt(limit),
      offset,
      status: 'published',
      tag: tag.tag_id
    };

    const blogs = await Blog.findAll(options);
    const totalBlogs = await Blog.count({ status: 'published', tag: tag.tag_id });
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalBlogs,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      data: {
        tag,
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search blogs
exports.searchBlogs = async (req, res, next) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return next(new AppError('Search query is required', 400));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      limit: parseInt(limit),
      offset,
      status: 'published',
      search: query
    };

    const blogs = await Blog.findAll(options);
    const totalBlogs = await Blog.count({ status: 'published', search: query });
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      query,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalBlogs,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      data: {
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured blogs
exports.getFeaturedBlogs = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    
    const options = {
      limit: parseInt(limit),
      offset: 0,
      status: 'published',
      is_featured: true
    };

    const blogs = await Blog.findAll(options);

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get blog statistics (admin)
exports.getBlogStatistics = async (req, res, next) => {
  try {
    const stats = await Blog.getStatistics();

    res.status(200).json({
      status: 'success',
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Category management
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.findAll();

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        category
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('A category with this name already exists', 400));
    }
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await BlogCategory.update(id, req.body);
    
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await BlogCategory.delete(id);
    
    if (!deleted) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('Cannot delete category')) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

// Tag management
exports.getAllTags = async (req, res, next) => {
  try {
    const tags = await BlogTag.findAll();

    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: {
        tags
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularTags = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const tags = await BlogTag.getPopular(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: {
        tags
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const tag = await BlogTag.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Tag created successfully',
      data: {
        tag
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('A tag with this name already exists', 400));
    }
    next(error);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tag = await BlogTag.update(id, req.body);
    
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Tag updated successfully',
      data: {
        tag
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await BlogTag.delete(id);
    
    if (!deleted) {
      return next(new AppError('Tag not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 