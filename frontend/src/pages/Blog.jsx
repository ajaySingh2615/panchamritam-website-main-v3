import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Filter, X, ChevronLeft, ChevronRight, Clock, Eye, Tag } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Parse URL parameters on component mount
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || '';
    const page = parseInt(params.get('page')) || 1;
    
    setSearchQuery(search);
    setDebouncedSearchQuery(search);
    setSelectedCategory(category);
    setCurrentPage(page);
    
    fetchCategories();
  }, [location.search]);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setIsSearching(true);
    }
    fetchBlogs();
  }, [debouncedSearchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    if (debouncedSearchQuery === searchQuery) {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, searchQuery]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/blogs/categories');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data.categories);
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Refresh categories when component mounts or when returning from admin
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh categories in case admin added new ones
        fetchCategories();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        status: 'published',
        limit: '9',
        page: currentPage.toString()
      });
      
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (selectedCategory) params.append('category_id', selectedCategory);
      
      const url = `/api/blogs?${params.toString()}`;
      
      const response = await fetch(url);
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

  const updateURL = useCallback((search, category, page) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (page > 1) params.set('page', page.toString());
    
    const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newURL, { replace: true });
  }, [location.pathname, navigate]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    updateURL(debouncedSearchQuery, categoryId, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(debouncedSearchQuery, selectedCategory, page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
    updateURL('', '', 1);
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

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.category_id.toString() === selectedCategory);
    return category ? category.name : '';
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen py-16" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-full mb-6">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Wellness Wisdom...</h1>
            <p className="text-gray-600">Discovering the latest insights for your journey</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-lg text-gray-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-[#5B8C3E] text-white rounded-lg hover:bg-[#3B5323] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#5B8C3E]/5 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#7BAD50]/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#5B8C3E]/5 rounded-full blur-2xl"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-32 right-1/4 w-2 h-2 bg-[#5B8C3E] rounded-full animate-pulse"></div>
          <div className="absolute top-48 left-1/3 w-1 h-1 bg-[#7BAD50] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-[#5B8C3E] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              {/* Breadcrumb */}
              <nav className="flex items-center mb-8">
                <ol className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm shadow-sm border border-white/40">
                  <li className="inline-flex items-center">
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-[#5B8C3E] font-medium transition-colors duration-200"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-gray-400 mx-1" />
                      <span className="font-medium text-[#5B8C3E]">Blog</span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Main Heading */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Discover
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] animate-pulse">
                      Wellness
                    </span>
                    <span className="block">Wisdom</span>
                  </h1>
                  
                  <div className="w-20 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-full"></div>
                </div>
                
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-light">
                  Explore our curated collection of articles on Ayurvedic practices, 
                  healthy recipes, and natural wellness tips for modern living.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-semibold rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-3" />
                  Start Exploring
                </button>
                
                <Link
                  to="#featured"
                  className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Filter className="h-5 w-5 mr-3" />
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Latest Articles</h3>
                      <p className="text-sm text-gray-500">Fresh insights daily</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#5B8C3E]">{pagination.totalBlogs || blogs.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Articles</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#5B8C3E]/10 to-[#7BAD50]/10 rounded-2xl p-4 text-center">
                    <div className="text-xl font-bold text-[#5B8C3E] mb-1">{categories.length}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Categories</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#7BAD50]/10 to-[#5B8C3E]/10 rounded-2xl p-4 text-center">
                    <div className="text-xl font-bold text-[#5B8C3E] mb-1">1000+</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Readers</div>
                  </div>
                </div>

                {/* Featured Categories */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Popular Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 4).map((category) => (
                      <button
                        key={category.category_id}
                        onClick={() => handleCategoryFilter(category.category_id.toString())}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#5B8C3E] hover:text-white text-gray-700 rounded-full transition-all duration-200 transform hover:scale-105"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-[#7BAD50]" />
                  <span className="text-sm font-semibold text-gray-700">2.5k+ Views</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-2xl shadow-xl p-4 text-white transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-semibold">Updated Daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Advanced Search and Filter Section */}
        <div id="search-section" className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5B8C3E]/5 to-[#7BAD50]/5"></div>
          
          <div className="relative">
            <div className="flex flex-col xl:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#5B8C3E] transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search articles, recipes, wellness tips..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5B8C3E]/20 focus:border-[#5B8C3E] outline-none transition-all duration-200 text-lg bg-white/80 backdrop-blur-sm"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-[#5B8C3E] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3 w-full xl:w-auto">
                <Filter className="text-gray-500 h-5 w-5" />
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    disabled={categoriesLoading}
                    className={`px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5B8C3E]/20 focus:border-[#5B8C3E] outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg min-w-[200px] ${
                      categoriesLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {categoriesLoading ? 'Loading categories...' : 'All Categories'}
                    </option>
                    {!categoriesLoading && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name} ({category.post_count || 0} posts)
                        </option>
                      ))
                    ) : !categoriesLoading && categories.length === 0 ? (
                      <option value="" disabled>
                        No categories available
                      </option>
                    ) : null}
                  </select>
                  {categoriesLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[#5B8C3E] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Refresh Categories Button */}
                <button
                  onClick={fetchCategories}
                  disabled={categoriesLoading}
                  className={`p-3 rounded-2xl border-2 border-gray-200 hover:border-[#5B8C3E] transition-all duration-200 ${
                    categoriesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EDF5E5]'
                  }`}
                  title="Refresh categories"
                >
                  <svg 
                    className={`w-5 h-5 text-gray-500 hover:text-[#5B8C3E] transition-colors duration-200 ${
                      categoriesLoading ? 'animate-spin' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-6 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all duration-200 border-2 border-transparent hover:border-gray-200"
                >
                  <X className="h-5 w-5" />
                  <span className="font-medium">Clear</span>
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {searchQuery && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white shadow-lg">
                    <Search className="h-3 w-3 mr-2" />
                    Search: "{searchQuery}"
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setDebouncedSearchQuery('');
                        updateURL('', selectedCategory, currentPage);
                      }}
                      className="ml-2 text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-[#7BAD50] to-[#5B8C3E] text-white shadow-lg">
                    <Tag className="h-3 w-3 mr-2" />
                    Category: {getSelectedCategoryName()}
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        updateURL(debouncedSearchQuery, '', currentPage);
                      }}
                      className="ml-2 text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center">
            <h2 className="text-4xl font-playfair font-bold text-gray-900">
              {searchQuery || selectedCategory ? 'Search Results' : 'Latest Articles'}
            </h2>
            <div className="ml-6 h-px bg-gradient-to-r from-[#5B8C3E] to-transparent flex-1 hidden md:block"></div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-gray-600 font-medium">
              {pagination.totalBlogs ? `${pagination.totalBlogs} articles found` : `${blogs.length} articles`}
            </p>
            {pagination.totalPages > 1 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Page {currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse border border-gray-100">
                  <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gray-200 rounded-full mb-4 w-24"></div>
                    <div className="h-6 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-full mb-6 w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {searchQuery || selectedCategory 
                    ? "We couldn't find any articles matching your criteria. Try adjusting your search or explore different categories." 
                    : "There are no published articles available at the moment. Check back soon for new content!"
                  }
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 font-medium"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <article
                  key={blog.blog_id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-white overflow-hidden">
                    {blog.featured_image ? (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback for no/broken image */}
                    <div className={`absolute inset-0 ${blog.featured_image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100`}>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">No Image</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      {blog.category_name && (
                        <button
                          onClick={() => handleCategoryFilter(blog.category_id.toString())}
                          className="text-xs font-medium text-[#5B8C3E] bg-[#5B8C3E]/10 px-2 py-1 rounded-md hover:bg-[#5B8C3E] hover:text-white transition-colors duration-200"
                        >
                          {blog.category_name}
                        </button>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(blog.published_at || blog.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#5B8C3E] transition-colors duration-200">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || truncateText(blog.content)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {blog.author_name}
                        {blog.view_count && (
                          <>
                            <span className="mx-2">•</span>
                            <Eye className="h-3 w-3 mr-1" />
                            {blog.view_count} views
                          </>
                        )}
                      </div>
                      
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-sm font-medium text-[#5B8C3E] hover:text-[#3B5323] flex items-center group-hover:translate-x-1 transition-all duration-200"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                pagination.hasPrev
                  ? 'text-[#5B8C3E] hover:bg-[#EDF5E5] hover:shadow-lg transform hover:-translate-y-1'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                
                // Show first page, last page, current page, and pages around current page
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-200 ${
                        isCurrentPage
                          ? 'bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white shadow-lg transform scale-110'
                          : 'text-gray-700 hover:bg-[#EDF5E5] hover:shadow-md transform hover:-translate-y-1'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-3 py-2 text-gray-400 font-medium">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                pagination.hasNext
                  ? 'text-[#5B8C3E] hover:bg-[#EDF5E5] hover:shadow-lg transform hover:-translate-y-1'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog; 