import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './PromoBanner.css';

// Import assets
import leafBg from '../../assets/images/hero-section/leaves-free-img.png';
import tryItForFreeImg from '../../assets/images/hero-section/promo-banners/try-it-for-free.png';
import limitedTimeOfferImg from '../../assets/images/hero-section/promo-banners/limited-time-offer.png';
import naturalProductsImg from '../../assets/images/hero-section/promo-banners/natural-products.png';

// Banner images with corresponding text
const backgroundImages = [
  { 
    id: 'free',
    text: "Try It For Free", 
    image: tryItForFreeImg
  },
  { 
    id: 'limited',
    text: "Limited Time Offer", 
    image: limitedTimeOfferImg
  },
  { 
    id: 'natural',
    text: "100% Natural Products", 
    image: naturalProductsImg
  }
];

const PromoBanner = () => {
  const [inView, setInView] = useState(false);
  const bannerRef = useRef(null);

  // Text animation for subtitle
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animatedTexts = backgroundImages.map(item => item.text);

  useEffect(() => {
    // Set up textual animation interval
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        prevIndex === animatedTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Increased to 5 seconds to give more time to see each image
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 } // Trigger when 25% of the section is visible
    );
    
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }
    
    return () => {
      clearInterval(textInterval);
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [animatedTexts.length]);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(91, 140, 62, 0.4)",
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.98
    }
  };

  return (
    <section 
      ref={bannerRef}
      className="promo-banner relative overflow-hidden"
    >
      {/* Background Images */}
      <div className="promo-background-images">
        <AnimatePresence mode="wait">
          {backgroundImages.map((item, index) => (
            currentTextIndex === index && (
              <motion.div
                key={item.id}
                className="background-image-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <img 
                  src={item.image} 
                  alt="" 
                  className="background-image" 
                />
                <div className="background-overlay"></div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* Decorative elements */}
      <div className="promo-decorative-elements">
        <motion.div 
          className="leaf-element leaf-1"
          initial={{ opacity: 0, rotate: -45, x: -100 }}
          animate={inView ? { opacity: 0.8, rotate: 0, x: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img src={leafBg} alt="" className="w-full h-full object-contain" />
        </motion.div>
        
        <motion.div 
          className="leaf-element leaf-2"
          initial={{ opacity: 0, rotate: 45, x: 100 }}
          animate={inView ? { opacity: 0.6, rotate: 0, x: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <img src={leafBg} alt="" className="w-full h-full object-contain" />
        </motion.div>
        
        <motion.div 
          className="glow-circle"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Subtitle Text at Bottom */}
      <motion.div 
        className="animated-subtitle-container"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={backgroundImages[currentTextIndex].id}
            className="animated-subtitle active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {backgroundImages[currentTextIndex].text}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default PromoBanner; 