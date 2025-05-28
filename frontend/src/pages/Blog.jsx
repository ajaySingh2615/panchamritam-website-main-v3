import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, Tag, Eye, Clock } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current filters from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category');
  const currentSearch = searchParams.get('search');
  const [searchQuery, setSearchQuery] = useState(currentSearch || '');

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchPopularTags();
    fetchFeaturedBlogs();
  }, [currentPage, currentCategory, currentSearch]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9'
      });

      if (currentCategory) params.append('category_id', currentCategory);
      if (currentSearch) params.append('search', currentSearch);

      const response = await fetch(`/api/blogs?${params}`);
      const data = await response.json();

      if (data.status === 'success') {
        setBlogs(data.data.blogs);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (error) {
      setError('Error loading blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blogs/categories');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await fetch('/api/blogs/tags/popular?limit=10');
      const data = await response.json();
      if (data.status === 'success') {
        setPopularTags(data.data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch('/api/blogs/featured?limit=3');
      const data = await response.json();
      if (data.status === 'success') {
        setFeaturedBlogs(data.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page
    setSearchParams(params);
  };

  const handleCategoryFilter = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to first page
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ayurvedic Wisdom & Wellness Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover ancient wisdom for modern living. Explore our collection of articles on 
            Ayurvedic practices, healthy recipes, and natural wellness tips.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !currentCategory
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.category_id}
                  onClick={() => handleCategoryFilter(category.category_id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentCategory === category.category_id.toString()
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name} ({category.post_count})
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(currentCategory || currentSearch) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Blogs */}
            {!currentCategory && !currentSearch && currentPage === 1 && featuredBlogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredBlogs.map((blog) => (
                    <div key={blog.blog_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {blog.featured_image && (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.published_at || blog.created_at)}
                          {blog.reading_time && (
                            <>
                              <Clock className="h-4 w-4 ml-4 mr-1" />
                              {blog.reading_time} min read
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt || truncateText(blog.content)}
                        </p>
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentSearch ? `Search Results for "${currentSearch}"` : 
                   currentCategory ? 'Category Articles' : 'Latest Articles'}
                </h2>
                {pagination.totalBlogs && (
                  <p className="text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalBlogs)} of {pagination.totalBlogs} articles
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {blogs.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No articles found.</p>
                  {(currentCategory || currentSearch) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View All Articles
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <article key={blog.blog_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {blog.featured_image && (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.published_at || blog.created_at)}
                          {blog.reading_time && (
                            <>
                              <Clock className="h-4 w-4 ml-4 mr-1" />
                              {blog.reading_time} min read
                            </>
                          )}
                          {blog.view_count > 0 && (
                            <>
                              <Eye className="h-4 w-4 ml-4 mr-1" />
                              {blog.view_count}
                            </>
                          )}
                        </div>

                        {blog.category_name && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                            {blog.category_name}
                          </span>
                        )}

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.excerpt || truncateText(blog.content)}
                        </p>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <Link
                                key={tag.tag_id}
                                to={`/blog/tag/${tag.slug}`}
                                className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag.name}
                              </Link>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {blog.author_name}
                          </div>
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                {pagination.hasPrev && (
                  <Link
                    to={`?${new URLSearchParams({...Object.fromEntries(searchParams), page: (pagination.page - 1).toString()})}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <Link
                      key={pageNum}
                      to={`?${new URLSearchParams({...Object.fromEntries(searchParams), page: pageNum.toString()})}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === pagination.page
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {pagination.hasNext && (
                  <Link
                    to={`?${new URLSearchParams({...Object.fromEntries(searchParams), page: (pagination.page + 1).toString()})}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.category_id}
                    to={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">({category.post_count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag.tag_id}
                      to={`/blog/tag/${tag.slug}`}
                      className="inline-flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-green-100 hover:text-green-800 transition-colors"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 