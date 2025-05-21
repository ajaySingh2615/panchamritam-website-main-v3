import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CategoryFeatures.css';

// Import category images
import picklesImg from '../../assets/images/hero-section/categories-product/pickles.webp';
import oilsImg from '../../assets/images/hero-section/categories-product/oils.webp';
import honeyImg from '../../assets/images/hero-section/categories-product/honey.webp';
import riceImg from '../../assets/images/hero-section/categories-product/himalayan-rice.webp';
import herbsImg from '../../assets/images/hero-section/categories-product/himalayan-Herbs.webp';
import gheeImg from '../../assets/images/hero-section/categories-product/Ghee.webp';
import floursImg from '../../assets/images/hero-section/categories-product/Flours.webp';
import logoLeaf from '../../assets/images/hero-section/logo-leaf-new.png';

// Category Card Component
const CategoryCard = ({ category, index, inView }) => {
  return (
    <motion.div
      className="category-card group"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      style={{ backgroundColor: category.bgColor }}
    >
      <div className="category-content">
        <span className="category-label">{category.label}</span>
        <h3 className="category-title">{category.name}</h3>
        
        <Link to={`/shop?category=${category.id}`} className="shop-now-btn">
          SHOP NOW
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      <div className="category-image-container">
        <img 
          src={category.image} 
          alt={category.name} 
          className="category-image" 
        />
      </div>
    </motion.div>
  );
};

const CategoryFeatures = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  
  // Category data
  const categories = [
    {
      id: 'pickles',
      label: 'Natural Products',
      name: 'PICKLES',
      image: picklesImg,
      bgColor: '#F5F5DC' // Beige
    },
    {
      id: 'oils',
      label: 'Natural Products',
      name: 'OILS',
      image: oilsImg,
      bgColor: '#E6F2FF' // Light blue
    },
    {
      id: 'honey',
      label: 'Natural Products',
      name: 'HONEY',
      image: honeyImg,
      bgColor: '#FFF2CC' // Light yellow
    },
    {
      id: 'rice',
      label: 'Himalayan Products',
      name: 'RICE',
      image: riceImg,
      bgColor: '#E6FFE6' // Light green
    },
    {
      id: 'herbs',
      label: 'Himalayan Products',
      name: 'HERBS',
      image: herbsImg,
      bgColor: '#FFE6E6' // Light pink
    },
    {
      id: 'ghee',
      label: 'Dairy Products',
      name: 'GHEE',
      image: gheeImg,
      bgColor: '#FFF9E6' // Light cream
    },
    {
      id: 'flours',
      label: 'Natural Products',
      name: 'FLOURS',
      image: floursImg,
      bgColor: '#F0E6FF' // Light lavender
    }
  ];
  
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
          Product <span className="text-[#7BAD50]">Categories</span>
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
      
      {/* Categories grid */}
      <div className="categories-grid">
        {categories.map((category, index) => (
          <CategoryCard 
            key={category.id}
            category={category}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFeatures; 