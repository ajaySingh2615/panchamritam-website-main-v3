import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscriptionStatus('success');
      setEmail('');
      setIsSubscribing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubscriptionStatus(''), 3000);
    }, 1500);
  };

  return (
    <footer className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white">
      {/* Trust Badges Section */}
      <div className="border-b border-green-600/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-leaf text-green-300 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm">100% Organic</p>
                <p className="text-xs text-green-200">Certified Pure</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-shipping-fast text-blue-300 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm">Free Delivery</p>
                <p className="text-xs text-green-200">Orders $50+</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-purple-300 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm">Certified Safe</p>
                <p className="text-xs text-green-200">Quality Assured</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-headset text-orange-300 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-green-200">Always Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">
                Panchamritam 🌿
              </h3>
              <p className="text-gray-200 leading-relaxed text-base max-w-sm">
                Authentic organic products sourced directly from nature. Bringing you the purest ingredients with sustainable practices and traditional wisdom.
              </p>
            </div>
            
            {/* Social Links */}
            <div>
              <p className="text-gray-300 text-sm mb-4 uppercase tracking-wide font-medium">Connect With Us</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p className="text-gray-300 text-sm mb-4 uppercase tracking-wide font-medium">Quality Assured</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-200 text-sm">USDA Organic Certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-200 text-sm">ISO 22000 Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Categories Combined */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <i className="fas fa-compass mr-2 text-green-300"></i>
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li><Link to="/" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-home w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
                <li><Link to="/shop" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-store w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    Shop
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
                <li><Link to="/about" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-leaf w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    About
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
                <li><Link to="/blog" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-blog w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    Blog
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
                <li><Link to="/contact" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-envelope w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    Contact
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
                <li><Link to="/faq" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center space-x-3 relative">
                  <i className="fas fa-question-circle w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                  <span className="relative">
                    FAQ
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <i className="fas fa-tags mr-2 text-green-300"></i>
                Categories
              </h4>
              <ul className="space-y-4">
                <li><Link to="/categories/vegetables" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-carrot w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    <span className="relative">
                      Organic Vegetables
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                  <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full group-hover:bg-green-400/30 group-hover:text-white group-hover:scale-105 transition-all duration-300">Fresh</span>
                </Link></li>
                <li><Link to="/categories/fruits" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-apple-alt w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    <span className="relative">
                      Natural Fruits
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full group-hover:bg-blue-400/30 group-hover:text-white group-hover:scale-105 transition-all duration-300">Seasonal</span>
                </Link></li>
                <li><Link to="/categories/wellness" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-spa w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    <span className="relative">
                      Wellness Products
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full group-hover:bg-purple-400/30 group-hover:text-white group-hover:scale-105 transition-all duration-300">Popular</span>
                </Link></li>
                <li><Link to="/categories/teas" className="group text-green-100 hover:text-white transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-mug-hot w-4 text-green-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    <span className="relative">
                      Herbal Teas
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                  <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded-full group-hover:bg-orange-400/30 group-hover:text-white group-hover:scale-105 transition-all duration-300">New</span>
                </Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info - Redesigned and Simplified */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <i className="fas fa-phone mr-2 text-green-300"></i>
              Get In Touch
            </h4>
            
            <div className="space-y-4">
              {/* Phone */}
              <div className="group flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <i className="fas fa-phone text-green-300 w-5 group-hover:scale-110 group-hover:text-white transition-all duration-300"></i>
                <div>
                  <a href="tel:+1234567890" className="text-white hover:text-green-300 transition-colors duration-200 font-medium relative group">
                    +1 (234) 567-890
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 group-hover:w-full transition-all duration-300"></span>
                  </a>
                  <p className="text-green-100 text-sm">24/7 Customer Support</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="group flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <i className="fas fa-envelope text-green-300 w-5 group-hover:scale-110 group-hover:text-white transition-all duration-300"></i>
                <div>
                  <a href="mailto:hello@panchamritam.com" className="text-white hover:text-green-300 transition-colors duration-200 font-medium relative group">
                    hello@panchamritam.com
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 group-hover:w-full transition-all duration-300"></span>
                  </a>
                  <p className="text-green-100 text-sm">We reply within 24hrs</p>
                </div>
              </div>
              
              {/* Address */}
              <div className="group flex items-start space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <i className="fas fa-map-marker-alt text-green-300 w-5 mt-1 group-hover:scale-110 group-hover:text-white transition-all duration-300"></i>
                <div>
                  <p className="text-white font-medium">
                    123 Organic Street, Natural City
                  </p>
                  <p className="text-green-100 text-sm">Earth 12345</p>
                  <a href="#" className="text-green-300 hover:text-white text-sm transition-colors duration-200 inline-flex items-center mt-1 group">
                    <span className="relative">
                      Get Directions
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <i className="fas fa-external-link-alt ml-1 text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours - Simplified */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h5 className="text-white font-medium mb-4 flex items-center text-sm">
                <i className="fas fa-clock mr-2 text-green-300"></i>
                Business Hours
              </h5>
              <div className="text-sm text-green-100 space-y-1">
                <p><span className="text-white">Mon-Fri:</span> 9:00 AM - 8:00 PM</p>
                <p><span className="text-white">Sat:</span> 10:00 AM - 6:00 PM</p>
                <p><span className="text-white">Sun:</span> 11:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 mt-16 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold mb-4 flex items-center justify-center">
              Stay Connected with Nature
              <span className="ml-2 text-2xl">🌱</span>
            </h4>
            <p className="text-green-100 mb-8 leading-relaxed">
              Join over <strong className="text-white">10,000+</strong> nature lovers! Get organic tips, seasonal recipes, exclusive offers, and be the first to know about new products.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-800/20 border-t-green-800 rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>
              
              {subscriptionStatus === 'success' && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-green-300">
                  <i className="fas fa-check-circle"></i>
                  <span className="text-sm">Successfully subscribed! Welcome to our community 🎉</span>
                </div>
              )}
            </form>
            
            <p className="text-green-300 text-xs mt-4">
              📧 No spam, unsubscribe anytime • 🎁 Get 10% off your first order
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <p className="text-green-100 text-sm">
                &copy; {new Date().getFullYear()} Panchamritam. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-green-200">
                <span className="text-xs">Made with</span>
                <i className="fas fa-heart text-red-400 text-xs"></i>
                <span className="text-xs">for nature lovers</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6">
              <Link to="/privacy" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                Shipping Policy
              </Link>
              <Link to="/returns" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                Returns
              </Link>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-green-200 text-xs mb-3">Secure payments powered by</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <i className="fab fa-cc-visa text-2xl text-blue-400"></i>
              <i className="fab fa-cc-mastercard text-2xl text-red-400"></i>
              <i className="fab fa-cc-paypal text-2xl text-blue-500"></i>
              <i className="fab fa-google-pay text-2xl text-green-400"></i>
              <i className="fas fa-mobile-alt text-xl text-purple-400"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 