import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.ORDERS}/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Poppins'] text-sm text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 py-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
            </div>
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] mb-2">Something went wrong</h3>
            <p className="font-['Poppins'] text-sm text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const statusMap = {
      delivered: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        icon: 'fas fa-check-circle',
        label: 'Delivered'
      },
      shipped: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        icon: 'fas fa-truck',
        label: 'Shipped'
      },
      processing: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        icon: 'fas fa-clock',
        label: 'Processing'
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        icon: 'fas fa-times-circle',
        label: 'Cancelled'
      },
      pending: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800',
        icon: 'fas fa-hourglass-half',
        label: 'Pending'
      }
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2">
            My Orders 🛒
          </h1>
          <p className="font-['Poppins'] text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
            Track and manage all your organic garden orders
          </p>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-lg text-center max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shopping-bag text-white text-lg sm:text-xl"></i>
            </div>
            <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-[#1F2937] mb-3">No orders yet</h3>
            <p className="font-['Poppins'] text-sm text-gray-600 mb-6 leading-relaxed">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link 
              to="/shop" 
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Start Shopping 🌱
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <div key={order.order_id} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] px-4 sm:px-6 py-4">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <div className="min-w-0">
                        <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-white truncate">
                          Order #{order.order_id}
                        </h2>
                        <p className="font-['Poppins'] text-white/90 flex items-center text-xs sm:text-sm">
                          <i className="fas fa-calendar-alt mr-2 flex-shrink-0"></i>
                          <span className="truncate">{formatDate(order.order_date)}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-['Poppins'] px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig.bg} ${statusConfig.text}`}>
                          <i className={`${statusConfig.icon} mr-1 text-xs`}></i>
                          <span className="truncate">{statusConfig.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
                      
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[#1F2937] mb-4 flex items-center">
                          <i className="fas fa-box mr-2 text-[#5B8C3E] text-sm"></i>
                          <span>Items ({order.items?.length || 0})</span>
                        </h3>
                        <div className="space-y-3">
                          {order.items && order.items.slice(0, 3).map((item) => (
                            <div key={item.order_item_id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/60">
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-lg flex items-center justify-center flex-shrink-0">
                                  <i className="fas fa-leaf text-white text-xs"></i>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-['Poppins'] font-medium text-[#1F2937] text-sm truncate">{item.product_name || item.name}</p>
                                  <p className="font-['Poppins'] text-xs text-gray-600">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <p className="font-['Poppins'] text-sm font-bold text-[#5B8C3E]">₹{formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                          {order.items && order.items.length > 3 && (
                            <div className="text-center py-2">
                              <p className="font-['Poppins'] text-xs text-gray-500">
                                +{order.items.length - 3} more items
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Summary */}
                      <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4">
                        <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[#1F2937] mb-4 flex items-center">
                          <i className="fas fa-calculator mr-2 text-[#7BAD50] text-sm"></i>
                          <span>Summary</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-['Poppins'] text-gray-600">Subtotal</span>
                            <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.subtotal || order.total_price)}</span>
                          </div>
                          {order.total_tax && parseFloat(order.total_tax) > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-['Poppins'] text-gray-600">Tax</span>
                              <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.total_tax)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-['Poppins'] text-gray-600">Shipping</span>
                            <span className="font-['Poppins'] font-medium text-[#5B8C3E]">Free</span>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-['Poppins'] text-base font-bold text-[#1F2937]">Total</span>
                              <span className="font-['Poppins'] text-lg font-bold text-[#5B8C3E]">₹{formatPrice(order.total_price)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 space-y-2">
                          <Link 
                            to={`/order-details/${order.order_id}`} 
                            className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm group"
                          >
                            <i className="fas fa-eye mr-2 group-hover:scale-110 transition-transform duration-200 text-sm"></i>
                            View Details
                          </Link>
                          {order.status === 'pending' && (
                            <button className="w-full flex items-center justify-center px-4 py-2.5 bg-white/80 border border-red-200 text-red-600 font-['Poppins'] font-medium rounded-xl hover:bg-red-50 transition-all duration-300 text-sm group">
                              <i className="fas fa-times mr-2 group-hover:scale-110 transition-transform duration-200 text-sm"></i>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 