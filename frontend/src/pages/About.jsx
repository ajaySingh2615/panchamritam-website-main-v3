import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import leafImage from '../assets/images/leaf-2.png';
import leaf1Image from '../assets/images/leaf1.png';
// You'll need to add these images to your assets folder
import freshFruitsImg from '../assets/images/fresh-fruits.png';
import dryFruitsImg from '../assets/images/dry-fruits.png';
import freshVegetablesImg from '../assets/images/fresh-vegetables.png';
import driedVegetablesImg from '../assets/images/dried-vegetables.png';
import beautyProductsImg from '../assets/images/beauty-products.png';
import milkProductsImg from '../assets/images/milk-products.png';
import organicHoneyImg from '../assets/images/organic-honey.png';
import organicTeaImg from '../assets/images/organic-tea.png';
import testimonialImg from '../assets/images/testimonial-person.png';
import aboutImage from '../assets/images/about-image.png';
import aboutImage2 from '../assets/images/about-image-2.png';
import certifiedBadge from '../assets/images/certified-badge.png';

// Testimonial Card Component
const TestimonialCard = ({ visible, delay, image, name, title, content, highlight }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, y: 60 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ 
        duration: 0.7, 
        delay: delay,
        type: "spring",
        stiffness: 50
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
    >
      {/* Card with glass morphism effect */}
      <div className="bg-white/70 backdrop-blur-md shadow-xl border border-white/40 relative rounded-2xl overflow-hidden p-6 md:p-8">
        {/* Dynamic gradient accent */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B8C3E] via-[#7BAD50] to-[#AECB95]"
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.4 }}
        />
        
        {/* Glowing highlight on hover */}
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#5B8C3E]/10 via-[#7BAD50]/5 to-[#AECB95]/10 z-0"
          transition={{ duration: 0.3 }}
        />
        
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          {/* User image with parallax effect and floating badge */}
          <motion.div 
            className="flex-shrink-0 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* Image container with subtle interaction */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              
              {/* Success badge */}
              <motion.div
                className="absolute -right-4 -bottom-2 bg-[#5B8C3E] text-white text-xs font-bold py-1 px-2 rounded-md shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: delay + 0.7,
                  type: "spring" 
                }}
              >
                {highlight}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Content with animated reveal */}
          <div className="flex-1">
            {/* Testimonial text with animated line reveal */}
            <div className="mb-4 overflow-hidden relative">
              <motion.p
                className="text-[#1F2937] italic relative"
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
              >
                "{content}"
              </motion.p>
              
              {/* Animated underline that follows reading */}
              <motion.div
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#5B8C3E]/40 to-transparent"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            {/* Author info with staggered animation */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
            >
              <h4 className="font-semibold text-[#1F2937]">{name}</h4>
              <span className="mx-2 text-gray-300">•</span>
              <p className="text-[#5B8C3E] text-sm">{title}</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Simple hover effect - just a subtle glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#5B8C3E]/10 to-[#7BAD50]/10 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Custom hooks for scroll animations
const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px'
    });
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin]);
  
  return [ref, isVisible];
};

// Parallax scroll effect hook
const useParallaxScroll = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const { top } = ref.current.getBoundingClientRect();
      const scrollOffset = window.scrollY;
      const elementPositionRelativeToViewport = top + scrollOffset;
      const scrollPosition = scrollOffset;
      const relativeScroll = scrollPosition - elementPositionRelativeToViewport;
      
      setOffset(relativeScroll * speed);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return [ref, offset];
};

// Counter animation hook
const useCounter = (end, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!shouldAnimate) return;
    
    let startTimestamp = null;
    let animationFrameId = null;
    
    const startAnimation = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(startAnimation);
      }
    };
    
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(startAnimation);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, delay, shouldAnimate]);
  
  return [countRef, count];
};

