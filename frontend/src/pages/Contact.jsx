import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import personImage1 from '../assets/images/contact-page-hero-section-person-images/person1.jpg';
import personImage2 from '../assets/images/contact-page-hero-section-person-images/person2.jpg';
import personImage3 from '../assets/images/contact-page-hero-section-person-images/person3.jpg';
import personImage4 from '../assets/images/contact-page-hero-section-person-images/person4.jpg';
import personImage5 from '../assets/images/contact-page-hero-section-person-images/person5.jpg';
import personImage6 from '../assets/images/contact-page-hero-section-person-images/person6.jpg';
import leafImage from '../assets/images/leaf-2.png';
import leaf1Image from '../assets/images/leaf1.png';
import { API_ENDPOINTS } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for scroll animations using Intersection Observer
const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, we can unobserve the element
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Question',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // State for FAQ accordion
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  // Refs and animation states for scroll animations
  const [contactSectionRef, contactSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [card1Ref, card1Visible] = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const [card2Ref, card2Visible] = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const [card3Ref, card3Visible] = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const [mapSectionRef, mapSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [faqSectionRef, faqSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  const [formSectionRef, formSectionVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const [confetti, setConfetti] = useState(false);
  const buttonRef = useRef(null);
  
  // Adding more refs and animation states for scroll animations
  const [heroImageRef, heroImageVisible] = useScrollAnimation({ threshold: 0.1 });
  const [socialProofRef, socialProofVisible] = useScrollAnimation({ threshold: 0.1 });
  const [heroLeafRef, leafOffset] = useParallaxScroll(0.1);
  const [formSectionLeafRef, formLeafOffset] = useParallaxScroll(0.15);
  const [faqLeafRef, faqLeafOffset] = useParallaxScroll(0.12);
  
  // Toggle accordion state
  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make API call to backend
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          phone: formData.phone || null, // Optional field
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }
      
      // Trigger confetti animation on success
      setConfetti(true);
      
      // Successful submission
    setFormStatus({
      submitted: true,
      success: true,
        message: data.message || 'Thank you for your message! We will get back to you soon.'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Question',
      message: ''
    });
      
      // Scroll to success message with smooth animation
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById('contact-form').offsetTop - 100,
          behavior: 'smooth'
        });
      }, 800);
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: error.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset confetti after animation
  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => {
        setConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Modern Hero Section with premium styling */}
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
        <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 transition-all duration-500 ${scrolled ? 'transform -translate-y-4' : ''}`}>
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
                    <span className="ml-1 text-sm font-medium text-[#6B7280] md:ml-2">Contact</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Hero content with premium typography */}
            <div className={`transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-xs font-semibold mb-4 shadow-sm">
                Get in Touch
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight mb-6 transition-all duration-500 serif-heading">
                Let's Start a <span className="relative overflow-hidden group">
                  <span className="inline-block transition-transform duration-300 group-hover:transform group-hover:-translate-y-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] bg-clip-text text-transparent">Conversation</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-[#6B7280] mb-8 max-w-xl leading-relaxed sans-text">
                Have questions about our organic products or farming practices? We're here to help you connect with truly sustainable farming.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <motion.a 
                  href="#contact-form" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-medium py-3 px-8 rounded-md transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 backdrop-filter backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Send Us a Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="#why-organic" 
                  className="inline-flex items-center justify-center bg-white border border-[#E5E7EB] text-[#5B8C3E] hover:bg-[#EDF5E5] font-medium py-3 px-8 rounded-md transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 backdrop-filter backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Learn More</span>
                </motion.a>
              </div>
              
              {/* Social proof with enhanced styling */}
              <div 
                ref={socialProofRef}
                className={`mt-10 pt-6 border-t border-[#E5E7EB] transition-all duration-700 delay-500 ease-out transform ${socialProofVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <p className="mb-3 text-sm font-medium bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] bg-clip-text text-transparent">Trusted by Organic Enthusiasts</p>
                <div className="flex -space-x-3">
                  {[
                    { img: personImage1, alt: "Client testimonial" },
                    { img: personImage2, alt: "Client testimonial" },
                    { img: personImage3, alt: "Client testimonial" },
                    { img: personImage4, alt: "Client testimonial" },
                    { img: personImage5, alt: "Client testimonial" }
                  ].map((person, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white overflow-hidden shadow-sm transition-all duration-300 hover:scale-110 hover:translate-y-[-5px] hover:z-10 hover:shadow-md cursor-pointer`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={socialProofVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    >
                      <img 
                        src={person.img} 
                        alt={person.alt} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.p 
                  className="mt-3 text-[#6B7280] text-sm italic accent-text"
                  initial={{ opacity: 0 }}
                  animate={socialProofVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  "Their commitment to sustainable farming practices and exceptional customer service sets them apart in the organic market."
                </motion.p>
              </div>
            </div>
            
            {/* Right column - Hero card with glass effect */}
            <div 
              ref={heroImageRef}
              className={`relative h-full flex items-center justify-center p-4 transition-all duration-700 transform ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} ${heroImageVisible ? 'scale-100' : 'scale-95'}`}
            >
              <motion.div 
                className="relative w-full max-w-md h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:shadow-2xl hover:scale-105"
                initial={{ y: 30, opacity: 0 }}
                animate={heroImageVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6f3] to-[#e8e4d9] opacity-90"></div>
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white bg-opacity-20 border border-white border-opacity-20"></div>
                
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-8 text-center z-10">
                  <motion.div 
                    className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] flex items-center justify-center transition-transform duration-500 hover:rotate-12 shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <motion.h2 
                    className="text-2xl font-bold text-[#1F2937] mb-2 serif-heading"
                    initial={{ opacity: 0 }}
                    animate={heroImageVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Reach Out To Us
                  </motion.h2>
                  <motion.p 
                    className="text-[#6B7280] mb-4 sans-text"
                    initial={{ opacity: 0 }}
                    animate={heroImageVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    We're excited to hear from you about our organic products
                  </motion.p>
                  <motion.span 
                    className="inline-block px-4 py-2 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors duration-300 cursor-pointer transform hover:scale-105 active:scale-95 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroImageVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Response within 24 hours
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section - Glass morphism with premium styling */}
      <div id="contact-form" ref={formSectionRef} className="py-20 bg-white relative overflow-hidden">
        {/* Decorative blob gradients in background */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#5B8C3E]/5 to-[#7BAD50]/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-[#EDF5E5] to-[#AECB95]/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* Decorative leaf in bottom right corner with parallax */}
        <div 
          ref={formSectionLeafRef}
          className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none z-0 opacity-20"
          style={{ transform: `rotate(-45deg) translateY(${formLeafOffset * 0.3}px)` }}
        >
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        
        {/* Decorative leaf in bottom left corner with parallax */}
        <div 
          className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none z-0 opacity-15"
          style={{ transform: `rotate(90deg) scale(-1, 1) translateY(${formLeafOffset * -0.2}px)` }}
        >
          <img 
            src={leafImage} 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        
        {/* Confetti Animation */}
        <AnimatePresence>
          {confetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    top: "50%", 
                    left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left + window.scrollX : "50%",
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    scale: Math.random() * 0.8 + 0.2,
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: Math.random() * 2 + 3,
                    ease: "easeOut",
                    delay: Math.random() * 0.2,
                  }}
                >
                  <div
                    className="h-4 w-4 rounded-sm"
                    style={{
                      backgroundColor: 
                        [`#5B8C3E`, `#AECB95`, `#EDF5E5`, `#8DB56A`, `#3B5323`][
                          Math.floor(Math.random() * 5)
                        ],
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header with animation */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={formSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-4">
              <motion.span 
                className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(91, 140, 62, 0.25)"
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Get In Touch
              </motion.span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4 serif-heading">Send Us a Message</h2>
            <p className="mt-4 text-[#6B7280] text-lg max-w-2xl mx-auto sans-text">
              Have a question or want to learn more about our organic products? We'd love to hear from you.
            </p>
          </motion.div>
          
          {/* Form Success Message with enhanced animation */}
          <AnimatePresence mode="wait">
            {formStatus.submitted && formStatus.success && (
              <motion.div 
                className="mb-10 bg-gradient-to-r from-[#EDF5E5] to-[#EDF5E5] backdrop-filter backdrop-blur-sm border border-[#AECB95] rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15 
                }}
              >
                <div className="flex">
                  <motion.div 
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                  >
                    <svg className="h-5 w-5 text-[#5B8C3E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <div className="ml-3">
                    <motion.h3 
                      className="text-lg font-medium text-[#5B8C3E] serif-heading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.div 
                      className="mt-2 text-[#6B7280] sans-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p>{formStatus.message}</p>
                    </motion.div>
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormStatus({ submitted: false, success: false, message: '' })}
                        className="text-sm font-medium text-[#5B8C3E] hover:text-[#3B5323] focus:outline-none focus:underline transition-colors duration-300"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Form Error Message with error animation */}
            {formStatus.submitted && !formStatus.success && (
              <motion.div 
                className="mb-10 bg-gradient-to-r from-red-50 to-red-100 backdrop-filter backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flex">
                  <motion.div 
                    className="flex-shrink-0"
                    animate={{ rotate: [0, 5, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                  >
                    <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  </motion.div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800 serif-heading">Error</h3>
                    <div className="mt-2 text-red-700 sans-text">
                      <p>{formStatus.message}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setFormStatus({ submitted: false, success: false, message: '' })}
                        className="text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus:underline transition-colors duration-300"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Only show form if not successfully submitted */}
          <AnimatePresence>
            {(!formStatus.submitted || !formStatus.success) && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
                initial={{ opacity: 0, y: 50 }}
                animate={formSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
              >
                {/* Left Column - Contact Form - Glass effect */}
                <motion.div 
                  className="col-span-1 lg:col-span-3 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl border border-white border-opacity-20 shadow-xl p-8 relative overflow-hidden"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {/* Subtle gradient accent in top-left */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#5B8C3E]/20 to-[#7BAD50]/10 rounded-full filter blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-[#1F2937] mb-5 serif-heading">Send a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* 2-column layout for name and email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name Field with subtle animation */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label htmlFor="name" className="block text-sm font-medium text-[#4B5563] mb-1 sans-text">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${formErrors.name ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:outline-none focus:ring-1 focus:ring-[#5B8C3E] focus:border-[#5B8C3E] transition-colors bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm`}
                            placeholder="Your full name"
                          />
                          {formErrors.name && (
                            <motion.p 
                              className="mt-1 text-xs text-red-600"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {formErrors.name}
                            </motion.p>
                          )}
                        </motion.div>
                        
                        {/* Email Field */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label htmlFor="email" className="block text-sm font-medium text-[#4B5563] mb-1 sans-text">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:outline-none focus:ring-1 focus:ring-[#5B8C3E] focus:border-[#5B8C3E] transition-colors bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm`}
                            placeholder="you@example.com"
                          />
                          {formErrors.email && (
                            <motion.p 
                              className="mt-1 text-xs text-red-600"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {formErrors.email}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                      
                      {/* 2-column layout for phone and subject */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Phone Field */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label htmlFor="phone" className="block text-sm font-medium text-[#4B5563] mb-1 sans-text">
                            Phone <span className="text-[#9CA3AF] text-xs">(optional)</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-md border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#5B8C3E] focus:border-[#5B8C3E] transition-colors bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm"
                            placeholder="(123) 456-7890"
                          />
                        </motion.div>
                        
                        {/* Subject Dropdown */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <label htmlFor="subject" className="block text-sm font-medium text-[#4B5563] mb-1 sans-text">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-md border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#5B8C3E] focus:border-[#5B8C3E] transition-colors bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm"
                          >
                            <option value="Question">Question</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Order Issue">Order Issue</option>
                            <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                            <option value="Other">Other</option>
                          </select>
                        </motion.div>
                      </div>
                      
                      {/* Message Field */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label htmlFor="message" className="block text-sm font-medium text-[#4B5563] mb-1 sans-text">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          className={`w-full px-4 py-2.5 rounded-md border ${formErrors.message ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:outline-none focus:ring-1 focus:ring-[#5B8C3E] focus:border-[#5B8C3E] transition-colors bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm`}
                          placeholder="How can we help you?"
                        ></textarea>
                        {formErrors.message && (
                          <motion.p 
                            className="mt-1 text-xs text-red-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {formErrors.message}
                          </motion.p>
                        )}
                      </motion.div>
                      
                      {/* Submit Button with special animation */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center justify-between pt-2"
                      >
                        <p className="text-xs text-[#6B7280] sans-text">Fields marked with <span className="text-red-500">*</span> are required</p>
                        
                        <motion.button
                          ref={buttonRef}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2.5 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-md shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 10px 25px -5px rgba(91, 140, 62, 0.4)"
                          }}
                        >
                          {isSubmitting ? (
                            <motion.span 
                              className="flex items-center justify-center"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </motion.span>
                          ) : (
                            <motion.span 
                              className="flex items-center justify-center"
                              initial={{ y: 0 }}
                              whileHover={{ y: -2 }}
                            >
                              Send Message
                              <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  repeat: Infinity, 
                                  repeatType: "mirror", 
                                  duration: 1.5, 
                                  ease: "easeInOut" 
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </motion.svg>
                            </motion.span>
                          )}
                        </motion.button>
                      </motion.div>
                    </form>
                  </div>
                </motion.div>
                
                {/* Right Column - With glass morphism effect */}
                <motion.div 
                  className="col-span-1 lg:col-span-2 relative"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -top-6 -right-6 w-48 h-48 bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] rounded-full opacity-50 filter blur-2xl z-0"></div>
                  
                  {/* Content card with glass morphism */}
                  <div className="relative z-10 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl border border-white border-opacity-20 shadow-xl p-6 h-full flex flex-col overflow-hidden">
                    {/* Gradient top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50]"></div>
                    
                    <h3 className="text-xl font-semibold text-[#1F2937] mb-4 serif-heading">Why Choose Organic?</h3>
                    
                    <div className="mt-2 space-y-4 flex-grow">
                      {/* Feature 1 */}
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-[#5B8C3E] shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-[#1F2937] serif-heading">Certified Organic</h4>
                          <p className="mt-1 text-sm text-[#6B7280] sans-text">Free from harmful pesticides and chemicals.</p>
                        </div>
                      </div>
                      
                      {/* Feature 2 */}
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-[#5B8C3E] shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-[#1F2937] serif-heading">Customizable Orders</h4>
                          <p className="mt-1 text-sm text-[#6B7280] sans-text">Flexible sizing and customization options.</p>
                        </div>
                      </div>
                      
                      {/* Feature 3 */}
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-[#5B8C3E] shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-[#1F2937] serif-heading">Fast Delivery</h4>
                          <p className="mt-1 text-sm text-[#6B7280] sans-text">Quick and reliable delivery to maintain freshness.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img 
                            src={personImage6} 
                            alt="Organic farming specialist" 
                            className="h-12 w-12 rounded-full object-cover border-2 border-[#5B8C3E] shadow-md" 
                          />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-[#1F2937] serif-heading">Emma Thompson</h4>
                          <p className="text-sm text-[#6B7280] sans-text">Organic Specialist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contact Information Section - Changed to #f8f6f3 background - MOVED AFTER Contact Form Section */}
      <div ref={contactSectionRef} className="py-16 bg-[#f8f6f3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-12 text-center transition-all duration-700 transform ${contactSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-4">
              <motion.span 
                className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(91, 140, 62, 0.25)"
                }}
              >
                Get In Touch
              </motion.span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2937] leading-tight">How to Reach Us</h2>
            <div className="mb-6"></div>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">We're always here to help with any questions about our organic products</p>
          </div>
          
          {/* Contact Info Cards - Simple, clean design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Email Card */}
            <div 
              ref={card1Ref} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${card1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="bg-[#5B8C3E] text-white h-20 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">Email</h3>
                <p className="text-[#6B7280] mb-4">For any inquiries about our products or services</p>
                <a href="mailto:support@organicfarm.com" className="text-[#5B8C3E] hover:text-[#3B5323] font-medium transition-colors flex items-center">
                  support@organicfarm.com
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Phone Card */}
            <div 
              ref={card2Ref} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${card2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="bg-[#5B8C3E] text-white h-20 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">Phone</h3>
                <p className="text-[#6B7280] mb-4">Call us during business hours for immediate assistance</p>
                <a href="tel:+15551234567" className="text-[#5B8C3E] hover:text-[#3B5323] font-medium transition-colors flex items-center">
                  +1 (555) 123-4567
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <p className="text-sm text-[#6B7280] mt-2">Monday-Friday: 9AM-6PM</p>
              </div>
            </div>
            
            {/* Location Card */}
            <div 
              ref={card3Ref} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${card3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="bg-[#5B8C3E] text-white h-20 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">Location</h3>
                <p className="text-[#6B7280] mb-4">Visit our farm and store for a direct experience</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[#5B8C3E] hover:text-[#3B5323] font-medium transition-colors flex items-center">
                  123 Farm Road, Green Valley
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <div className="grid grid-cols-2 gap-1 text-sm mt-2">
                  <p className="text-[#6B7280]">Mon-Fri:</p>
                  <p className="text-[#1F2937]">9AM-6PM</p>
                  <p className="text-[#6B7280]">Saturday:</p>
                  <p className="text-[#1F2937]">10AM-4PM</p>
                  <p className="text-[#6B7280]">Sunday:</p>
                  <p className="text-[#1F2937]">Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map section with cleaner design */}
          <div 
            ref={mapSectionRef} 
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-700 transform ${mapSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            style={{ transitionDelay: '450ms' }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-[#5B8C3E] text-white p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Our Location</h3>
                <p className="mb-6 opacity-90">Find our farm and organic store with the map</p>
                <div className="mb-6">
                  <address className="not-italic text-lg font-medium">
                    123 Farm Road, Green Valley<br />
                    California, 90210
                  </address>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#5B8C3E] rounded-lg font-medium transition-all duration-300 hover:bg-[#f1f5f1] transform hover:scale-105"
                >
                  <span>Get Directions</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              <div className="w-full md:w-2/3 p-0">
                <div className="bg-[#f8f6f3] h-64 md:h-80 relative">
                  {/* Map placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="animate-ping-slow w-8 h-8 bg-[#5B8C3E] bg-opacity-50 rounded-full mb-6"></div>
                    <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                      <p className="font-semibold text-[#1F2937]">Interactive Map Coming Soon</p>
                    </div>
                  </div>
                  
                  {/* Simple grid pattern overlay */}
                  <div className="absolute inset-0 opacity-10 pattern-grid"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section - Enhanced with glass morphism and premium effects */}
      <div ref={faqSectionRef} className="py-20 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-[#5B8C3E]/5 to-[#7BAD50]/10 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-[#EDF5E5] to-[#AECB95]/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Light decorative elements */}
          <motion.div 
            className="absolute top-40 right-0 w-40 h-40 bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] rounded-full opacity-20 translate-x-1/2 blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.25, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-20 left-0 w-32 h-32 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-full opacity-10 -translate-x-1/2 blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          ></motion.div>
          
          {/* Decorative leaf in bottom right corner with parallax */}
          <div 
            ref={faqLeafRef}
            className="absolute bottom-0 right-0 w-56 h-56 pointer-events-none z-0 opacity-20"
            style={{ transform: `rotate(-15deg) translateY(${faqLeafOffset * 0.25}px)` }}
          >
            <img 
              src={leafImage} 
              alt="" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
          
          {/* Decorative leaf in bottom left corner with parallax */}
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none z-0 opacity-15"
            style={{ transform: `rotate(125deg) scale(-1, 1) translateY(${faqLeafOffset * -0.2}px)` }}
          >
            <img 
              src={leafImage} 
              alt="" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
          
          {/* Section header with animation */}
          <div className={`text-center mb-16 transition-all duration-1000 transform ${faqSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-4">
              <motion.span 
                className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white text-sm font-medium shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(91, 140, 62, 0.25)"
                }}
              >
                Support
              </motion.span>
            </div>
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4 serif-heading">Frequently Asked Questions</h2>
            <p className="mt-4 text-[#6B7280] text-lg max-w-2xl mx-auto sans-text">Find quick answers to common questions about our organic products and services</p>
          </div>
          
          {/* FAQ Accordion Items with glass morphism */}
          <div className="space-y-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                q: "How do I know your products are truly organic?", 
                a: "All our products are certified organic by [certification body]. We maintain rigorous standards throughout our farming process and provide transparency through farm visits and detailed product information."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                q: "Do you offer international shipping?", 
                a: "Yes, we ship to select international destinations. Shipping rates and delivery times vary by location. Please contact our customer service for specific details about shipping to your country."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                ),
                q: "What's your return policy?", 
                a: "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                q: "How long does delivery usually take?",
                a: "Delivery times vary based on your location. For domestic orders, delivery typically takes 3-5 business days. For international orders, please allow 7-14 business days for your package to arrive. You'll receive tracking information once your order ships."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                q: "Are there any discounts for bulk orders?",
                a: "Yes, we offer special pricing for bulk orders. For orders exceeding $500, you automatically receive a 10% discount. For larger wholesale inquiries, please contact our sales team directly at sales@organicfarm.com to discuss custom pricing options."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform ${faqSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* FAQ Question with premium styling */}
                <button 
                  onClick={() => toggleAccordion(index)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300 ${activeAccordion === index ? 'bg-gradient-to-r from-[#EDF5E5]/80 to-[#EDF5E5]/80' : 'hover:bg-gray-50/80'}`}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${activeAccordion === index ? 'bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white shadow-md' : 'bg-gradient-to-br from-[#EDF5E5] to-[#EDF5E5] text-[#5B8C3E]'}`}>
                      {faq.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2937] serif-heading">{faq.q}</h3>
                  </div>
                  <div className={`text-[#5B8C3E] transform transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                
                {/* FAQ Answer with elegant animation */}
                <div 
                  className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                    activeAccordion === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <div className="pl-14 border-l-2 border-gradient-to-b from-[#5B8C3E] to-[#7BAD50] ml-5">
                    <p className="text-[#6B7280] text-base sans-text">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-12 text-center transition-all duration-1000 delay-300 transform ${faqSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#contact-form" className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0">
              <span>Have more questions? Contact us</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animation and styling
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
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-pulse {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(4deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }
  
  .animate-float {
    animation: float 15s ease-in-out infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  /* Create a gradient border effect */
  .border-gradient-to-b {
    border-image: linear-gradient(to bottom, #5B8C3E, #7BAD50) 1;
  }
`;
document.head.appendChild(style);

export default Contact; 