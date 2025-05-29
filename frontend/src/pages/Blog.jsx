import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      const url = '/api/blogs?status=published&limit=9&page=1';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success') {
        setBlogs(data.data.blogs);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#EDF5E5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading Blog...</h1>
            <div className="w-12 h-12 border-4 border-[#5B8C3E] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-[#5B8C3E] font-medium">Loading wellness wisdom...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#EDF5E5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-lg text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#EDF5E5]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center mb-8">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-[#5B8C3E] hover:text-[#3B5323] text-sm font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">Blog</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6">
              Ayurvedic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50]">Wisdom</span> & Wellness
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover ancient wisdom for modern living. Explore our collection of articles on 
              Ayurvedic practices, healthy recipes, and natural wellness tips.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Blog Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h2 className="text-3xl font-playfair font-bold text-gray-900">Latest Articles</h2>
              <div className="ml-4 h-px bg-gradient-to-r from-[#5B8C3E] to-transparent flex-1"></div>
            </div>
            
            <p className="text-gray-600 text-sm">
              Found {blogs.length} articles
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">There are no published articles available at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.blog_id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {blog.featured_image && (
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(blog.published_at || blog.created_at)}
                    </div>

                    {blog.category_name && (
                      <span className="inline-block bg-[#EDF5E5] text-[#5B8C3E] text-xs px-3 py-1 rounded-full mb-3 font-medium">
                        {blog.category_name}
                      </span>
                    )}

                    <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#5B8C3E] transition-colors duration-200">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || truncateText(blog.content)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {blog.author_name}
                      </div>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-[#5B8C3E] hover:text-[#3B5323] font-medium group-hover:translate-x-1 transition-all duration-200"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 