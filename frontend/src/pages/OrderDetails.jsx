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
          <div className="w-8 h-8 border-3 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Poppins'] text-sm text-gray-600">Loading order details...</p>
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
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] mb-2">Order Not Found</h3>
            <p className="font-['Poppins'] text-sm text-red-600 mb-6">{error}</p>
            <Link 
              to="/orders" 
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
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
    <div className="min-h-screen bg-[#f8f6f3] pt-16 sm:pt-20 lg:pt-24 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link 
            to="/orders" 
            className="inline-flex items-center text-[#5B8C3E] hover:text-[#7BAD50] transition-colors duration-200 mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            <span className="font-['Poppins'] text-sm font-medium">Back to Orders</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2">
                Order Details
              </h1>
              <p className="font-['Poppins'] text-sm text-gray-600">
                Order #{order.order_id} • Placed on {formatDate(order.order_date)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`font-['Poppins'] px-3 py-2 rounded-full text-sm font-medium flex items-center ${statusConfig.bg} ${statusConfig.text}`}>
                <i className={`${statusConfig.icon} mr-2`}></i>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6 flex items-center">
                <i className="fas fa-box mr-3 text-[#5B8C3E]"></i>
                Order Items ({order.items?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/60 hover:bg-white/70 transition-all duration-200">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-leaf text-white"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-['Poppins'] font-semibold text-[#1F2937] truncate text-sm sm:text-base">
                          {item.name || item.product_name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                          <p className="font-['Poppins'] text-xs sm:text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-['Poppins'] text-xs sm:text-sm text-gray-600">
                            Price per item: ₹{formatPrice(item.price)}
                          </p>
                          {item.hsn_code && (
                            <p className="font-['Poppins'] text-xs text-gray-500">
                              HSN: {item.hsn_code}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-['Poppins'] text-lg font-bold text-[#5B8C3E]">
                        ₹{formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      {item.tax_amount && parseFloat(item.tax_amount) > 0 && (
                        <p className="font-['Poppins'] text-xs text-gray-500">
                          +₹{formatPrice(item.tax_amount)} tax
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6 flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-[#7BAD50]"></i>
                Shipping Address
              </h2>
              
              {order.address_line ? (
                <div className="bg-white/50 rounded-xl p-4 border border-white/60">
                  <div className="space-y-2">
                    <p className="font-['Poppins'] font-medium text-[#1F2937]">{order.address_line}</p>
                    <p className="font-['Poppins'] text-sm text-gray-600">
                      {order.city}, {order.state} {order.zip_code}
                    </p>
                    {order.country && (
                      <p className="font-['Poppins'] text-sm text-gray-600">{order.country}</p>
                    )}
                    {order.phone_number && (
                      <p className="font-['Poppins'] text-sm text-gray-600 flex items-center">
                        <i className="fas fa-phone mr-2 text-[#5B8C3E]"></i>
                        {order.phone_number}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="font-['Poppins'] text-sm text-gray-500 italic">No shipping address available</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6 flex items-center">
                <i className="fas fa-calculator mr-3 text-[#AECB95]"></i>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-['Poppins'] text-gray-600">Subtotal</span>
                  <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.subtotal || order.total_price)}</span>
                </div>
                
                {order.total_tax && parseFloat(order.total_tax) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-['Poppins'] text-gray-600">Tax (GST)</span>
                    <span className="font-['Poppins'] font-medium text-[#1F2937]">₹{formatPrice(order.total_tax)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="font-['Poppins'] text-gray-600">Shipping</span>
                  <span className="font-['Poppins'] font-medium text-[#5B8C3E]">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-['Poppins'] text-lg font-bold text-[#1F2937]">Total</span>
                    <span className="font-['Poppins'] text-2xl font-bold text-[#5B8C3E]">₹{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6 flex items-center">
                <i className="fas fa-credit-card mr-3 text-[#7BAD50]"></i>
                Payment Info
              </h2>
              
              <div className="bg-white/50 rounded-xl p-4 border border-white/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-lg flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-white"></i>
                  </div>
                  <div>
                    <p className="font-['Poppins'] font-medium text-[#1F2937]">
                      {order.payment_method || 'Cash on Delivery'}
                    </p>
                    <p className="font-['Poppins'] text-sm text-gray-600">
                      {order.payment_status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6 flex items-center">
                <i className="fas fa-cogs mr-3 text-[#AECB95]"></i>
                Actions
              </h2>
              
              <div className="space-y-3">
                {order.status === 'pending' && (
                  <button 
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white/80 border border-red-200 text-red-600 font-['Poppins'] font-medium rounded-xl hover:bg-red-50 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {cancelLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times mr-2 group-hover:scale-110 transition-transform duration-200"></i>
                        Cancel Order
                      </>
                    )}
                  </button>
                )}
                
                <Link 
                  to={`/orders/${order.order_id}/invoice`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#7BAD50] to-[#AECB95] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm group"
                >
                  <i className="fas fa-file-invoice mr-2 group-hover:scale-110 transition-transform duration-200"></i>
                  Download Invoice
                </Link>
                
                <Link 
                  to="/shop"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 text-sm group"
                >
                  <i className="fas fa-shopping-cart mr-2 group-hover:scale-110 transition-transform duration-200"></i>
                  Continue Shopping
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