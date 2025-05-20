import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
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
const FeatureCard = ({ icon, title, description, index, inView }) => {
  const delay = index * 0.2;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 bg-[#EDF5E5] rounded-full flex items-center justify-center mb-4">
        <span className="text-[#5B8C3E] text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{title}</h3>
      <p className="text-[#6B7280] text-sm">{description}</p>
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

// Text reveal animation component
const AnimatedText = ({ text, delay = 0, className, inView }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-1">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
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
        x: (e.clientX - window.innerWidth / 2) / 20,
        y: (e.clientY - window.innerHeight / 2) / 20
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
  const heroInView = useInView(heroRef, { once: false, threshold: 0.5 });
  const featuresInView = useInView(featuresRef, { once: false, threshold: 0.2 });
  const productsInView = useInView(productsRef, { once: false, threshold: 0.1 });
  const categoriesInView = useInView(categoriesRef, { once: false, threshold: 0.1 });
  const promoInView = useInView(promoRef, { once: false, threshold: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: false, threshold: 0.1 });
  const dealInView = useInView(dealRef, { once: false, threshold: 0.3 });
  const brandsInView = useInView(brandsRef, { once: false, threshold: 0.5 });

  // Scroll indicator opacity animation
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  
  // Text reveal progress based on scroll
  const textRevealProgress = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const textClipPath = useMotionTemplate`inset(0% 0% ${textRevealProgress.get() * 100}% 0%)`;
  
  // Parallax transformations for different elements
  const heroImageY = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"]);
  const heroBackgroundY = useTransform(scrollYProgress, [0, 0.3], ["0%", "10%"]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.3], ["0%", "15%"]);
  
  // 3D rotation effect based on scroll and mouse position
  const heroRotateX = useTransform(scrollYProgress, [0, 0.3], [0, -5]);
  const heroRotateY = useMotionValue(0);
  
  useEffect(() => {
    heroRotateY.set(mousePosition.x / 5);
  }, [mousePosition.x, heroRotateY]);

  // Product data
  const products = [
    { id: 1, image: productImage1, category: 'Groceries', title: 'Assorted Coffee', price: '35.00', salePrice: null },
    { id: 2, image: productImage2, category: 'Groceries', title: 'Hand Sanitizer', price: '15.00', salePrice: null },
    { id: 3, image: productImage3, category: 'Groceries', title: 'Handpicked Red Chillies', price: '19.00', salePrice: null },
    { id: 4, image: productImage4, category: 'Groceries', title: 'Natural Extracted Edible Oil', price: '34.00', salePrice: '25.00' },
  ];

  // Feature data
  const features = [
    { icon: '🚚', title: 'Free Shipping', description: 'Above $5 Only' },
    { icon: '✓', title: 'Certified Organic', description: '100% Guarantee' },
    { icon: '💰', title: 'Huge Savings', description: 'At Lowest Price' },
    { icon: '↩️', title: 'Easy Returns', description: 'No Questions Asked' },
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
      {/* Tesla-style full-screen scroll sections */}
      <div className="relative snap-y snap-mandatory h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
        {/* Hero Section - Enhanced with scroll-based animations */}
        <section ref={heroRef} className="h-screen w-full relative flex flex-col justify-center items-center snap-start overflow-hidden">
          {/* Background gradient with parallax effect */}
          <ParallaxElement 
            scrollYProgress={scrollYProgress} 
            strength={0.1}
            className="absolute inset-0 z-0"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-[#f3f8f1] to-[#e8f0e3]"
              style={{ y: heroBackgroundY }}
            ></motion.div>
          </ParallaxElement>
          
          {/* Animated decorative elements with parallax effect */}
          <ParallaxElement 
            scrollYProgress={scrollYProgress}
            strength={-0.2}
            className="absolute -top-20 -right-20 w-96 h-96 opacity-50 pointer-events-none z-10"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -5, 0],
                x: mousePosition.x * -0.5,
                y: mousePosition.y * -0.5
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={heroLogoLeaf2} 
                alt="" 
                className="w-full h-full"
                width="300"
                height="300"
              />
            </motion.div>
          </ParallaxElement>
          
          <ParallaxElement 
            scrollYProgress={scrollYProgress}
            strength={0.3}
            className="absolute bottom-0 left-0 w-80 h-80 opacity-40 pointer-events-none z-10"
          >
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, 5, 0],
                x: mousePosition.x * 0.3,
                y: mousePosition.y * 0.3
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={heroLeaves} 
                alt="" 
                className="w-full h-full"
                width="300"
                height="300"
              />
            </motion.div>
          </ParallaxElement>
          
          {/* Animated particles background */}
          <div className="absolute inset-0 z-5">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#5B8C3E]/10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  y: [null, Math.random() * -100, null],
                  x: [null, Math.random() * 100 - 50, null]
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
                style={{
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                  opacity: Math.random() * 0.3 + 0.1
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full z-20">
            {/* Left - Hero Content with scroll-based animations */}
            <motion.div 
              className="text-left order-2 lg:order-1"
              style={{ y: heroContentY }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-block bg-[#f1f8eb] px-4 py-2 rounded-full mb-5 shadow-sm"
                style={{
                  x: mousePosition.x * 0.1,
                  y: mousePosition.y * 0.1
                }}
              >
                <span className="text-[#5B8C3E] font-medium text-sm flex items-center gap-2">
                  <img src={heroLogoLeaf} alt="" className="h-4 w-4" width="16" height="16" />
                  100% Organic Products
                </span>
              </motion.div>
              
              <motion.div className="overflow-hidden">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6 text-[#1F2937]"
                  style={{ 
                    x: mousePosition.x * 0.05,
                    y: mousePosition.y * 0.05
                  }}
                >
                  <AnimatedText 
                    text="Healthy Living" 
                    delay={0.5} 
                    inView={heroInView}
                    className="block"
                  />
                  
                  <motion.span 
                    className="block mt-2 text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#5B8C3E] to-[#85b565]"
                  >
                    <AnimatedText
                      text="Starts With Nature" 
                      delay={1} 
                      inView={heroInView}
                    />
                  </motion.span>
                </motion.h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-lg text-[#4B5563] mb-8 max-w-xl"
              >
                Experience the pure goodness of nature with our premium organic products. 
                Certified chemical-free and sustainably sourced for your health and the planet.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 25px -5px rgba(91, 140, 62, 0.4)",
                    x: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5B8C3E] text-white px-8 py-3 rounded-md font-semibold text-lg shadow-lg hover:bg-[#4a7033] transition-colors relative overflow-hidden group"
                >
                  <span className="relative z-10">Shop Now</span>
                  <motion.span 
                    className="absolute inset-0 bg-[#4a7033] z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.button>
                
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    x: 5
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-[#5B8C3E] text-[#5B8C3E] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#f1f8eb] transition-colors relative overflow-hidden group"
                >
                  <span className="relative z-10">Learn More</span>
                  <motion.span 
                    className="absolute inset-0 bg-[#f1f8eb] z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="mt-12 grid grid-cols-3 gap-6"
              >
                {[
                  { icon: '🌿', title: '100% Organic', desc: 'Certified Products' },
                  { icon: '🔍', title: 'Transparent', desc: 'Sourcing Process' },
                  { icon: '🌎', title: 'Eco-Friendly', desc: 'Packaging Materials' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 2.2 + (index * 0.1) }}
                    className="text-center"
                    whileHover={{ 
                      y: -5, 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      x: mousePosition.x * (0.05 * (index + 1)),
                      y: mousePosition.y * (0.05 * (index + 1)),
                    }}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <h3 className="text-[#1F2937] font-medium text-sm">{item.title}</h3>
                    <p className="text-[#6B7280] text-xs">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Right - Hero Image with 3D effect */}
            <motion.div 
              className="relative order-1 lg:order-2 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ 
                y: heroImageY,
                rotateX: heroRotateX,
                rotateY: heroRotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d"
              }}
            >
              <motion.div
                className="relative z-10 max-w-md"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePosition.x * -0.2,
                  y: mousePosition.y * -0.2,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <img 
                  src={heroImage} 
                  alt="Organic Products" 
                  className="w-full h-auto"
                  width="600"
                  height="600"
                />
                
                {/* Interactive glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#5B8C3E]/20 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    x: mousePosition.x * 0.5,
                    y: mousePosition.y * 0.5,
                  }}
                />
              </motion.div>
              
              <motion.div
                className="absolute w-40 h-40 top-0 right-0 z-20"
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  x: [0, 10, 0, -10, 0],
                  y: [0, -10, 0, 10, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePosition.x * 0.3,
                  y: mousePosition.y * 0.3,
                  rotateY: mousePosition.x * 0.1,
                  rotateX: mousePosition.y * 0.1,
                }}
              >
                <img 
                  src={heroBasilLeaf} 
                  alt="" 
                  className="w-full h-full"
                  width="160"
                  height="160"
                />
              </motion.div>
              
              {/* Floating circles decoration with mouse interaction */}
              <motion.div
                className="absolute rounded-full w-20 h-20 bg-[#f1f8eb] -bottom-8 left-20 z-0"
                animate={{ 
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePosition.x * 0.2,
                  y: mousePosition.y * 0.2,
                }}
              />
              
              <motion.div
                className="absolute rounded-full w-12 h-12 bg-[#5B8C3E]/10 top-20 -left-10 z-0"
                animate={{ 
                  y: [0, 15, 0],
                  x: [0, 10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePosition.x * -0.15,
                  y: mousePosition.y * -0.15,
                }}
              />
              
              <motion.div
                className="absolute rounded-full w-16 h-16 bg-[#5B8C3E]/20 -top-10 right-20 z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePosition.x * 0.1,
                  y: mousePosition.y * 0.1,
                }}
              />
            </motion.div>
          </div>
          
          {/* Custom scroll progress indicator */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-[#5B8C3E] origin-left z-50"
            style={{ scaleX: smoothY }}
          />
          
          {/* Scroll indicator with enhanced animation */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ 
              opacity: scrollIndicatorOpacity,
              y: useTransform(scrollYProgress, [0, 0.1], [0, 50]) 
            }}
          >
            <motion.span 
              className="text-[#6B7280] text-sm mb-2"
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Scroll Down
            </motion.span>
            <motion.div 
              animate={{ 
                y: [0, 10, 0],
                boxShadow: [
                  "0 0 0 rgba(91, 140, 62, 0)",
                  "0 0 15px rgba(91, 140, 62, 0.5)",
                  "0 0 0 rgba(91, 140, 62, 0)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/80 rounded-full p-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5B8C3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className="min-h-screen w-full bg-[#f8f6f3] py-20 snap-start flex items-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] mb-4">Why Choose Our Products?</h2>
              <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
              <p className="text-[#6B7280] max-w-2xl mx-auto">Experience the finest quality organic products with our premium selection.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  inView={featuresInView}
                />
              ))}
            </div>
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