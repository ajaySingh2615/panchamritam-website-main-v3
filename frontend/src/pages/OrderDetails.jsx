import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data.data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [token, orderId]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'pending') return;

    setCancelLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Refresh order data
      const updatedResponse = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setOrder(updatedData.data.order);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Poppins'] text-sm sm:text-base text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 py-4 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-lg text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-lg sm:text-xl"></i>
            </div>
            <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-[#1F2937] mb-2">Order Not Found</h3>
            <p className="font-['Poppins'] text-sm sm:text-base text-red-600 mb-6 leading-relaxed">{error}</p>
            <Link 
              to="/orders" 
              className="w-full flex items-center justify-center px-4 py-3 sm:py-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
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
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/orders" 
            className="inline-flex items-center text-[#5B8C3E] hover:text-[#7BAD50] transition-colors duration-200 mb-4 sm:mb-6 py-2 px-1 rounded-lg hover:bg-white/30"
          >
            <i className="fas fa-arrow-left mr-2 text-sm sm:text-base"></i>
            <span className="font-['Poppins'] text-sm sm:text-base font-medium">Back to Orders</span>
          </Link>
          
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2 sm:mb-3">
                Order Details
              </h1>
              <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2 text-gray-600">
                <p className="font-['Poppins'] text-sm sm:text-base font-medium">
                  Order #{order.order_id}
                </p>
                <span className="hidden sm:inline text-gray-400">•</span>
                <p className="font-['Poppins'] text-xs sm:text-sm">
                  Placed on {formatDate(order.order_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`font-['Poppins'] px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium flex items-center shadow-sm ${statusConfig.bg} ${statusConfig.text}`}>
                <i className={`${statusConfig.icon} mr-2 text-sm sm:text-base`}></i>
                <span className="whitespace-nowrap">{statusConfig.label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            
            {/* Order Items */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-6 flex items-center">
                <i className="fas fa-box mr-3 text-[#5B8C3E] text-base sm:text-lg"></i>
                <span>Order Items</span>
                <span className="ml-2 text-sm sm:text-base font-['Poppins'] font-normal text-gray-600">
                  ({order.items?.length || 0})
                </span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-start sm:items-center justify-between p-3 sm:p-4 lg:p-5 bg-white/50 rounded-xl border border-white/60 hover:bg-white/70 transition-all duration-200">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-leaf text-white text-sm sm:text-base"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-['Poppins'] font-semibold text-[#1F2937] text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">
                          {item.name || item.product_name}
                        </h3>
                        <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="font-['Poppins'] text-gray-600">Qty:</span>
                            <span className="font-['Poppins'] font-medium text-[#1F2937]">{item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-['Poppins'] text-gray-600">Price:</span>
                            <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(item.price)}</span>
                          </div>
                          {item.hsn_code && (
                            <div className="flex items-center space-x-1">
                              <span className="font-['Poppins'] text-gray-500">HSN:</span>
                              <span className="font-['Poppins'] text-gray-500">{item.hsn_code}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3 sm:ml-4">
                      <p className="font-['Poppins'] text-base sm:text-lg lg:text-xl font-bold text-[#5B8C3E] mb-1">
                        ₹{formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      {item.tax_amount && parseFloat(item.tax_amount) > 0 && (
                        <p className="font-['Poppins'] text-xs sm:text-sm text-gray-500">
                          +₹{formatPrice(item.tax_amount)} tax
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-6 flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-[#7BAD50] text-base sm:text-lg"></i>
                Shipping Address
              </h2>
              
              {order.address_line ? (
                <div className="bg-white/50 rounded-xl p-4 sm:p-5 lg:p-6 border border-white/60">
                  <div className="space-y-2 sm:space-y-3">
                    <p className="font-['Poppins'] font-semibold text-[#1F2937] text-sm sm:text-base lg:text-lg leading-relaxed">
                      {order.address_line}
                    </p>
                    <p className="font-['Poppins'] text-sm sm:text-base text-gray-600">
                      {order.city}, {order.state} {order.zip_code}
                    </p>
                    {order.country && (
                      <p className="font-['Poppins'] text-sm sm:text-base text-gray-600">{order.country}</p>
                    )}
                    {order.phone_number && (
                      <p className="font-['Poppins'] text-sm sm:text-base text-gray-600 flex items-center pt-2 border-t border-gray-200">
                        <i className="fas fa-phone mr-2 text-[#5B8C3E] text-sm"></i>
                        <span>{order.phone_number}</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 rounded-xl p-4 sm:p-5 lg:p-6 border border-white/60 text-center">
                  <i className="fas fa-exclamation-circle text-gray-400 text-2xl mb-2"></i>
                  <p className="font-['Poppins'] text-sm sm:text-base text-gray-500 italic">No shipping address available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Order Summary */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-6 flex items-center">
                <i className="fas fa-calculator mr-3 text-[#AECB95] text-base sm:text-lg"></i>
                Order Summary
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="font-['Poppins'] text-gray-600">Subtotal</span>
                  <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.subtotal || order.total_price)}</span>
                </div>
                
                {order.total_tax && parseFloat(order.total_tax) > 0 && (
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="font-['Poppins'] text-gray-600">Tax (GST)</span>
                    <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.total_tax)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="font-['Poppins'] text-gray-600">Shipping</span>
                  <span className="font-['Poppins'] font-medium text-[#5B8C3E]">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-['Poppins'] text-base sm:text-lg lg:text-xl font-bold text-[#1F2937]">Total</span>
                    <span className="font-['Poppins'] text-lg sm:text-xl lg:text-2xl font-bold text-[#5B8C3E]">₹{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-6 flex items-center">
                <i className="fas fa-credit-card mr-3 text-[#7BAD50] text-base sm:text-lg"></i>
                Payment Info
              </h2>
              
              <div className="bg-white/50 rounded-xl p-4 sm:p-5 border border-white/60">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-money-bill-wave text-white text-sm sm:text-base"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-['Poppins'] font-semibold text-[#1F2937] text-sm sm:text-base mb-1">
                      {order.payment_method || 'Cash on Delivery'}
                    </p>
                    <p className="font-['Poppins'] text-xs sm:text-sm text-gray-600">
                      {order.payment_status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-6 flex items-center">
                <i className="fas fa-cogs mr-3 text-[#AECB95] text-base sm:text-lg"></i>
                Actions
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {order.status === 'pending' && (
                  <button 
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    className="w-full flex items-center justify-center px-4 py-3 sm:py-4 bg-white/80 border border-red-200 text-red-600 font-['Poppins'] font-medium rounded-xl hover:bg-red-50 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed group touch-manipulation"
                  >
                    {cancelLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mr-2"></div>
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times mr-2 group-hover:scale-110 transition-transform duration-200 text-sm sm:text-base"></i>
                        <span>Cancel Order</span>
                      </>
                    )}
                  </button>
                )}
                
                <Link 
                  to={`/orders/${order.order_id}/invoice`}
                  className="w-full flex items-center justify-center px-4 py-3 sm:py-4 bg-gradient-to-r from-[#7BAD50] to-[#AECB95] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base group touch-manipulation"
                >
                  <i className="fas fa-file-invoice mr-2 group-hover:scale-110 transition-transform duration-200 text-sm sm:text-base"></i>
                  <span>Download Invoice</span>
                </Link>
                
                <Link 
                  to="/shop"
                  className="w-full flex items-center justify-center px-4 py-3 sm:py-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base group touch-manipulation"
                >
                  <i className="fas fa-shopping-cart mr-2 group-hover:scale-110 transition-transform duration-200 text-sm sm:text-base"></i>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 