import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, Tag } from 'lucide-react';
import '../styles/blogAnimations.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const heroRef = useRef(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      document.title = blog.meta_title || blog.title;
      // Fetch related posts after blog is loaded
      fetchRelatedPosts();
    }
    return () => {
      document.title = 'Panchamritam - Ayurvedic Foods';
    };
  }, [blog]);

  useEffect(() => {
    // Scroll animations setup
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    setTimeout(() => {
      const animateElements = document.querySelectorAll('.scroll-animate');
      animateElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
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

  const fetchRelatedPosts = async () => {
    try {
      // Only fetch posts from the same category
      if (blog.category_slug) {
        const response = await fetch(`/api/blogs?category=${blog.category_slug}&limit=6&exclude=${blog.blog_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setRelatedPosts(data.data.blogs || []);
        }
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
      setRelatedPosts([]);
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

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getImageContainerClass = (imageUrl) => {
    // Base class
    let className = 'smart-image-container';
    
    // Add loading class if image is still loading
    if (imageLoading) {
      className += ' loading';
    }
    
    return className;
  };

  const renderContent = (content) => {
    return { __html: content.replace(/\n/g, '<br>') };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-center animate-fade-in">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Back Link with animation */}
        <Link
          to="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-all duration-200 hover:translate-x-1 scroll-animate opacity-0 translate-y-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Article with staggered animations */}
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8 scroll-animate opacity-0 translate-y-8 transition-all duration-400">
          
          {/* Category Badge */}
          {blog.category_name && (
            <div className="mb-4 scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '0.05s' }}>
              <Link
                to={`/blog/category/${blog.category_slug}`}
                className="inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full hover:bg-green-200 transition-all duration-200 hover:scale-105"
              >
                <Tag className="h-3 w-3 mr-1" />
                {blog.category_name}
              </Link>
            </div>
          )}

          {/* Title with animation */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight scroll-animate opacity-0 translate-y-8 transition-all duration-400" style={{ transitionDelay: '0.1s' }}>
            {blog.title}
          </h1>

          {/* Excerpt with animation */}
          {blog.excerpt && (
            <div className="text-lg text-gray-700 mb-6 p-4 bg-green-50 border-l-4 border-green-400 italic leading-relaxed scroll-animate opacity-0 translate-y-8 transition-all duration-400" style={{ transitionDelay: '0.15s' }}>
              "{blog.excerpt}"
            </div>
          )}

          {/* Meta with animation */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100 scroll-animate opacity-0 translate-y-8 transition-all duration-400" style={{ transitionDelay: '0.2s' }}>
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
              className="flex items-center text-green-600 hover:text-green-700 transition-all duration-200 hover:scale-105"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>

          {/* Featured Image with parallax effect */}
          {blog.featured_image && (
            <div className="mb-8 scroll-animate opacity-0 translate-y-8 transition-all duration-400" style={{ transitionDelay: '0.25s' }}>
              <div 
                className="relative mx-auto"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div 
                  ref={heroRef}
                  className={getImageContainerClass(blog.featured_image)}
                >
                  {!imageError ? (
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="transition-transform duration-500 hover:scale-105"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-sm">Image not available</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4 italic scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.3s' }}>
                Discover the wisdom of Ayurvedic nutrition and natural wellness
              </p>
            </div>
          )}

          {/* Content with animation */}
          <div className="prose prose-gray max-w-none text-gray-800 leading-relaxed scroll-animate opacity-0 translate-y-8 transition-all duration-400" style={{ transitionDelay: '0.35s' }}>
            <div 
              dangerouslySetInnerHTML={renderContent(blog.content)}
            />
            
            {/* Engagement CTA with animation */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg scroll-animate opacity-0 translate-y-8 transition-all duration-400 hover:shadow-md" style={{ transitionDelay: '0.4s' }}>
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

        {/* Category-Based Related Posts with staggered animation */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8 scroll-animate opacity-0 translate-y-8 transition-all duration-400">
            <div className="flex items-center mb-6 scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '0.05s' }}>
              <h3 className="text-2xl font-semibold text-gray-900">More in {blog.category_name}</h3>
              <div className="ml-3 text-green-600">
                <Tag className="h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-600 mb-8 scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '0.1s' }}>
              Explore more articles in the <span className="font-medium text-green-700">{blog.category_name}</span> category
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 4).map((post, index) => (
                <Link
                  key={post.blog_id}
                  to={`/blog/${post.slug}`}
                  className="block group p-6 border border-gray-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-all duration-200 hover:shadow-md hover:-translate-y-1 scroll-animate opacity-0 translate-y-8"
                  style={{ transitionDelay: `${0.15 + index * 0.05}s` }}
                >
                  <div className="flex items-start space-x-4">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 group-hover:text-green-700 font-medium leading-tight mb-2 transition-colors duration-200">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.published_at || post.created_at)}
                        <span className="ml-3 text-green-600 group-hover:text-green-700 transition-all duration-200 group-hover:translate-x-1">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View category link with animation */}
            <div className="mt-8 text-center scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '0.35s' }}>
              <Link
                to={`/blog/category/${blog.category_slug}`}
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105"
              >
                <Tag className="h-5 w-5 mr-2" />
                View All {blog.category_name} Articles
              </Link>
            </div>
          </div>
        )}

        {/* Empty state with animation */}
        {relatedPosts.length === 0 && blog.category_name && (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8 text-center scroll-animate opacity-0 translate-y-8 transition-all duration-400">
            <div className="text-gray-400 mb-4 scroll-animate opacity-0 scale-75" style={{ transitionDelay: '0.05s' }}>
              <Tag className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.1s' }}>
              More {blog.category_name} Articles Coming Soon
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.15s' }}>
              This is the first article in the {blog.category_name} category. 
              Check back soon for more related content!
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 scroll-animate opacity-0 translate-y-4"
              style={{ transitionDelay: '0.2s' }}
            >
              Explore All Articles
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </Link>
          </div>
        )}

        {/* Author section with animation */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 scroll-animate opacity-0 translate-y-8 transition-all duration-400">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-animate opacity-0 scale-75 transition-all duration-300" style={{ transitionDelay: '0.05s' }}>
              <span className="text-green-700 text-2xl font-bold">
                {blog.author_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.1s' }}>
              Written by {blog.author_name}
            </h4>
            <p className="text-gray-600 mb-6 scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.15s' }}>
              Passionate about sharing ancient Ayurvedic wisdom for modern wellness. 
              Join thousands of readers on a journey to natural health and vitality.
            </p>
            <div className="flex justify-center space-x-6 scroll-animate opacity-0 translate-y-4" style={{ transitionDelay: '0.2s' }}>
              <button
                onClick={handleShare}
                className="text-green-600 hover:text-green-700 transition-all duration-200 hover:scale-105 font-medium"
              >
                Share this story
              </button>
              <Link
                to="/blog"
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105 font-medium"
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