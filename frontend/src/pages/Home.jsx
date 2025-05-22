import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import BestSellingProducts from '../components/home/BestSellingProducts';
import CategoryFeatures from '../components/home/CategoryFeatures';
import PromoBanner from '../components/home/PromoBanner';
import DealOfTheDay from '../components/home/DealOfTheDay';
import FeaturedBrands from '../components/home/FeaturedBrands';

// Import hero images
import heroImage from '../assets/images/hero-section/organic-products-hero.png';
import basilLeaf from '../assets/images/hero-section/basil-leaf.png';
import logoLeaf from '../assets/images/hero-section/logo-leaf-new.png';
import logoLeaf2 from '../assets/images/hero-section/logo-leaf2-free-img.png';
import leaves from '../assets/images/hero-section/leaves-free-img.png';

// Feature data for the rotating feature cards
const featureData = [
  // Shipping features
  [
    { icon: "shipping-box", title: "Free Shipping", subtitle: "On orders above ₹500" },
    { icon: "shipping-fast", title: "Express Delivery", subtitle: "Same day in metro cities" },
    { icon: "shipping-international", title: "International", subtitle: "Delivery to 20+ countries" }
  ],
  // Quality features
  [
    { icon: "check-circle", title: "100% Natural", subtitle: "Farm Verified" },
    { icon: "organic", title: "Organic Certified", subtitle: "FSSAI Approved" },
    { icon: "award", title: "Premium Quality", subtitle: "Lab Tested" }
  ],
  // Savings features
  [
    { icon: "money", title: "Huge Savings", subtitle: "At Lowest Price" },
    { icon: "discount", title: "Member Discounts", subtitle: "Save up to 25%" },
    { icon: "gift", title: "Loyalty Rewards", subtitle: "Points on every order" }
  ],
  // Service features
  [
    { icon: "return", title: "Easy Returns", subtitle: "No Questions Asked" },
    { icon: "support", title: "24/7 Support", subtitle: "Call or WhatsApp" },
    { icon: "shield", title: "Secure Payment", subtitle: "Multiple options" }
  ]
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  // Word animation state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const rotatingWords = [
    "Harvest", 
    "Bounty", 
    "Essence", 
    "Goodness", 
    "Treasures", 
    "Abundance"
  ];

  // Feature animation state
  const [featureIndex, setFeatureIndex] = useState(0); // Single index for all cards
  
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
    
    // Word rotation interval
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => 
        prevIndex === rotatingWords.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Feature rotation interval - single interval for all cards to flip together
    const featureInterval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % featureData[0].length);
    }, 5000); // 5 seconds between flips
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(wordInterval);
      clearInterval(featureInterval);
    };
  }, []);

  // Icon components for features
  const renderFeatureIcon = (iconName) => {
    switch (iconName) {
      case "shipping-box":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case "shipping-fast":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "shipping-international":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "check-circle":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "organic":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
          </svg>
        );
      case "award":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case "money":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "discount":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case "gift":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case "return":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
        );
      case "support":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case "shield":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };
  
  // Animation variants for feature cards
  const featureCardVariants = {
    initial: { 
      opacity: 0,
      y: 15,
      rotateX: -15
    },
    animate: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -15,
      rotateX: 15,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
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
                From Farm to Table
              </motion.span>
              
              <motion.h1 
                className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-gray-900">Nature's Pure</span>{" "}
                <span className="relative inline-block w-auto">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={rotatingWords[currentWordIndex]}
                      className="absolute text-transparent bg-clip-text bg-gradient-to-r from-[#3B5323] via-[#5B8C3E] to-[#7BAD50]"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {rotatingWords[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="opacity-0">
                    {rotatingWords[0]} {/* Placeholder to maintain spacing */}
                  </span>
                </span>
              </motion.h1>
              
              <motion.h2
                className="font-playfair text-2xl md:text-3xl font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-gradient">Pure, Fresh & Authentic</span>
              </motion.h2>
        
              <motion.p 
                className="text-gray-600 text-base md:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Traditional farming methods that preserve natural flavors and nutrients. 
                We believe in sustainable practices that respect both people and planet.
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
                <Link 
                  to="/about" 
                  className="text-[#5B8C3E] hover:text-[#3B5323] font-medium transition duration-300"
                >
                  Learn More
                </Link>
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
            </div>
          </motion.div>
        </div>
          
        {/* Features Bar with Digital Clock Animation */}
        <motion.div 
          className="w-full bg-[#111111] py-6 sm:py-8 lg:py-10 mt-8 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Animated Feature Cards */}
              {[0, 1, 2, 3].map((cardIndex) => (
                <div 
                  key={cardIndex} 
                  className="bg-[#222222] rounded-lg p-4 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-4 overflow-hidden perspective-500"
                >
                  <div className="text-[#8bc34a] text-2xl sm:text-3xl flex-shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`icon-${cardIndex}-${featureIndex}`}
                        variants={featureCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {renderFeatureIcon(featureData[cardIndex][featureIndex].icon)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`content-${cardIndex}-${featureIndex}`}
                        variants={featureCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="h-16" // Fixed height to prevent layout shifts
                      >
                        <h3 className="font-semibold text-white text-base sm:text-lg">
                          {featureData[cardIndex][featureIndex].title}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          {featureData[cardIndex][featureIndex].subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Brands Section */}
      <FeaturedBrands />

      {/* Best Selling Products Section */}
      <section className="py-16 bg-white">
        <BestSellingProducts />
      </section>

      {/* Categories Feature Section */}
      <section className="py-16 bg-[#f8f6f3]">
        <CategoryFeatures />
      </section>
        
      {/* Promotional Banner Section */}
      <PromoBanner />

      {/* Deal of the Day Section */}
      <DealOfTheDay />

      {/* Placeholder for other sections - we'll implement these later */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Example Placeholder Section</h2>
          <p>More content will go here.</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 