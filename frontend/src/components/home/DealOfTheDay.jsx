import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './DealOfTheDay.css'; // We'll create this for minimal custom styles

// Placeholder for a product image - replace with an actual image
import productImagePlaceholder from '../../assets/images/hero-section/deal-of-the-day/broccoli.webp'; // Example, replace

// Countdown Timer Component (Simplified Placeholder)
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) { // Handle cases where time is up
      return;
    }
    timerComponents.push(
      <div key={interval} className="text-center p-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
        <span className="text-2xl md:text-3xl font-bold text-green-600 tabular-nums">
          {String(timeLeft[interval]).padStart(2, '0')}
        </span>
        <span className="block text-xs uppercase text-gray-500">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex space-x-2 md:space-x-3 my-6 justify-center md:justify-start">
      {timerComponents.length ? timerComponents : <span className="text-gray-700 text-lg">Deal Expired!</span>}
    </div>
  );
};


const DealOfTheDay = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Set a target date for the countdown, e.g., end of today
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0); // Midnight tomorrow

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
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

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 50,
        damping: 15
      } 
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="deal-of-the-day-section bg-[#f8f6f3] py-16 md:py-24 overflow-hidden relative"
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {/* Subtle background pattern - using pseudo-element in CSS for more control */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Text Content & Timer */}
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <motion.h3 
              className="text-lg font-semibold text-green-600 uppercase tracking-wider mb-2"
              variants={itemVariants}
            >
              Deal of the Day
            </motion.h3>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4 leading-tight"
              variants={itemVariants}
            >
              15% Off On All <span className="text-green-600">Vegetables!</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-base md:text-lg mb-6"
              variants={itemVariants}
            >
              Fresh, crisp, and naturally grown vegetables now at an unbeatable price. 
              Hurry, offer valid for a limited time only!
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <CountdownTimer targetDate={targetDate.toISOString()} />
            </motion.div>

          </motion.div>

          {/* Right Column: Product Showcase */}
          <motion.div 
            className="relative flex justify-center" 
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              variants={itemVariants}
            >
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img 
                  src={productImagePlaceholder} 
                  alt="Deal Product" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">Fresh Organic Broccoli</h4>
              <p className="text-gray-500 text-sm mb-3">High-quality, locally sourced</p>
              
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-green-600 mr-2">₹85.00</span>
                <span className="text-gray-400 line-through">₹100.00</span>
                <span className="ml-auto bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">15% OFF</span>
              </div>

              <Link 
                to="/shop?category=vegetables" 
                className="w-full stripe-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                Shop Vegetables
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DealOfTheDay; 