import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';

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

  const renderContent = (content) => {
    return { __html: content.replace(/\n/g, '<br>') };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
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
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>

        {/* Article */}
        <article>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-4">{blog.author_name}</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(blog.published_at || blog.created_at)}</span>
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-64 md:h-80 object-cover rounded mb-8"
            />
          )}

          {/* Content */}
          <div 
            className="prose prose-gray max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={renderContent(blog.content)}
          />

        </article>

        {/* Related Posts - Simple */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Articles</h3>
            <div className="space-y-4">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.blog_id}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <h4 className="text-gray-900 group-hover:text-green-600 font-medium">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(post.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetail; 