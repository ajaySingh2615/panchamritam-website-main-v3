import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import available images
import fruitImage from '../assets/images/fresh-fruits.webp';
import vegetableImage from '../assets/images/fresh-vegetables.webp';
import legumeImage from '../assets/images/dried-vegetables.webp';
import productImage1 from '../assets/images/organic-honey.webp';
import productImage2 from '../assets/images/organic-tea.webp';
import productImage3 from '../assets/images/beauty-products.webp';
import productImage4 from '../assets/images/milk-products.webp';
import dealImage from '../assets/images/whole-section-1.webp';
import testimonialUser1 from '../assets/images/testimonial-person.webp';
import testimonialUser2 from '../assets/images/testimonial-person-2.webp';
import brandLogo1 from '../assets/images/certified-badge.webp';
import brandLogo2 from '../assets/images/certified-badge.webp';
import brandLogo3 from '../assets/images/certified-badge.webp';
import brandLogo4 from '../assets/images/certified-badge.webp';
import leaf1Image from '../assets/images/leaf1.webp';
import leafImage from '../assets/images/leaf-2.webp';

// Import hero section images
import heroImage from '../assets/images/hero-section/organic-products-hero.png';
import heroBasilLeaf from '../assets/images/hero-section/basil-leaf.png';
import heroLogoLeaf from '../assets/images/hero-section/logo-leaf-new.png';
import heroLogoLeaf2 from '../assets/images/hero-section/logo-leaf2-free-img.png';
import heroLeaves from '../assets/images/hero-section/leaves-free-img.png';

// Product Card Component
const ProductCard = ({ image, category, title, price, salePrice, index, inView }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            width="300"
            height="300"
          />
        </div>
        
        {salePrice && (
          <div className="absolute top-4 right-4 bg-[#5B8C3E] text-white text-xs font-semibold px-2 py-1 rounded-full">
            Sale!
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#5B8C3E] px-4 py-2 rounded-md font-medium text-sm"
          >
            Quick View
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-[#6B7280] text-xs">{category}</p>
        <h3 className="text-[#1F2937] font-medium my-1">{title}</h3>
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-[#5B8C3E] font-bold">£{salePrice}</span>
              <span className="text-[#6B7280] text-sm line-through">£{price}</span>
            </>
          ) : (
            <span className="text-[#5B8C3E] font-bold">£{price}</span>
          )}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="mt-3 w-full bg-[#5B8C3E] text-white py-2 rounded-md font-medium text-sm hover:bg-[#4a7033] transition-colors"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index, inView, benefits }) => {
  const delay = index * 0.2;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Gradient background effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#f2f8f4] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-[#EDF5E5] rounded-full flex items-center justify-center mb-5 group-hover:bg-[#daeacd] transition-colors duration-300">
          <span className="text-[#5B8C3E] text-3xl">{icon}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{title}</h3>
        <p className="text-[#6B7280] text-sm mb-4">{description}</p>
        
        {/* Benefits list */}
        {benefits && benefits.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={isHovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 mt-2 text-sm text-gray-600">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#5B8C3E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
        <div className="flex items-center mt-4">
          <motion.span 
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            className="text-xs font-medium text-[#5B8C3E] inline-flex items-center"
          >
            <span>Learn more</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.span>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#f2f8f4] rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700" aria-hidden="true" />
    </motion.div>
  );
};

// Category Card Component
const CategoryCard = ({ image, title, description, index, inView }) => {
  const delay = index * 0.3;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, delay }}
      className="relative overflow-hidden rounded-xl h-80 group"
    >
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          width="600"
          height="400"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="mb-4 text-white/90 text-sm"
        >
          {description}
        </motion.p>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#5B8C3E] hover:bg-[#4a7033] text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-1 w-fit"
        >
          Shop Now
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ image, name, content, rating, index, inView }) => {
  const delay = index * 0.3;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <motion.svg 
            key={i} 
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, delay: delay + (i * 0.1) }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-yellow-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
        <span className="ml-1 text-sm font-medium text-[#5B8C3E]">{rating}/5</span>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.6 }}
        className="text-[#6B7280] italic mb-4"
      >
        "{content}"
      </motion.p>
      
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            loading="lazy"
            width="40"
            height="40"
          />
        </div>
        <p className="font-medium text-[#1F2937]">{name}</p>
      </div>
    </motion.div>
  );
};

