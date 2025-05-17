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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Hero Section */}
      <div className={`relative transition-all duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        {/* Premium gradient background with texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6f3] via-[#f1efe9] to-[#e8e4d9] opacity-70"></div>
      
        {/* Decorative monstera leaf with enhanced parallax */}
        <div 
          ref={heroLeafRef} 
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none z-0 overflow-hidden opacity-25 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(25%, -25%) translateY(${leafOffset * 0.5}px) rotate(${scrolled ? '5deg' : '0deg'})` }}
        >
          <img 
            src={leaf1Image} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        
        {/* Content container with premium styling */}
        <div ref={heroSectionRef} className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 transition-all duration-500 ${scrolled ? 'transform -translate-y-4' : ''}`}>
          {/* Breadcrumb navigation with refined styling */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="text-[#5B8C3E] hover:text-[#3B5323] text-sm font-medium transition-colors">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Hero content with premium typography */}
            <div className={`transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-xs font-semibold mb-4 shadow-sm">
                Our Story
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight mb-6 transition-all duration-500 serif-heading">
                We Are Your <span className="relative overflow-hidden group">
                  <span className="inline-block transition-transform duration-300 group-hover:transform group-hover:-translate-y-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] bg-clip-text text-transparent">Favourite Store</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-[#6B7280] mb-8 max-w-xl leading-relaxed sans-text">
                Tuas quisquam quo gravida proident harum, aptent ligula anim consequuntur, ultrices mauris, nunc voluptates lobortis, varius, potenti placeat! Fuga omnis. Cubilia congue. Recusandae. Vero penatibus quasi! Nostra tenetur dignissimos ultrices natus distinctio ultrices consequuntur numqu.
              </p>
              
              <p className="text-base md:text-lg text-[#6B7280] mb-8 max-w-xl leading-relaxed sans-text">
                Officiis fuga harum porro et? Similique rhoncus atque! Netus blanditiis provident nunc posuere. Rem sequi, commodo, lorem tellus elit, hic sem tenetur anim amet quas, malesuada proident platea corrupti expedita.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <motion.a 
                  href="#categories" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-medium py-3 px-8 rounded-md transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 backdrop-filter backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Our Products</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="#certified" 
                  className="inline-flex items-center justify-center bg-white border border-[#E5E7EB] text-[#5B8C3E] hover:bg-[#EDF5E5] font-medium py-3 px-8 rounded-md transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 backdrop-filter backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Certified Organic</span>
                </motion.a>
              </div>
            </div>
            
            {/* Right column - Hero card with glass effect */}
            <motion.div 
              className="relative h-full flex items-center justify-center p-4 transition-all duration-700 transform"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroSectionVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
                <img 
                  src={aboutImage} 
                  alt="Organic farm" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                
                {/* Glass effect overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-6 border-t border-white border-opacity-30">
                  <motion.h2 
                    className="text-xl font-bold text-[#1F2937] mb-2 serif-heading"
                    initial={{ y: 20, opacity: 0 }}
                    animate={heroSectionVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    From Farm to Table
                  </motion.h2>
                  <motion.p 
                    className="text-[#6B7280] sans-text text-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={heroSectionVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    We grow with love and deliver fresh organic products to your doorstep
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div ref={aboutSectionRef} className="py-20 bg-white relative overflow-hidden">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={aboutImage2} 
                  alt="Our organic farm" 
                  className="w-full h-auto object-cover aspect-square"
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
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
            >
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-xs font-semibold mb-4 shadow-sm">
                Our Mission
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 serif-heading">
                Bringing Nature's Best<br />To Your Doorstep
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-[#6B7280] sans-text">
                  Tuas quisquam quo gravida proident harum, aptent ligula anim consequuntur, ultrices mauris, nunc voluptates lobortis, varius, potenti placeat! Fuga omnis. Cubilia congue. Recusandae. Vero penatibus quasi!
                </p>
                <p className="text-[#6B7280] sans-text">
                  Officiis fuga harum porro et? Similique rhoncus atque! Netus blanditiis provident nunc posuere. Rem sequi, commodo, lorem tellus elit, hic sem tenetur anim amet quas.
                </p>
              </div>
              
              {/* Feature list */}
              <div className="space-y-4">
                {[
                  { icon: "🌱", title: "Sustainable Farming", desc: "We use eco-friendly methods" },
                  { icon: "🍃", title: "Chemical-Free", desc: "No pesticides or harmful additives" },
                  { icon: "♻️", title: "Eco Packaging", desc: "Recyclable and biodegradable" }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    className="flex items-start group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-[#1F2937] serif-heading">{feature.title}</h4>
                      <p className="mt-1 text-sm text-[#6B7280] sans-text">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div ref={statsSectionRef} id="stats" className="py-20 bg-[#f8f6f3] relative overflow-hidden">
        {/* Decorative leaf */}
        <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none z-0 opacity-15 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg transform rotate-45"
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              Our Impact
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-[#1F2937] mb-6 serif-heading"
              initial={{ opacity: 0 }}
              animate={statsSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Numbers Speak For Themselves!
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Green accent at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50]"></div>
              
              <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Curated Products</h3>
              
              <div className="flex items-center justify-center mb-2">
                <span ref={productCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading">
                  {productCount}
                </span>
                <span className="text-2xl font-bold text-[#5B8C3E]">+</span>
              </div>
              
              <p className="text-sm text-[#6B7280] sans-text">handpicked organic items</p>
            </motion.div>
            
            {/* Stat Card 2 */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Green accent at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50]"></div>
              
              <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Curated Products</h3>
              
              <div className="flex items-center justify-center mb-2">
                <span ref={brandCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading">
                  {brandCount}
                </span>
                <span className="text-2xl font-bold text-[#5B8C3E]">+</span>
              </div>
              
              <p className="text-sm text-[#6B7280] sans-text">quality organic brands</p>
            </motion.div>
            
            {/* Stat Card 3 */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={statsSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {/* Green accent at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50]"></div>
              
              <h3 className="text-lg font-medium text-[#6B7280] mb-4 serif-heading">Product Categories</h3>
              
              <div className="flex items-center justify-center mb-2">
                <span ref={categoryCountRef} className="text-5xl font-bold text-[#1F2937] mr-1 serif-heading">
                  {categoryCount}
                </span>
                <span className="text-2xl font-bold text-[#5B8C3E]">+</span>
              </div>
              
              <p className="text-sm text-[#6B7280] sans-text">diverse organic categories</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div ref={testimonialSectionRef} className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#5B8C3E]/5 to-[#7BAD50]/10 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative p-8 border border-white border-opacity-20"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {/* Left - Customer Image */}
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <motion.div
                    className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#5B8C3E] shadow-lg"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img 
                      src={testimonialImg} 
                      alt="Mila Kunit" 
                      className="w-full h-full object-cover" 
                    />
                  </motion.div>
                  
                  {/* Rating badge */}
                  <motion.div 
                    className="absolute -right-4 -bottom-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="text-center">
                      <span className="block text-sm font-bold">5/5</span>
                      <div className="flex justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Right - Testimonial */}
              <div className="md:col-span-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={testimonialSectionVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <svg className="h-10 w-10 text-[#5B8C3E] mb-4 opacity-30" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  
                  <p className="text-xl text-[#1F2937] mb-8 italic accent-text">
                    Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                  
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-[#1F2937] serif-heading">Mila Kunit</h4>
                    <span className="mx-2 text-gray-300">•</span>
                    <p className="text-[#6B7280] text-sm sans-text">Loyal Customer</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certified Products Section */}
      <div ref={certifiedSectionRef} id="certified" className="py-20 bg-[#f8f6f3] relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-br from-[#5B8C3E]/5 to-[#7BAD50]/10 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={certifiedSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img 
              src={certifiedBadge}
              alt="Certified Organic" 
              className="w-32 h-32 mx-auto mb-8"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 serif-heading">
              Certified Products
            </h2>
            
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto mb-10 sans-text">
              Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((badge, i) => (
                <motion.div 
                  key={i}
                  className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={certifiedSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                >
                  <span className="text-[#5B8C3E] text-xl font-bold">
                    {i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Categories Section */}
      <div ref={categoriesSectionRef} id="categories" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#EDF5E5] to-[#AECB95]/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={categoriesSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              Our Products
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-[#1F2937] mb-6 serif-heading"
              initial={{ opacity: 0 }}
              animate={categoriesSectionVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We Deal With Various Quality Organic Products!
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fresh Fruits", image: freshFruitsImg },
              { title: "Dry Fruits", image: dryFruitsImg },
              { title: "Fresh Vegetables", image: freshVegetablesImg },
              { title: "Dried Vegetables", image: driedVegetablesImg },
              { title: "Beauty Products", image: beautyProductsImg },
              { title: "Milk Products", image: milkProductsImg },
              { title: "Organic Honey", image: organicHoneyImg },
              { title: "Organic Tea", image: organicTeaImg }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                animate={categoriesSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/90 via-transparent to-transparent flex items-end">
                  <div className="p-4 w-full text-white">
                    <h3 className="text-xl font-semibold mb-1 serif-heading">{category.title}</h3>
                    <div className="w-12 h-1 bg-[#5B8C3E] rounded transition-all duration-300 group-hover:w-24"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaSectionRef} className="py-20 bg-[#f8f6f3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1F2937]/5 mix-blend-multiply"></div>
        
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
            className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative p-12 border border-white border-opacity-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaSectionVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 serif-heading">
              Ready to Experience Organic Goodness?
            </h2>
            
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto mb-8 sans-text">
              Browse our selection of premium organic products and start your journey towards healthier living.
            </p>
            
            <motion.a 
              href="/shop" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-medium py-4 px-10 rounded-md transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">Start Shopping</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About; 