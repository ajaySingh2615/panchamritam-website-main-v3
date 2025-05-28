import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, Eye, Clock, Share2, ArrowLeft } from 'lucide-react';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  useEffect(() => {
    // Update page title and meta tags when blog loads
    if (blog) {
      document.title = blog.meta_title || blog.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.meta_description || blog.excerpt || '');
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', blog.og_title || blog.title);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', blog.og_description || blog.excerpt || '');
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && blog.og_image) {
        ogImage.setAttribute('content', blog.og_image);
      }
    }

    return () => {
      // Reset title when component unmounts
      document.title = 'Panchamritam - Ayurvedic Foods';
    };
  }, [blog]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}`);
      const data = await response.json();

      if (data.status === 'success') {
        setBlog(data.data.blog);
        setRelatedPosts(data.data.relatedPosts || []);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      setError('Error loading blog post');
      console.error('Error fetching blog detail:', error);
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

  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt || blog.meta_description || '',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = (content) => {
    // Simple content renderer - in a real app, you might use a rich text renderer
    return { __html: content.replace(/\n/g, '<br>') };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {blog.featured_image && (
            <div className="w-full h-64 md:h-96">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category */}
            {blog.category_name && (
              <Link
                to={`/blog/category/${blog.category_slug}`}
                className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4 hover:bg-green-200 transition-colors"
              >
                {blog.category_name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{blog.author_name}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(blog.published_at || blog.created_at)}</span>
              </div>

              {blog.reading_time && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{blog.reading_time} min read</span>
                </div>
              )}

              {blog.view_count > 0 && (
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  <span>{blog.view_count} views</span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-xl text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                {blog.excerpt}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={renderContent(blog.content)}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag.tag_id}
                      to={`/blog/tag/${tag.slug}`}
                      className="inline-flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-full hover:bg-green-100 hover:text-green-800 transition-colors"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {blog.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {blog.author_name}
                  </h3>
                  <p className="text-gray-600">
                    Author at Panchamritam Ayurvedic Foods
                  </p>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <div key={post.blog_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.published_at)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
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

        {/* Newsletter Signup */}
        <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with Ayurvedic Wisdom
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest articles on Ayurvedic practices, 
            healthy recipes, and wellness tips delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 