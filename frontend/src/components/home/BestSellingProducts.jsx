import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';
import './BestSellingProducts.css';
import logoLeaf from '../../assets/images/hero-section/logo-leaf-new.png';

const ProductCard = ({ product, index, inView }) => {
  // Determine if product is coming from left or right
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      className="product-card-home bg-[#f8f6f3] rounded-lg overflow-hidden transition-all duration-300"
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Link to={`/product/${product.product_id}`} className="block">
        <div className="product-image-container">
          <img 
            src={product.image_url || '/placeholder-product.jpg'} 
            alt={product.name} 
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          
          {/* Sale badge */}
          {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price) && (
            <span className="absolute top-3 right-3 bg-[#9bc948] text-white text-xs font-bold py-1 px-2 rounded">
              Sale!
            </span>
          )}
        </div>
        
        <div className="p-4">
          <div className="text-gray-500 text-sm mb-1">
            {product.category_name || 'Uncategorized'}
          </div>
          
          <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2 h-14">
            {product.name}
          </h3>
          
          <div className="mt-auto">
            {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price) ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">
                  ₹{parseFloat(product.regular_price).toFixed(2)}
                </span>
                <span className="text-[#9bc948] font-bold text-lg">
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-[#9bc948] font-bold text-lg">
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Fetch best selling products from the backend
    const fetchBestSellingProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?sort=popular&limit=8`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch best selling products');
        }
        
        const data = await response.json();
        if (data && data.data && data.data.products) {
          setProducts(data.data.products);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchBestSellingProducts();
  }, []);
  
  useEffect(() => {
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section comes into view
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4" ref={sectionRef}>
      {/* Section header with animated logo */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Best <span className="text-[#7BAD50]">Selling</span> Products
        </motion.h2>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img 
            src={logoLeaf} 
            alt="Decorative leaf" 
            className="h-10 object-contain" 
          />
        </motion.div>
      </div>
      
      {/* Products grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard 
              key={product.product_id} 
              product={product} 
              index={index}
              inView={inView}
            />
          ))}
        </div>
      )}
      
      {/* View All Products button */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 bg-[#5B8C3E] hover:bg-[#4A7A2D] text-white py-3 px-6 rounded-md transition-all duration-300"
        >
          View All Products
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export default BestSellingProducts; 