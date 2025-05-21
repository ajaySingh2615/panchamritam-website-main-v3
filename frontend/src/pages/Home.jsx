import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

// Import hero images
import heroImage from '../assets/images/hero-section/organic-products-hero.png';
import basilLeaf from '../assets/images/hero-section/basil-leaf.png';
import logoLeaf from '../assets/images/hero-section/logo-leaf-new.png';
import logoLeaf2 from '../assets/images/hero-section/logo-leaf2-free-img.png';
import leaves from '../assets/images/hero-section/leaves-free-img.png';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Add scroll listener for parallax effects
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const heroElements = heroRef.current.querySelectorAll('.parallax-element');
        
        heroElements.forEach(element => {
          const speed = element.dataset.speed || 0.2;
          const yPos = -(scrollPosition * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page w-full">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden hero-gradient-bg pt-16"
      >
        {/* Animated gradient spots */}
        <div className="glow-spot w-[500px] h-[500px] -left-32 top-1/4"></div>
        <div className="glow-spot w-[400px] h-[400px] right-10 top-10" style={{animationDelay: '2s'}}></div>
        <div className="glow-spot w-[300px] h-[300px] left-1/4 bottom-10" style={{animationDelay: '4s'}}></div>

        {/* Decorative Elements - Leaves with parallax effect */}
        <div className="absolute -top-10 right-0 w-40 h-40 parallax-element float opacity-80" data-speed="0.3">
          <img src={basilLeaf} alt="" className="" />
        </div>
        <div className="absolute bottom-20 left-10 w-20 h-20 parallax-element float float-delay-1 opacity-70" data-speed="0.1">
          <img src={logoLeaf} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-40 left-1/4 w-16 h-16 parallax-element float float-delay-2 opacity-70" data-speed="0.2">
          <motion.img 
            src={logoLeaf2} 
            alt="" 
            className="w-full h-full object-contain rotate-slow" 
            animate={{ 
              rotateZ: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>
        <div className="absolute -bottom-10 right-1/4 w-32 h-32 parallax-element float opacity-70" data-speed="0.15">
          <img src={leaves} alt="" className="w-full h-full object-contain" />
        </div>
        
        {/* Main Hero Content */}
        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-12 z-10">
          {/* Left Column - Text Content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="space-y-6 max-w-xl">
              <motion.span 
                className="inline-block text-[#5B8C3E] font-medium text-sm md:text-base uppercase tracking-wider mb-2 border-l-4 border-[#7BAD50] pl-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                Organic Products
              </motion.span>
              
              <motion.h1 
                className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B5323] via-[#5B8C3E] to-[#7BAD50] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.span 
                  className="inline-block"
                  animate={{ 
                    opacity: [0, 1],
                    y: [20, 0],
                  }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  Best 
                </motion.span>{" "}
                <motion.span 
                  className="text-gradient inline-block"
                  animate={{ 
                    opacity: [0, 1],
                    y: [20, 0],
                  }}
                  transition={{ duration: 0.7, delay: 0.45 }}
                >
                  Quality 
                </motion.span>{" "}
                <motion.span 
                  className="inline-block"
                  animate={{ 
                    opacity: [0, 1],
                    y: [20, 0],
                  }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  Products
                </motion.span>
              </motion.h1>
              
              <motion.h2
                className="font-playfair text-2xl md:text-3xl font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-gradient">Join The Organic Movement!</span>
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 text-base md:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, 
                luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </motion.p>
              
              <motion.div
                className="flex gap-4 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link 
                  to="/shop" 
                  className="stripe-btn bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-medium py-3 px-6 rounded-md transition duration-300 inline-flex items-center gap-2 shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50 hover:-translate-y-1"
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <motion.div 
                  className="animated-line text-[#5B8C3E] font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              type: "spring",
              stiffness: 50 
            }}
          >
            <div className="relative z-10">
              {/* Animated motion for the hero image */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-12, 12, -12] }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: [0.33, 1, 0.68, 1]  // CSS cubic-bezier easing
                }}
              >
                <motion.img 
                  src={heroImage} 
                  alt="Organic Products" 
                  className="w-full h-auto object-contain max-w-xl mx-auto filter drop-shadow-xl" 
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                />
              </motion.div>

              {/* Floating badges removed */}
            </div>
          </motion.div>
        </div>
        
        {/* Features Bar */}
        <motion.div 
          className="w-full bg-white py-8 shadow-md rounded-t-3xl mt-8 relative z-10 backdrop-blur-lg bg-white/80"
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Free Shipping */}
              <motion.div 
                className="flex items-center gap-3 justify-center md:justify-start group"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-full group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5B8C3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#5B8C3E] transition-colors duration-300">Free Shipping</h3>
                  <p className="text-xs text-gray-500">Above $5 Only</p>
                </div>
              </motion.div>
              
              {/* Certified Organic */}
              <motion.div 
                className="flex items-center gap-3 justify-center md:justify-start group"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-full group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5B8C3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#5B8C3E] transition-colors duration-300">Certified Organic</h3>
                  <p className="text-xs text-gray-500">100% Guarantee</p>
                </div>
              </motion.div>
              
              {/* Huge Savings */}
              <motion.div 
                className="flex items-center gap-3 justify-center md:justify-start group"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-full group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5B8C3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#5B8C3E] transition-colors duration-300">Huge Savings</h3>
                  <p className="text-xs text-gray-500">At Lowest Price</p>
                </div>
              </motion.div>
              
              {/* Easy Returns */}
              <motion.div 
                className="flex items-center gap-3 justify-center md:justify-start group"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-full group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5B8C3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#5B8C3E] transition-colors duration-300">Easy Returns</h3>
                  <p className="text-xs text-gray-500">No Questions Asked</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Placeholder for other sections - we'll implement these later */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Best Selling Products</h2>
          <p>We'll implement this section next</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 