const About = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Animation refs
  const [heroLeafRef, leafOffset] = useParallaxScroll(0.1);
  const [sectionLeafRef, sectionLeafOffset] = useParallaxScroll(0.15);
  
  // Scroll animation refs
  const [heroSectionRef, heroSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [aboutSectionRef, aboutSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [statsSectionRef, statsSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [testimonialSectionRef, testimonialSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [certifiedSectionRef, certifiedSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [categoriesSectionRef, categoriesSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [ctaSectionRef, ctaSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Counters
  const [productCountRef, productCount] = useCounter(5000, 2500);
  const [brandCountRef, brandCount] = useCounter(800, 2500, 500);
  const [categoryCountRef, categoryCount] = useCounter(40, 2500, 1000);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    setLoaded(true);
  }, []);

  // Add animation and styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Animation classes */
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      
      .animate-blob {
        animation: blob 7s infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      
      /* Enhanced 3D hover */
      .hover-3d {
        transition: all 0.3s ease;
        transform-style: preserve-3d;
        perspective: 1000px;
      }
      
      .hover-3d:hover {
        transform: translateY(-5px) rotateX(2deg) rotateY(2deg);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      }
      
      /* Shine effect */
      .shine-effect {
        position: relative;
        overflow: hidden;
      }
      
      .shine-effect::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -60%;
        width: 20%;
        height: 200%;
        opacity: 0;
        transform: rotate(30deg);
        background: rgba(255, 255, 255, 0.13);
        background: linear-gradient(
          to right, 
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.13) 77%,
          rgba(255, 255, 255, 0.5) 92%,
          rgba(255, 255, 255, 0.0) 100%
        );
      }
      
      .shine-effect:hover::after {
        opacity: 1;
        left: 130%;
        transition: all 0.8s ease;
      }
      
      /* Hover Underline Animation */
      .hover-underline {
        position: relative;
        display: inline-block;
      }
      
      .hover-underline::after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: -2px;
        left: 0;
        background: linear-gradient(to right, #5B8C3E, #7BAD50);
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
      }
      
      .hover-underline:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
      
      /* Magnetic button effect */
      .magnetic-effect {
        transition: transform 0.2s ease;
      }
      
      /* Text shadow effect */
      .text-shadow {
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      /* Gradient text */
      .gradient-text {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      
      /* Text reveal animation */
      .char {
        transform-origin: center bottom;
        display: inline-block;
      }
      
      /* Clip path animations */
      .clip-path-reveal {
        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
        animation: revealDown 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
      }
      
      @keyframes revealDown {
        0% {
          clip-path: polygon(0 0, 100% 0, 100% 0);
        }
        100% {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }
      
      /* Scroll indicator animation */
      @keyframes scrollIndicator {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        75% {
          opacity: 1;
        }
        100% {
          transform: translateY(16px);
          opacity: 0;
        }
      }
      
      .scroll-indicator {
        animation: scrollIndicator 2s ease-in-out infinite;
      }
      
      /* Smooth mask animation */
      .mask-b-t {
        mask-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
      }
      
      /* Floating animation */
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      
      .float {
        animation: float 6s ease-in-out infinite;
      }
      
      .float-delay-1 {
        animation-delay: 1s;
      }
      
      .float-delay-2 {
        animation-delay: 2s;
      }
      
      /* SVG path animation */
      @keyframes drawPath {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      .animate-draw {
        animation: drawPath 2s ease-in-out forwards;
      }
      
      /* Text gradient animation */
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .animated-gradient-text {
        background: linear-gradient(90deg, #5B8C3E, #7BAD50, #AECB95, #7BAD50, #5B8C3E);
        background-size: 300% 100%;
        animation: gradientShift 8s ease infinite;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      
      /* Particle animation */
      @keyframes particleFloat {
        0% {
          transform: translateY(0) translateX(0) rotate(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) translateX(var(--translate-x, 20px)) rotate(var(--rotate, 180deg));
          opacity: 0;
        }
      }
      
      .particle {
        position: absolute;
        animation: particleFloat var(--duration, 15s) ease-in infinite;
        opacity: var(--opacity, 0.6);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Motion Design Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between">
        {/* Background with animated elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#f8f6f3]"></div>
          
          {/* Animated gradient circles */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#5B8C3E]/10 to-[#7BAD50]/5"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            style={{ filter: 'blur(60px)' }}
          />
          
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-[#f8f6f3]/80 to-[#EDF5E5]/50"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -60, 0],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            style={{ filter: 'blur(50px)' }}
          />

          {/* Decorative image elements */}
          <motion.div
            className="absolute -top-[10%] right-[5%] w-[25vw] max-w-lg opacity-10 z-0" 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src={leaf1Image} 
              alt="" 
              className="w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[18vw] max-w-xs opacity-10 z-0" 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -5, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          >
            <img 
              src={leafImage} 
              alt="" 
              className="w-full h-auto"
            />
          </motion.div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 z-0 opacity-60">
            {[...Array(12)].map((_, index) => (
              <motion.div
                key={`particle-${index}`}
                className="particle absolute rounded-full"
                style={{
                  '--duration': `${Math.random() * 10 + 10}s`,
                  '--translate-x': `${Math.random() * 100 - 50}px`,
                  '--rotate': `${Math.random() * 360}deg`,
                  '--opacity': Math.random() * 0.5 + 0.1,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  bottom: `${Math.random() * 20}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: index % 3 === 0 ? '#5B8C3E' : index % 3 === 1 ? '#7BAD50' : '#AECB95',
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ 
                  y: [-20, -100, -180],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
        </div>

          {/* Animated svg design elements */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Decorative accent lines */}
            <motion.path
              d="M0,50 Q25,30 50,50 T100,50"
              fill="none"
              stroke="#5B8C3E"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            <motion.path
              d="M0,60 Q30,80 60,60 T100,60"
              fill="none"
              stroke="#7BAD50"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            
            <motion.path
              d="M0,40 Q40,20 70,40 T100,40"
              fill="none"
              stroke="#AECB95"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.1 }}
              transition={{ duration: 2, delay: 1.1 }}
            />
          </svg>
        </div>
        
        {/* Navigation */}
        <motion.div 
          className="relative z-10 pt-16 px-6 md:pt-20 lg:pt-24"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <nav className="flex justify-between items-center">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="text-[#5B8C3E] hover:text-[#3B5323] text-sm font-medium transition-colors hover-underline">
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-[#6B7280] md:ml-2">About Us</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </motion.div>
        
        {/* Hero content with enhanced motion animations */}
        <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 py-16 md:px-8 md:py-20 lg:py-24 text-center transition-all duration-1000">
          <div className="max-w-4xl mx-auto">
            {/* Animated accent circle pattern */}
            <motion.div
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <svg width="200" height="200" viewBox="0 0 200 200">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="#5B8C3E"
                  strokeWidth="0.5"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#7BAD50"
                  strokeWidth="0.3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 0.7, pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.7 }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#AECB95"
                  strokeWidth="0.2"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 0.4, pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.9 }}
                />
              </svg>
            </motion.div>
            
            <motion.div
              className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 z-0 opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <svg width="160" height="160" viewBox="0 0 160 160">
                <motion.circle
                  cx="80"
                  cy="80"
                  r="40"
                  fill="none"
                  stroke="#AECB95"
                  strokeWidth="0.3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.1 }}
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#5B8C3E"
                  strokeWidth="0.2"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 0.7, pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.3 }}
                />
              </svg>
            </motion.div>
            
            {/* Animated subtitle */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
              className="inline-block mb-6 md:mb-8 relative z-10"
            >
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-[#5B8C3E]/10 to-[#7BAD50]/10 text-[#5B8C3E] text-sm md:text-base font-medium border border-[#5B8C3E]/20 relative overflow-hidden group">
                <span className="relative z-10">Our Story</span>
                <motion.div 
                  className="absolute inset-0 bg-[#5B8C3E]/5"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                />
              </div>
            </motion.div>
            
            {/* Animated main heading with staggered character animations */}
            <div className="overflow-hidden mb-10 md:mb-14 relative">
              <motion.div
                className="absolute -left-4 md:-left-8 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-[#5B8C3E] to-transparent z-0 opacity-60"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 64, opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              
              <motion.div
                className="absolute -right-4 md:-right-8 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-[#5B8C3E] to-transparent z-0 opacity-60"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 64, opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1F2937] leading-tight relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ y: 0 }}
                  className="overflow-hidden"
                >
                  <motion.span
                    className="block mb-3"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    {"We Are Your".split("").map((char, index) => (
                      <motion.span
                        key={`title-1-${index}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.4 + index * 0.04,
                          ease: "easeOut"
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.span>
                </motion.div>
                
                <motion.div
                  initial={{ y: 0 }}
                  className="overflow-hidden"
                >
                  <motion.span
                    className="block animated-gradient-text"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    {"Favourite Store".split("").map((char, index) => (
                      <motion.span
                        key={`title-2-${index}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.9 + index * 0.04,
                          ease: "easeOut"
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.span>
                </motion.div>
              </motion.h1>
              
              {/* Animated underline */}
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] mx-auto mt-5 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 1, delay: 1.8 }}
              >
                <motion.div
                  className="w-full h-full bg-white"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 2,
                    delay: 2.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              </motion.div>
            </div>
            
            {/* Animated paragraph with floating highlight effect */}
            <div className="max-w-2xl mx-auto mb-14 md:mb-16 relative">
              <motion.div
                className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#5B8C3E]/30"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#5B8C3E]/30"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
              
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-[#4B5563] leading-relaxed relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                At <span className="text-[#5B8C3E] font-medium">Panchamritam</span>, we bring nature's best organic products directly to your doorstep, ensuring quality, sustainability, and health in every delivery.
              </motion.p>
              
              {/* Animated highlight */}
              <motion.div
                className="absolute inset-0 bg-[#5B8C3E]/5 rounded-xl z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>
            
            {/* Animated CTA buttons with enhanced effects */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 mb-16 md:mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.a 
                href="#our-mission" 
                className="inline-flex items-center justify-center bg-[#5B8C3E] text-white font-medium py-4 px-10 rounded-md transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none transform hover:-translate-y-1 active:translate-y-0 text-base md:text-lg relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Our Mission</span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30 z-0"
                  initial={{ width: 0 }}
                  whileHover={{ 
                    width: '100%',
                    transition: { duration: 0.3 }
                  }}
                />
                <motion.div 
                  className="absolute inset-0 bg-white/20 z-0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.7 }}
                />
              </motion.a>
              
              <motion.a 
                href="#categories" 
                className="inline-flex items-center justify-center bg-white border border-[#5B8C3E] text-[#5B8C3E] font-medium py-4 px-10 rounded-md transition-all duration-300 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 text-base md:text-lg hover:bg-[#5B8C3E] hover:text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Our Products
              </motion.a>
            </motion.div>
            

          </div>
        </div>
        

      </div>

      {/* About Section */}
      <div id="our-mission" ref={aboutSectionRef} className="py-20 bg-white relative overflow-hidden">
        {/* Decorative blob gradients in background */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#5B8C3E]/5 to-[#7BAD50]/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-[#EDF5E5] to-[#AECB95]/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* Decorative leaf with parallax */}
        <div 
          ref={sectionLeafRef}
          className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none z-0 opacity-20"
          style={{ transform: `rotate(-45deg) translateY(${sectionLeafOffset * 0.3}px)` }}
        >
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-3d">
                <img 
                  src={aboutImage2} 
                  alt="Our organic farm" 
                  className="w-full h-auto object-cover aspect-square transition-transform duration-1000 hover:scale-105"
                />
                
                {/* Stats overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1F2937]/90 to-transparent p-6 text-white">
                  <p className="text-2xl font-bold serif-heading">10+ Years</p>
                  <p className="text-sm sans-text">of organic farming excellence</p>
                </div>
              </div>
              
              {/* Floating badge */}
              <motion.div 
                className="absolute -right-8 -top-8 w-32 h-32 bg-white shadow-xl rounded-full flex items-center justify-center p-4"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                <div className="text-center">
                  <span className="block text-[#5B8C3E] text-lg font-bold serif-heading">100%</span>
                  <span className="block text-[#6B7280] text-xs sans-text">Organic</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={aboutSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Decorative accent elements */}
              <motion.div 
                className="absolute -left-12 top-20 w-8 h-8 rounded-full border border-[#5B8C3E]/30 z-0 hidden md:block"
                initial={{ scale: 0, opacity: 0 }}
                animate={aboutSectionVisible ? 
                  { scale: [0, 1.2, 1], opacity: 1, x: [0, -20, 0], rotate: [0, 45, 0] } : 
                  { scale: 0, opacity: 0 }
                }
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              
              <motion.div 
                className="absolute right-0 bottom-20 w-20 h-20 rounded-full border-2 border-[#5B8C3E]/10 z-0 hidden md:block"
                initial={{ scale: 0, opacity: 0 }}
                animate={aboutSectionVisible ? 
                  { scale: 1, opacity: 0.5 } : 
                  { scale: 0, opacity: 0 }
                }
                transition={{ duration: 1, delay: 0.8 }}
              />
              
              <motion.div 
                className="absolute -right-8 top-10 w-4 h-4 rounded-full bg-[#5B8C3E]/20 z-0 hidden md:block"
                animate={aboutSectionVisible ? 
                  { y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] } : 
                  { opacity: 0 }
                }
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: 1
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative z-10"
              >
                <div className="block px-3 py-1 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-xs font-semibold mb-4 shadow-sm w-fit shine-effect">
                  Our Mission
                </div>
              </motion.div>
              
              <div className="relative">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 serif-heading relative z-10"
                  initial={{ opacity: 0 }}
                  animate={aboutSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.span 
                    className="block"
                    initial={{ y: 50, opacity: 0 }}
                    animate={aboutSectionVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                  >
                    Bringing Nature's Best
                  </motion.span>
                  <motion.span 
                    className="block"
                    initial={{ y: 50, opacity: 0 }}
                    animate={aboutSectionVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                  >
                    To Your Doorstep
                  </motion.span>
                </motion.h2>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10">
                <motion.p 
                  className="text-[#6B7280] sans-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  At Panchamritam, our mission is to provide healthier lives for all by delivering pure, organic products that strengthen immunity and prevent diseases. We believe that nature has given us everything we need to maintain optimal health, and our role is to bring these gifts directly to you.
                </motion.p>
                <motion.p 
                  className="text-[#6B7280] sans-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  Every product in our collection is carefully selected to support your wellbeing. By choosing organic, you're not just enjoying superior taste and nutrition—you're making a conscious decision to protect your body from harmful chemicals and preservatives that can lead to chronic health issues over time.
                </motion.p>
              </div>
              
              {/* Feature list */}
              <div className="space-y-4">
                {[
                  { icon: "🌱", title: "Disease Prevention", desc: "Natural immunity boosters" },
                  { icon: "🍃", title: "Chemical-Free", desc: "Pure products for better health" },
                  { icon: "♻️", title: "Holistic Wellness", desc: "Supporting complete wellbeing" }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    className="flex items-start group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 + (i * 0.2) }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <motion.div 
                        className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                        whileHover={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-[#1F2937] serif-heading hover-underline">{feature.title}</h4>
                      <p className="mt-1 text-sm text-[#6B7280] sans-text">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Enhanced with Innovative Motion Design */}
      <div ref={statsSectionRef} id="stats" className="py-24 bg-[#f8f6f3] relative overflow-hidden">
        {/* Interactive background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M0,25 Q25,50 50,25 T100,25"
              stroke="#5B8C3E"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={statsSectionVisible ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2, delay: 0.3 }}
            />
            <motion.path
              d="M0,50 Q25,75 50,50 T100,50"
              stroke="#7BAD50"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={statsSectionVisible ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2, delay: 0.6 }}
            />
            <motion.path
              d="M0,75 Q25,100 50,75 T100,75"
              stroke="#AECB95"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={statsSectionVisible ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2, delay: 0.9 }}
            />
          </svg>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`stat-particle-${i}`}
              className="absolute rounded-full bg-[#5B8C3E]"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.15 + 0.05,
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.1, 0.2, 0],
                scale: [1, Math.random() * 0.5 + 0.5]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Decorative leaf with 3D rotation */}
        <motion.div 
          className="absolute top-0 left-0 w-40 h-40 pointer-events-none z-0 opacity-15 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotateX: [0, 10, 0, 10, 0],
            rotateY: [0, 15, 0, -15, 0],
            rotateZ: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg transform rotate-45"
          />
        </motion.div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            {/* Animated heading with reveal effect */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={statsSectionVisible ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto overflow-hidden mb-6"
            >
              <motion.span 
                className="block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md mb-4 mx-auto w-fit whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsSectionVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Our Impact on Health
              </motion.span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h2 
                className="text-4xl font-bold text-[#1F2937] mb-6 serif-heading"
                initial={{ y: 100, opacity: 0 }}
                animate={statsSectionVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 50 }}
              >
                <span className="inline-block">Making </span>
                <span className="inline-block bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] bg-clip-text text-transparent px-2">
                  Healthy Lives
                </span>
                <span className="inline-block"> Possible</span>
              </motion.h2>
            </div>
            
            <motion.p
              className="max-w-2xl mx-auto text-[#6B7280] text-lg"
              initial={{ opacity: 0 }}
              animate={statsSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Our mission to promote health through organic products has made a significant impact. Here's what we've achieved together.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 - Enhanced with interactive hover */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(91, 140, 62, 0.25)"
              }}
            >
              {/* 3D rotating top accent */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] z-10"
                whileHover={{ scaleX: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Background glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#5B8C3E]/5 to-transparent rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* 3D layered card contents */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Immunity Boosters</h3>
                
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={statsSectionVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                    <div className="flex items-center">
                      <span ref={productCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading relative z-10">
                        {productCount}
                      </span>
                      <span className="text-2xl font-bold text-[#5B8C3E] relative z-10">+</span>
                    </div>
                    
                    {/* Animated highlight ring */}
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-[#5B8C3E]/5"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                
                <p className="text-sm text-[#6B7280] sans-text">immunity-enhancing products</p>
              </motion.div>
              
              {/* Interactive reveal on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#5B8C3E]/90 to-[#7BAD50]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ clipPath: "circle(0% at 50% 50%)" }}
                whileHover={{ 
                  clipPath: "circle(100% at 50% 50%)",
                  transition: { duration: 0.6, ease: "easeOut" }
                }}
              >
                <p className="text-white text-lg font-medium">
                  Supporting your natural defenses daily
                </p>
              </motion.div>
            </motion.div>
            
            {/* Stat Card 2 - Enhanced with interactive hover */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(91, 140, 62, 0.25)"
              }}
            >
              {/* 3D rotating top accent */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#7BAD50] to-[#AECB95] z-10"
                whileHover={{ scaleX: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Background glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#7BAD50]/5 to-transparent rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* 3D layered card contents */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Healthy Partnerships</h3>
                
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={statsSectionVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                    <div className="flex items-center">
                      <span ref={brandCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading relative z-10">
                        {brandCount}
                      </span>
                      <span className="text-2xl font-bold text-[#7BAD50] relative z-10">+</span>
                    </div>
                    
                    {/* Animated highlight ring */}
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-[#7BAD50]/5"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>
                </div>
                
                <p className="text-sm text-[#6B7280] sans-text">wellness-focused brands</p>
              </motion.div>
              
              {/* Interactive reveal on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#7BAD50]/90 to-[#AECB95]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ clipPath: "circle(0% at 50% 50%)" }}
                whileHover={{ 
                  clipPath: "circle(100% at 50% 50%)",
                  transition: { duration: 0.6, ease: "easeOut" }
                }}
              >
                <p className="text-white text-lg font-medium">
                  Partnering for healthier communities
                </p>
              </motion.div>
            </motion.div>
            
            {/* Stat Card 3 - Enhanced with interactive hover */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(91, 140, 62, 0.25)"
              }}
            >
              {/* 3D rotating top accent */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#AECB95] to-[#EDF5E5] z-10"
                whileHover={{ scaleX: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Background glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#AECB95]/5 to-transparent rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* 3D layered card contents */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Wellness Categories</h3>
                
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={statsSectionVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                    <div className="flex items-center">
                      <span ref={categoryCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading relative z-10">
                        {categoryCount}
                      </span>
                      <span className="text-2xl font-bold text-[#AECB95] relative z-10">+</span>
          </div>
                    
                    {/* Animated highlight ring */}
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-[#AECB95]/5"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                  </motion.div>
        </div>

                <p className="text-sm text-[#6B7280] sans-text">disease-prevention categories</p>
              </motion.div>
              
              {/* Interactive reveal on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#AECB95]/90 to-[#EDF5E5]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ clipPath: "circle(0% at 50% 50%)" }}
                whileHover={{ 
                  clipPath: "circle(100% at 50% 50%)",
                  transition: { duration: 0.6, ease: "easeOut" }
                }}
              >
                <p className="text-white text-lg font-medium">
                  Comprehensive health solutions
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

            {/* Testimonial Section - Innovative Magnetic Split Design */}
      <div ref={testimonialSectionRef} className="py-24 relative overflow-hidden">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f9fbf7] to-white"></div>
        
        {/* Floating organic elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Organic shapes with parallax effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`organic-shape-${i}`}
              className="absolute rounded-full mix-blend-multiply"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? '#5B8C3E10' : '#AECB9510',
                filter: 'blur(60px)',
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
                scale: [1, Math.random() * 0.2 + 0.9, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
              </div>
        
        {/* Main content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Split design layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left side - Staggered title reveal with magnetic hover */}
            <motion.div 
              className="relative pb-16 lg:pb-0 z-20"
              initial={{ opacity: 0 }}
              animate={testimonialSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="lg:sticky lg:top-1/3 px-4 lg:pr-16">
                {/* Accent pill */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={testimonialSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.7 }}
                  className="inline-block mb-4"
                >
                  <div className="bg-[#5B8C3E]/10 text-[#5B8C3E] text-sm font-medium py-1 px-4 rounded-full border border-[#5B8C3E]/20 backdrop-blur-sm">
                    Transformational Stories
                  </div>
                </motion.div>
                
                {/* Magnetic heading with each word animated separately */}
                <div className="mb-8">
                  {/* Staggered word animation */}
                  <motion.h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] tracking-tight leading-tight"
                    initial={{ opacity: 0 }}
                    animate={testimonialSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {["Health", "Stories", "From", "Real", "People"].map((word, index) => (
                      <motion.span
                        key={index}
                        className="inline-block mr-4 relative"
                        initial={{ y: 80, opacity: 0 }}
                        animate={testimonialSectionVisible ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
                        transition={{ 
                          duration: 0.7,
                          delay: 0.1 + (index * 0.1),
                          type: "spring",
                          stiffness: 50
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          color: "#5B8C3E",
                          transition: { duration: 0.2 }
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h2>
          </div>
                
                {/* Description with sliding reveal */}
                <motion.div
                  className="relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={testimonialSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <motion.p 
                    className="text-lg text-[#4B5563] pr-4 max-w-md"
                    initial={{ y: 40 }}
                    animate={testimonialSectionVisible ? { y: 0 } : { y: 40 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    Our organic products have helped countless people transform their health and wellness. Hear their inspiring journeys of recovery and vitality.
                  </motion.p>
                </motion.div>
                
                {/* Scroll indicator */}
                <motion.div
                  className="hidden lg:flex items-center mt-8 text-[#5B8C3E]"
                  initial={{ opacity: 0 }}
                  animate={testimonialSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <motion.div 
                    className="w-10 h-px bg-[#5B8C3E]"
                    animate={{ scaleX: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="ml-2 text-sm font-medium">Explore stories</span>
                </motion.div>
        </div>
            </motion.div>
            
                          {/* Right side - Auto-scrolling testimonial carousel */}
            <div className="relative z-10">
              {/* Auto-scrolling container with overflow */}
              <div className="relative h-[75vh] overflow-hidden">
                {/* Auto-scrolling carousel */}
                <motion.div 
                  className="space-y-6 md:space-y-8 py-6 pr-4"
                  initial={{ y: 0 }}
                  animate={{ 
                    y: [0, -1000, 0],
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    times: [0, 0.9, 1]
                  }}
                >
                  {/* First testimonial */}
                  <TestimonialCard 
                    visible={testimonialSectionVisible}
                    delay={0.3}
                    image={testimonialImg}
                    name="Mila Kunit"
                    title="Recovered from digestive issues"
                    content="After struggling with digestive issues for years, switching to Panchamritam's organic products completely transformed my health. Their chemical-free products helped restore my gut health, and now I have more energy than ever before!"
                    highlight="100% Improvement"
                  />
                  
                  {/* Second testimonial */}
                  <TestimonialCard 
                    visible={testimonialSectionVisible}
                    delay={0.4}
                    image={testimonialImg}
                    name="Rajesh Kumar"
                    title="Managed blood pressure naturally"
                    content="I was looking for natural alternatives to manage my blood pressure. After incorporating Panchamritam's organic foods into my diet, my readings have stabilized, and my doctor is amazed at my progress without additional medication."
                    highlight="Natural Solution"
                  />
                  
                  {/* Third testimonial */}
                  <TestimonialCard 
                    visible={testimonialSectionVisible}
                    delay={0.5}
                    image={testimonialImg}
                    name="Sarah Williams"
                    title="Stronger immune system"
                    content="My family and I used to catch every cold and flu that came around. Since making the switch to Panchamritam's organic products, we've noticed a significant improvement in our immune health. We rarely get sick now!"
                    highlight="Family Health"
                  />
                  
                  {/* Fourth testimonial */}
                  <TestimonialCard 
                    visible={testimonialSectionVisible}
                    delay={0.6}
                    image={testimonialImg}
                    name="Priya Sharma"
                    title="Weight management journey"
                    content="I've struggled with weight management for years. Panchamritam's organic products have been a game changer. The natural ingredients have helped me maintain a healthy weight without crash diets. It's been a sustainable lifestyle change."
                    highlight="Sustainable Health"
                  />
                  
                  {/* Fifth testimonial */}
                  <TestimonialCard 
                    visible={testimonialSectionVisible}
                    delay={0.7}
                    image={testimonialImg}
                    name="David Chen"
                    title="Enhanced mental clarity"
                    content="As a busy professional, I need to stay focused. Since incorporating Panchamritam's organic foods into my daily routine, I've experienced noticeably better mental clarity and sustained energy throughout the day."
                    highlight="Mental Focus"
                  />
                </motion.div>
                
                {/* Gradient fade effect at top and bottom */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#f9fbf7] to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f9fbf7] to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certified Products Section - 3D Interactive Showcase */}
      <div ref={certifiedSectionRef} id="certified" className="py-24 bg-gradient-to-b from-[#f8f6f3] to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Organic pattern lines */}
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="certGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B8C3E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7BAD50" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,25 C30,15 70,35 100,25 L100,100 L0,100 Z"
              fill="url(#certGradient)"
              initial={{ y: 100, opacity: 0 }}
              animate={certifiedSectionVisible ? { y: 0, opacity: 0.05 } : { y: 100, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          
          {/* Removing floating certification symbols */}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - 3D Interactive Badge */}
            <div className="flex justify-center">
              <motion.div
                className="relative perspective-1000"
                initial={{ opacity: 0 }}
                animate={certifiedSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Static Container with Rotating Badge */}
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  {/* Main Rotating Certification Badge */}
                  <motion.div
                    className="absolute inset-0 z-10"
                    animate={{ 
                      rotateY: [0, 360],
                    }}
                    transition={{ 
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ 
                      transformStyle: "preserve-3d",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={certifiedBadge}
                      alt="Certified Organic" 
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  {/* Static Certification Icons */}
                  {[...Array(4)].map((_, i) => {
                    // Position badges at the four corners
                    let position = {};
                    
                    // Top-left, top-right, bottom-right, bottom-left
                    if (i === 0) {
                      position = { top: '-10%', left: '-10%' }; // Top-left for USDA
                    } else if (i === 1) {
                      position = { top: '-10%', right: '-10%' }; // Top-right for Non GMO
                    } else if (i === 2) {
                      position = { bottom: '-10%', right: '-10%' }; // Bottom-right for Eco
                    } else if (i === 3) {
                      position = { bottom: '-10%', left: '-10%' }; // Bottom-left for FDA
                    }
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full flex items-center justify-center"
                        style={{ 
                          width: 75, 
                          height: 75,
                          ...position,
                          zIndex: 100,
                          backgroundColor: i === 0 
                            ? '#5B8C3E' 
                            : i === 1 
                            ? '#4A7033' 
                            : i === 2 
                            ? '#6B9D4E' 
                            : '#3B5D26',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div>
                          {i === 0 && (
                            <div className="text-center">
                              <div className="text-white text-lg font-bold">USDA</div>
                              <div className="text-white text-xs">Organic</div>
                            </div>
                          )}
                          
                          {i === 1 && (
                            <div className="text-center">
                              <div className="text-white text-lg font-bold">Non</div>
                              <div className="text-white text-xs">GMO</div>
                            </div>
                          )}
                          
                          {i === 2 && (
                            <div className="text-center">
                              <div className="text-white text-lg font-bold">Eco</div>
                              <div className="text-white text-xs">Certified</div>
                            </div>
                          )}
                          
                          {i === 3 && (
                            <div className="text-center">
                              <div className="text-white text-lg font-bold">FDA</div>
                              <div className="text-white text-xs">Approved</div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Glowing background effect */}
                <motion.div
                  className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#5B8C3E]/20 to-[#7BAD50]/5 filter blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    zIndex: -1,
                  }}
                />
              </motion.div>
            </div>
            
            {/* Right Column - Content with Animated Steps */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={certifiedSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="inline-block mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={certifiedSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-[#5B8C3E]/10 text-[#5B8C3E] text-sm font-medium py-1 px-4 rounded-full">
                    Quality Assured
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={certifiedSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Our Health Standards <br/>
                  <span className="text-[#5B8C3E]">Certification Process</span>
                </motion.h2>
                
                <motion.p
                  className="text-[#4B5563] text-lg mb-8 max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={certifiedSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  At Panchamritam, we ensure every product meets the highest standards of quality and authenticity. Our rigorous certification process guarantees you receive only the purest, healthiest organic products.
                </motion.p>
                
                {/* Certification Steps with Animated Path */}
                <div className="relative">
                  {/* Connecting path line */}
                  <motion.div 
                    className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5B8C3E] to-[#AECB95]"
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={certifiedSectionVisible ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                  />
                  
                  {/* Certification steps with animation */}
                  <div className="space-y-8 relative">
                    {[
                      {
                        title: "Source Verification",
                        desc: "We verify all suppliers meet our strict organic farming standards",
                        icon: "🌱",
                        delay: 0.5
                      },
                      {
                        title: "Lab Testing",
                        desc: "Every batch undergoes thorough testing for purity and nutritional content",
                        icon: "🔬",
                        delay: 0.7
                      },
                      {
                        title: "Certification",
                        desc: "Products are certified by multiple independent organic authorities",
                        icon: "✅",
                        delay: 0.9
                      },
                      {
                        title: "Quality Monitoring",
                        desc: "Continuous monitoring ensures consistent quality standards",
                        icon: "📊",
                        delay: 1.1
                      }
                    ].map((step, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={certifiedSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: step.delay }}
                      >
                        <motion.div 
                          className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mr-4 z-10"
                          whileHover={{ 
                            scale: 1.1,
                            backgroundColor: "#5B8C3E10",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <span className="text-2xl">{step.icon}</span>
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#1F2937] mb-1">{step.title}</h3>
                          <p className="text-[#6B7280]">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Learn more button */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={certifiedSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                >
                  <motion.button
                    className="inline-flex items-center px-6 py-3 bg-[#5B8C3E] text-white rounded-md font-medium text-base shadow-md hover:bg-[#4a7033] transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Learn More About Our Standards</span>
                    <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories Section - Organic Polaroid Gallery */}
      <div ref={categoriesSectionRef} id="categories" className="py-24 bg-[#f8f8f5] relative overflow-hidden">
        {/* Natural texture background */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOGY1Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVCOEMzRSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVCOEMzRSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==')]"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              className="block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md mb-4 mx-auto w-fit"
              initial={{ opacity: 0, y: -10 }}
              animate={categoriesSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              Our Products
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-[#1F2937] mb-2 serif-heading"
              initial={{ opacity: 0 }}
              animate={categoriesSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We Deal With Various Quality Organic Products!
            </motion.h2>
            
            <div className="w-24 h-1 bg-[#5B8C3E] mx-auto my-6 rounded-full"></div>
          </div>
          
          {/* Polaroid-style organic gallery */}
          <div className="relative">
            <motion.div 
              className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-16"
              initial={{ opacity: 0 }}
              animate={categoriesSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                { title: "Fresh Fruits", image: freshFruitsImg, rotate: -2 },
                { title: "Dry Fruits", image: dryFruitsImg, rotate: 3 },
                { title: "Fresh Vegetables", image: freshVegetablesImg, rotate: -1 },
                { title: "Dried Vegetables", image: driedVegetablesImg, rotate: 2 },
                { title: "Beauty Products", image: beautyProductsImg, rotate: -3 },
                { title: "Milk Products", image: milkProductsImg, rotate: 1 },
                { title: "Organic Honey", image: organicHoneyImg, rotate: -2 },
                { title: "Organic Tea", image: organicTeaImg, rotate: 2 }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  className="w-[calc(50%-24px)] md:w-[calc(25%-24px)] relative"
                  initial={{ 
                    opacity: 0, 
                    y: 50,
                    rotate: category.rotate,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
                  }}
                  animate={categoriesSectionVisible ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6,
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 50
                    }
                  } : { opacity: 0, y: 50 }}
                  whileHover={{ 
                    y: -15, 
                    rotate: 0,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.12), 0 5px 15px rgba(0,0,0,0.06)",
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Polaroid frame */}
                  <div className="bg-white p-3 pb-12 rounded-sm shadow-md relative">
                    {/* Image container with natural frame effect */}
                    <div className="relative overflow-hidden aspect-square rounded-sm">
                      <motion.img 
                        src={category.image} 
                        alt={category.title} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Natural texture overlay */}
                      <div className="absolute inset-0 shadow-inner pointer-events-none border border-black/5"></div>
                    </div>
                    
                    {/* Handwritten-style caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                      <h3 className="text-[#1F2937] text-lg font-medium" style={{ fontFamily: 'cursive, serif' }}>{category.title}</h3>
                    </div>
                    
                    {/* Tape accent */}
                    <div 
                      className="absolute top-0 w-8 h-4 bg-[#5B8C3E]/20 transform -translate-y-1/2" 
                      style={{ 
                        left: `calc(50% - 16px)`, 
                        clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)' 
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Natural elements */}
          <div className="mt-16 relative">
            <motion.div 
              className="w-32 h-32 absolute -bottom-10 -left-10 opacity-20 z-0 pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={categoriesSectionVisible ? { 
                opacity: 0.2, 
                rotate: 15,
                transition: { duration: 1, delay: 0.8 }
              } : { opacity: 0 }}
            >
              <img src={leaf1Image} alt="" className="w-full h-full object-contain" />
            </motion.div>
            
            <motion.div 
              className="w-24 h-24 absolute -top-10 -right-10 opacity-20 z-0 pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={categoriesSectionVisible ? { 
                opacity: 0.2, 
                rotate: -20,
                transition: { duration: 1, delay: 1 }
              } : { opacity: 0 }}
            >
              <img src={leafImage} alt="" className="w-full h-full object-contain" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaSectionRef} className="py-20 bg-[#f8f6f3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1F2937]/5 mix-blend-multiply"></div>
        
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-[#5B8C3E]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  opacity: Math.random() * 0.15,
                  filter: 'blur(50px)',
                  animation: `blob ${Math.random() * 20 + 10}s infinite linear`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative leaf */}
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none z-0 opacity-15 transform translate-x-1/4 translate-y-1/4">
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg transform rotate-15"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative p-12 border border-white border-opacity-20 text-center hover-3d"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaSectionVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 serif-heading">
              Ready to Experience <span className="bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] bg-clip-text text-transparent">Organic Goodness</span>?
            </h2>
            
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto mb-8 sans-text">
              Browse our selection of premium organic products and start your journey towards healthier living.
            </p>
            
            <motion.a 
              href="/shop" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-medium py-4 px-10 rounded-md transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 shine-effect"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(91, 140, 62, 0.4), 0 10px 10px -5px rgba(91, 140, 62, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">Start Shopping</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ x: [0, 8, 0] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.a>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#5B8C3E]/10 to-transparent rounded-full filter blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-[#7BAD50]/10 to-transparent rounded-full filter blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About; 