// SVG Shape components for decorative elements
const DecorativeShape = ({ className }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path 
      fill="#5B8C3E" 
      fillOpacity="0.1"
      d="M45.3,-69.3C59.9,-62.8,73.5,-52.7,80.1,-39.1C86.7,-25.5,86.4,-8.4,81.8,6.7C77.2,21.8,68.4,34.9,57.5,44.4C46.6,54,33.6,60.1,19.3,66.3C5,72.6,-10.6,79,-24.1,76.5C-37.6,74,-49.1,62.6,-58.3,49.8C-67.4,37,-74.2,22.8,-76.6,7.7C-79,-7.4,-77,-23.3,-68.5,-34.4C-60,-45.4,-45,-51.5,-31.6,-58.4C-18.3,-65.3,-6.6,-73,6.9,-83.8C20.5,-94.6,40.9,-108.5,48.7,-102.3C56.5,-96.1,51.7,-69.7,45.3,-69.3Z" 
      transform="translate(100 100)" 
    />
  </svg>
);

// Animated badge component
const AnimatedBadge = ({ text, delay = 0, inView }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.span 
      className="inline-block bg-[#f2f8f4] px-3 py-1 rounded-full text-[#5B8C3E] text-sm font-medium group"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <span className="flex items-center gap-2">
        <motion.span 
          className="inline-block w-2 h-2 bg-[#5B8C3E] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {text}
      </span>
    </motion.span>
  );
};

// Text reveal animation component (keeping existing AnimatedText but improving it)
const AnimatedText = ({ text, delay = 0, className, inView }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.span 
      className={`block ${className}`}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
};

