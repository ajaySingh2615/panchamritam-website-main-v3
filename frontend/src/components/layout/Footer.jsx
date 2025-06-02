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
    <footer className="relative bg-gradient-to-br from-[#5B8C3E] via-[#4A7834] to-[#3B5323] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/15 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 border border-white/10 rounded-full"></div>
      </div>

      {/* Organic Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" fill="none" className="relative block w-full h-12">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#f8f6f3" 
            opacity="0.8"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
        {/* Trust Badges */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <i className="fas fa-leaf text-green-200"></i>
              <span className="font-['Poppins'] text-sm font-medium">100% Organic</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <i className="fas fa-shipping-fast text-green-200"></i>
              <span className="font-['Poppins'] text-sm font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <i className="fas fa-shield-alt text-green-200"></i>
              <span className="font-['Poppins'] text-sm font-medium">Certified Safe</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <i className="fas fa-clock text-green-200"></i>
              <span className="font-['Poppins'] text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white">
                Panchamritam
              </h3>
              <span className="ml-2 text-2xl animate-bounce">🌿</span>
            </div>
            <p className="font-['Poppins'] text-sm text-green-100 leading-relaxed mb-6">
              Authentic organic products sourced directly from nature. Bringing you the purest ingredients with sustainable practices and traditional wisdom.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-3 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                title="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f text-white text-sm group-hover:scale-110 transition-transform duration-300"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                title="Follow us on Instagram"
              >
                <i className="fab fa-instagram text-white text-sm group-hover:scale-110 transition-transform duration-300"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 hover:bg-blue-400 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                title="Follow us on Twitter"
              >
                <i className="fab fa-twitter text-white text-sm group-hover:scale-110 transition-transform duration-300"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                title="Subscribe to our YouTube"
              >
                <i className="fab fa-youtube text-white text-sm group-hover:scale-110 transition-transform duration-300"></i>
              </a>
            </div>

            {/* Certification Badges */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-800 text-xs"></i>
                </div>
                <span className="font-['Poppins'] text-xs text-green-100">USDA Organic Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-800 text-xs"></i>
                </div>
                <span className="font-['Poppins'] text-xs text-green-100">ISO 22000 Certified</span>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-compass mr-2 text-green-200"></i>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home', icon: 'fas fa-home' },
                { to: '/shop', label: 'Shop', icon: 'fas fa-store' },
                { to: '/about', label: 'About', icon: 'fas fa-leaf' },
                { to: '/blog', label: 'Blog', icon: 'fas fa-blog' },
                { to: '/contact', label: 'Contact', icon: 'fas fa-envelope' },
                { to: '/faq', label: 'FAQ', icon: 'fas fa-question-circle' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-2"
                  >
                    <i className={`${link.icon} text-xs mr-3 w-4 text-green-200 group-hover:text-white transition-colors duration-200`}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Categories */}
          <div>
            <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-tags mr-2 text-green-200"></i>
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Organic Vegetables', icon: 'fas fa-carrot', badge: 'Fresh' },
                { label: 'Natural Fruits', icon: 'fas fa-apple-alt', badge: 'Seasonal' },
                { label: 'Wellness Products', icon: 'fas fa-spa', badge: 'Popular' },
                { label: 'Herbal Teas', icon: 'fas fa-mug-hot', badge: 'New' },
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to="/services" 
                    className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-all duration-200 flex items-center justify-between group hover:translate-x-2"
                  >
                    <div className="flex items-center">
                      <i className={`${item.icon} text-xs mr-3 w-4 text-green-200 group-hover:text-white transition-colors duration-200`}></i>
                      {item.label}
                    </div>
                    <span className="bg-white/20 text-green-100 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div>
            <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-phone mr-2 text-green-200"></i>
              Contact Info
            </h4>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-map-marker-alt text-white text-sm"></i>
                </div>
                <div>
                  <span className="font-['Poppins'] text-sm text-green-100 leading-relaxed">
                    123 Organic Street,<br />
                    Natural City, Earth 12345
                  </span>
                  <br />
                  <a href="#" className="font-['Poppins'] text-xs text-green-200 hover:text-white transition-colors duration-200">
                    Get Directions →
                  </a>
                </div>
              </li>
              
              <li className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone text-white text-sm"></i>
                </div>
                <div>
                  <a 
                    href="tel:+1234567890" 
                    className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 block"
                  >
                    +1 (234) 567-890
                  </a>
                  <span className="font-['Poppins'] text-xs text-green-200">24/7 Customer Support</span>
                </div>
              </li>
              
              <li className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-white text-sm"></i>
                </div>
                <div>
                  <a 
                    href="mailto:hello@panchamritam.com" 
                    className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 block"
                  >
                    hello@panchamritam.com
                  </a>
                  <span className="font-['Poppins'] text-xs text-green-200">We reply within 24hrs</span>
                </div>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h5 className="font-['Poppins'] text-sm font-semibold text-white mb-2 flex items-center">
                <i className="fas fa-clock mr-2 text-green-200"></i>
                Business Hours
              </h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-100">Mon - Fri:</span>
                  <span className="text-white">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100">Saturday:</span>
                  <span className="text-white">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100">Sunday:</span>
                  <span className="text-white">11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Newsletter Section */}
        <div className="border-t border-white/20 mt-16 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <h4 className="font-['Playfair_Display'] text-2xl font-semibold mb-4 text-white flex items-center justify-center">
                Stay Connected with Nature
                <span className="ml-2 text-2xl animate-pulse">🌱</span>
              </h4>
              <p className="font-['Poppins'] text-sm text-green-100 leading-relaxed">
                Join over <strong className="text-white">10,000+</strong> nature lovers! Get organic tips, seasonal recipes, exclusive offers, and be the first to know about new products.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent font-['Poppins'] text-sm backdrop-blur-sm transition-all duration-300"
                    required
                  />
                  <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-green-200 text-sm"></i>
                </div>
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-4 bg-white text-[#5B8C3E] font-['Poppins'] font-semibold rounded-xl hover:bg-green-50 transition-all duration-300 hover:scale-105 text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin"></div>
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
                <div className="mt-4 flex items-center justify-center space-x-2 text-green-200">
                  <i className="fas fa-check-circle"></i>
                  <span className="font-['Poppins'] text-sm">Successfully subscribed! Welcome to our community 🎉</span>
                </div>
              )}
            </form>
            
            <p className="font-['Poppins'] text-xs text-green-200 mt-4">
              📧 No spam, unsubscribe anytime • 🎁 Get 10% off your first order
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-white/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="font-['Poppins'] text-sm text-green-100">
                &copy; {new Date().getFullYear()} Panchamritam. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-green-200">
                <span className="font-['Poppins'] text-xs">Made with</span>
                <i className="fas fa-heart text-red-400 animate-pulse"></i>
                <span className="font-['Poppins'] text-xs">for nature lovers</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6">
              <Link 
                to="/privacy" 
                className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 hover:underline"
              >
                Terms of Service
              </Link>
              <Link 
                to="/shipping" 
                className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 hover:underline"
              >
                Shipping Policy
              </Link>
              <Link 
                to="/returns" 
                className="font-['Poppins'] text-sm text-green-100 hover:text-white transition-colors duration-200 hover:underline"
              >
                Returns
              </Link>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="font-['Poppins'] text-xs text-green-200 mb-3">Secure payments powered by</p>
            <div className="flex justify-center items-center space-x-4 opacity-60">
              <i className="fab fa-cc-visa text-2xl"></i>
              <i className="fab fa-cc-mastercard text-2xl"></i>
              <i className="fab fa-cc-paypal text-2xl"></i>
              <i className="fab fa-google-pay text-2xl"></i>
              <i className="fas fa-mobile-alt text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 