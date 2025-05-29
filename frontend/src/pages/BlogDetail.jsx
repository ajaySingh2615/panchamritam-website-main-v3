import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';

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
    if (blog) {
      document.title = blog.meta_title || blog.title;
    }
    return () => {
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
      text: blog.excerpt || '',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = (content) => {
    return { __html: content.replace(/\n/g, '<br>') };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-center">
          <h1 className="text-xl text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-green-600 hover:text-green-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#f8f6f3' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          
          {/* Category Badge */}
          {blog.category_name && (
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                {blog.category_name}
              </span>
            </div>
          )}

          {/* Title with engaging styling */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt - Make it engaging */}
          {blog.excerpt && (
            <div className="text-lg text-gray-700 mb-6 p-4 bg-green-50 border-l-4 border-green-400 italic leading-relaxed">
              "{blog.excerpt}"
            </div>
          )}

          {/* Enhanced Meta with engagement elements */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span className="font-medium">{blog.author_name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(blog.published_at || blog.created_at)}</span>
              </div>
              {blog.reading_time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{blog.reading_time} min read</span>
                </div>
              )}
            </div>
            <button
              onClick={handleShare}
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>

          {/* Featured Image with caption */}
          {blog.featured_image && (
            <div className="mb-8">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm"
              />
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                Discover the wisdom of Ayurvedic nutrition and natural wellness
              </p>
            </div>
          )}

          {/* Engaging content wrapper */}
          <div className="prose prose-gray max-w-none text-gray-800 leading-relaxed">
            <div 
              dangerouslySetInnerHTML={renderContent(blog.content)}
            />
            
            {/* Engagement call-to-action */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm mb-2">
                <strong>💡 Did you find this helpful?</strong>
              </p>
              <p className="text-amber-700 text-sm">
                Ayurvedic wisdom has been transforming lives for thousands of years. 
                Share your thoughts and experiences with our community!
              </p>
            </div>
          </div>

        </article>

        {/* Enhanced Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Continue Your Journey</h3>
              <div className="ml-2 text-green-600">📚</div>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Explore more insights on Ayurvedic nutrition and natural wellness
            </p>
            <div className="space-y-4">
              {relatedPosts.slice(0, 4).map((post, index) => (
                <Link
                  key={post.blog_id}
                  to={`/blog/${post.slug}`}
                  className="block group p-4 border border-gray-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 group-hover:text-green-700 font-medium text-sm leading-tight mb-1">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.published_at)}
                        <span className="ml-3 text-green-600 group-hover:text-green-700">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View all link */}
            <div className="mt-6 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Explore All Articles
                <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* Author Engagement Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-700 text-xl font-bold">
                {blog.author_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Written by {blog.author_name}
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Passionate about sharing ancient Ayurvedic wisdom for modern wellness. 
              Join thousands of readers on a journey to natural health and vitality.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <button
                onClick={handleShare}
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                Share this story
              </button>
              <Link
                to="/blog"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                More articles
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail; 