// Parallax element component
const ParallaxElement = ({ children, scrollYProgress, strength = 0.2, className }) => {
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${strength * 100}%`]);
  
  return (
    <motion.div
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  // Animation hooks for scroll sections
  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { damping: 15, mass: 0.1, stiffness: 100 });
  
  // Mouse position state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse move for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 40,
        y: (e.clientY - window.innerHeight / 2) / 40
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Create refs with useRef
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const categoriesRef = useRef(null);
  const promoRef = useRef(null);
  const testimonialsRef = useRef(null);
  const dealRef = useRef(null);
  const brandsRef = useRef(null);
  
  // Use inView booleans separately
  const heroInView = useInView(heroRef, { once: false, threshold: 0.2 });
  const featuresInView = useInView(featuresRef, { once: false, threshold: 0.2 });
  const productsInView = useInView(productsRef, { once: false, threshold: 0.1 });
  const categoriesInView = useInView(categoriesRef, { once: false, threshold: 0.1 });
  const promoInView = useInView(promoRef, { once: false, threshold: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: false, threshold: 0.1 });
  const dealInView = useInView(dealRef, { once: false, threshold: 0.3 });
  const brandsInView = useInView(brandsRef, { once: false, threshold: 0.5 });

  // Scroll indicator opacity animation
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  
  // Add accessibility hooks
  const prefersReducedMotion = useReducedMotion();
  
  // Stripe-inspired animations - improved
  const heroContentY = useTransform(scrollYProgress, [0, 0.3], [0, prefersReducedMotion ? 0 : 50]);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  
  // Subtle parallax for components - improved
  const heroImageX = useTransform(scrollYProgress, [0, 0.3], [prefersReducedMotion ? 0 : 30, 0]);
  const heroImageOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.8]);
  
  // Control loading state
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Handle image loading
  useEffect(() => {
    const heroImg = new Image();
    heroImg.src = heroImage;
    heroImg.onload = () => {
      setImagesLoaded(true);
    };
  }, []);

  // Product data
  const products = [
    { id: 1, image: productImage1, category: 'Groceries', title: 'Assorted Coffee', price: '35.00', salePrice: null },
    { id: 2, image: productImage2, category: 'Groceries', title: 'Hand Sanitizer', price: '15.00', salePrice: null },
    { id: 3, image: productImage3, category: 'Groceries', title: 'Handpicked Red Chillies', price: '19.00', salePrice: null },
    { id: 4, image: productImage4, category: 'Groceries', title: 'Natural Extracted Edible Oil', price: '34.00', salePrice: '25.00' },
  ];

  // Feature data
  const features = [
    { 
      icon: '🌱', 
      title: 'Certified Organic', 
      description: 'All our products are certified organic, ensuring you get the purest quality without harmful chemicals.',
      benefits: ['Pesticide-free farming', 'No GMOs', 'Strict certification process']
    },
    { 
      icon: '🚚', 
      title: 'Free Delivery', 
      description: 'Enjoy free carbon-neutral delivery on all orders above $50, anywhere within the country.',
      benefits: ['Fast & reliable service', 'Order tracking available', 'Eco-friendly packaging']
    },
    { 
      icon: '💰', 
      title: 'Premium Quality', 
      description: 'We carefully select all products to ensure exceptional quality while keeping prices affordable.',
      benefits: ['Direct from farmers', 'Freshness guaranteed', 'Regular quality checks']
    },
    { 
      icon: '↩️', 
      title: 'Easy Returns', 
      description: 'Not completely satisfied? Our no-questions-asked return policy ensures your peace of mind.',
      benefits: ['100% money back', '30-day return window', 'Simple return process']
    },
  ];

  // Categories data
  const categories = [
    { image: fruitImage, title: 'Farm Fresh Fruits', description: 'Ut sollicitudin quam vel purus tempus, vel eleifend felis varius.' },
    { image: vegetableImage, title: 'Fresh Vegetables', description: 'Aliquam porta justo nibh, id laoreet sapien sodales vitae justo.' },
    { image: legumeImage, title: 'Organic Legume', description: 'Phasellus sed urna mattis, viverra libero sed, aliquam est.' },
  ];

  // Testimonials data
  const testimonials = [
    { 
      image: testimonialUser1, 
      name: 'Mila Kunis', 
      content: 'Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      rating: 5
    },
    { 
      image: testimonialUser2, 
      name: 'Mike Sendler', 
      content: 'Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      rating: 5
    },
  ];

  // Brands data
  const brands = [
    { id: 1, logo: brandLogo1, name: 'Brand 1' },
    { id: 2, logo: brandLogo2, name: 'Brand 2' },
    { id: 3, logo: brandLogo3, name: 'Brand 3' },
    { id: 4, logo: brandLogo4, name: 'Brand 4' },
  ];

  return (
    <div className="bg-[#f8f6f3] min-h-screen overflow-x-hidden">
      {/* Custom progress bar - improved */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5B8C3E] to-[#85b565] origin-left z-50"
        style={{ scaleX: smoothY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      
      {/* Tesla-style full-screen scroll sections */}
      <div className="relative snap-y snap-mandatory h-screen overflow-y-auto overflow-x-hidden scroll-smooth bg-[#f8f6f3]">
        {/* Hero Section - Stripe-inspired Design with further enhancements */}
        <section 
          ref={heroRef} 
          className="min-h-screen w-full relative flex items-center py-20 snap-start overflow-hidden bg-[#f8f6f3]"
          aria-label="Hero section"
        >
          {/* Improved background with subtle grain texture */}
          <div className="absolute inset-0 bg-[#f8f6f3] opacity-90 z-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmNWY1ZjUiPjwvcmVjdD4KPC9zdmc+')] opacity-20" />
          </div>
          
          {/* Decorative shapes in background */}
          <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
            <DecorativeShape className="absolute -top-24 -left-24 w-64 h-64 opacity-50 transform rotate-12" />
            <DecorativeShape className="absolute top-1/3 -right-24 w-80 h-80 opacity-40 transform -rotate-12" />
            <DecorativeShape className="absolute -bottom-32 left-1/4 w-72 h-72 opacity-30 transform rotate-45" />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Left - Content Side (Stripe-inspired fade up) - Enhanced */}
              <motion.div 
                className="lg:col-span-5 z-20"
                style={{ 
                  opacity: heroContentOpacity,
                  y: heroContentY
                }}
              >
                <div className="mb-4">
                  <AnimatedBadge 
                    text="100% Organic Products" 
                    delay={0.1}
                    inView={heroInView}
                  />
                </div>
                
                <div className="mb-8">
                  <div className="overflow-hidden mb-2">
                    <motion.h1 
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A2B33] leading-[1.1]"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <span className="block mb-1">Natural solutions for</span>
                      <span className="text-[#5B8C3E]">healthier living</span>
                    </motion.h1>
                  </div>
                  
                  <motion.p
                    className="text-lg text-[#4B5563] opacity-90 max-w-xl mb-8"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    Experience the pure goodness of nature with our premium organic 
                    products. Certified chemical-free and sustainably sourced for 
                    your health and the planet.
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <motion.a 
                      href="#products"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                      className="relative bg-[#5B8C3E] text-white px-7 py-3 rounded-md font-medium overflow-hidden group"
                    >
                      <span className="relative z-10">Shop Now</span>
                      <motion.span
                        className="absolute inset-0 bg-[#4a7033] z-0"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                    
                    <motion.a 
                      href="#about"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                      className="relative bg-white text-[#5B8C3E] border border-[#5B8C3E] px-7 py-3 rounded-md font-medium overflow-hidden group"
                    >
                      <span className="relative z-10">Learn More</span>
                      <motion.span
                        className="absolute inset-0 bg-[#f2f8f4] z-0"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  </motion.div>
                </div>
                
                {/* Trust symbols/indicators */}
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center gap-4 text-sm text-[#6B7280]"
                >
                  <div className="flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5B8C3E]">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">Certified Organic</span>
                  </div>
                  <div className="flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5B8C3E]">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">Free Shipping</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Right - Image Side (Stripe-inspired fade from right) - Enhanced */}
              <motion.div 
                className="lg:col-span-7 relative z-10"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 80 }}
                animate={heroInView && imagesLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  x: heroImageX,
                  opacity: heroImageOpacity
                }}
              >
                {/* Improved product image presentation */}
                <div className="relative">
                  {/* Background gradient blob - enhanced */}
                  <motion.div 
                    className="absolute -z-10 w-full h-full rounded-full filter blur-[80px] bg-gradient-to-tr from-[#dff0e3] to-[#f1faf4]"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Improved hero image presentation */}
                  <div className="relative">
                    {/* Loading placeholder */}
                    {!imagesLoaded && (
                      <div className="w-full h-[500px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {/* Subtle floating animation with better physics */}
                    <motion.div
                      animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                      }}
                      style={{
                        x: prefersReducedMotion ? 0 : mousePosition.x,
                        y: prefersReducedMotion ? 0 : mousePosition.y,
                      }}
                      className={`${!imagesLoaded ? 'invisible' : 'visible'}`}
                    >
                      <img 
                        src={heroImage} 
                        alt="Organic Products Collection" 
                        className="w-full h-auto object-contain max-w-2xl mx-auto drop-shadow-xl"
                        width="800"
                        height="800"
                        loading="eager"
                      />
                    </motion.div>
                    
                    {/* Enhanced decorative elements that follow mouse subtly */}
                    <motion.div
                      className="absolute top-1/4 -right-10 w-32 h-32 opacity-30 pointer-events-none"
                      animate={prefersReducedMotion ? {} : { rotate: [0, 5, 0] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        x: prefersReducedMotion ? 0 : mousePosition.x * -0.2,
                        y: prefersReducedMotion ? 0 : mousePosition.y * -0.2,
                      }}
                    >
                      <img 
                        src={heroLogoLeaf2} 
                        alt="" 
                        className="w-full h-full"
                        width="120"
                        height="120"
                        loading="lazy"
                        aria-hidden="true"
                      />
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-1/4 -left-10 w-28 h-28 opacity-30 pointer-events-none"
                      animate={prefersReducedMotion ? {} : { rotate: [0, -5, 0] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        x: prefersReducedMotion ? 0 : mousePosition.x * 0.2,
                        y: prefersReducedMotion ? 0 : mousePosition.y * 0.2,
                      }}
                    >
                      <img 
                        src={heroLeaves} 
                        alt="" 
                        className="w-full h-full"
                        width="120"
                        height="120"
                        loading="lazy"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Improved scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            style={{ opacity: scrollIndicatorOpacity }}
            aria-hidden="true"
          >
            <motion.div 
              animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-[#4B5563] text-xs font-medium mb-2">Scroll to explore</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="14" height="22" rx="7" stroke="#5B8C3E" strokeWidth="2"/>
                <motion.circle 
                  animate={prefersReducedMotion ? {} : { y: [4, 12, 4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  cx="8" cy="8" r="3" fill="#5B8C3E"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section - Enhanced */}
        <section ref={featuresRef} className="min-h-screen w-full bg-[#f8f6f3] py-24 snap-start flex items-center relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-70" aria-hidden="true" />
          <div className="absolute -left-24 top-1/4 w-48 h-48 rounded-full bg-[#5B8C3E] opacity-5" aria-hidden="true" />
          <div className="absolute -right-24 bottom-1/4 w-64 h-64 rounded-full bg-[#5B8C3E] opacity-5" aria-hidden="true" />
          
          <div className="container mx-auto px-6 relative z-10">
                          <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <span className="text-[#5B8C3E] font-medium text-sm uppercase tracking-wider block mb-2">Why Choose Us</span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">The Organic Advantage</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
              <p className="text-[#6B7280] max-w-2xl mx-auto text-lg">
                We're committed to providing the highest quality organic products while maintaining sustainable practices
                and supporting local farmers. Here's what sets our products apart:
              </p>
            </motion.div>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  benefits={feature.benefits}
                  index={index}
                  inView={featuresInView}
                />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center mt-16"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-[#5B8C3E] text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-[#4a7033] transition-colors shadow-lg"
              >
                Shop Now
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Best Selling Products */}
        <section ref={productsRef} className="min-h-screen w-full bg-white py-20 snap-start flex items-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={productsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] mb-4">Best Selling Products</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  category={product.category}
                  title={product.title}
                  price={product.price}
                  salePrice={product.salePrice}
                  index={index}
                  inView={productsInView}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories Showcase */}
        <section ref={categoriesRef} className="min-h-screen w-full bg-[#f8f6f3] py-20 snap-start flex items-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] mb-4">Shop By Category</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  image={category.image}
                  title={category.title}
                  description={category.description}
                  index={index}
                  inView={categoriesInView}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Promotional Banner */}
        <section ref={promoRef} className="min-h-screen w-full bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] snap-start flex items-center">
          <div className="container mx-auto px-4 py-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={promoInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={promoInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H5.45a4 4 0 00-2.83 1.17l-1.9 1.9a4 4 0 00-1.17 2.83V12" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h8a4 4 0 014 4v2a4 4 0 01-4 4H8" />
                </svg>
              </motion.div>
              
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                animate={promoInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                Get 25% Off On Your First Purchase!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={promoInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white/90 text-lg mb-8 max-w-2xl mx-auto"
              >
                Try It For Free. No Registration Needed.
              </motion.p>
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={promoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#5B8C3E] px-8 py-3 rounded-md font-semibold text-lg shadow-lg hover:bg-[#f0f0f0] transition-colors"
              >
                Shop Now
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="min-h-screen w-full bg-[#f8f6f3] py-20 snap-start flex items-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] mb-4">Customers Reviews</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  image={testimonial.image}
                  name={testimonial.name}
                  content={testimonial.content}
                  rating={testimonial.rating}
                  index={index}
                  inView={testimonialsInView}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Deal of the Day */}
        <section ref={dealRef} className="min-h-screen w-full bg-gradient-to-br from-[#1F2937] to-[#111827] snap-start flex items-center">
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={dealInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 text-white"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={dealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold mb-4"
                >
                  Deal Of The Day <br />
                  <span className="text-[#5B8C3E]">15% Off</span> On All Vegetables!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={dealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-white/80 mb-8"
                >
                  I am text block. Click edit button to change this tex em ips.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={dealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex gap-4 mb-8"
                >
                  {['24', '06', '32', '15'].map((num, i) => (
                    <div key={i} className="bg-[#5B8C3E] text-white rounded-lg p-3 min-w-[60px] text-center">
                      <div className="text-2xl font-bold">{num}</div>
                      <div className="text-xs">{['Days', 'Hours', 'Mins', 'Secs'][i]}</div>
                    </div>
                  ))}
                </motion.div>
                
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={dealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(91, 140, 62, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5B8C3E] text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-[#4a7033] transition-colors"
                >
                  Shop Now
                </motion.button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={dealInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:w-1/2"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={dealImage} 
                    alt="Deal of the day" 
                    className="w-full h-auto"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Featured Brands */}
        <section ref={brandsRef} className="min-h-[50vh] w-full bg-white py-20 snap-start flex items-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={brandsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] mb-4">Featured Brands</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={brandsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex justify-center filter grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-h-16 w-auto"
                    loading="lazy"
                    width="150"
                    height="60"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 