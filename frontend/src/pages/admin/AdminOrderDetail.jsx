import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../../services/adminAPI';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await getOrder(orderId);
      setOrder(data.data.order);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status, adminNotes = '') => {
    setStatusUpdateLoading(true);
    try {
      await updateOrderStatus(orderId, status, adminNotes);
      await fetchOrderDetails(); // Refresh order data
      setShowNotesModal(false);
      setNotes('');
      alert(`Order status updated to ${status}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status: ' + err.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        icon: '⏳',
        label: 'Pending'
      },
      processing: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        icon: '⚙️',
        label: 'Processing'
      },
      shipped: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-800',
        icon: '🚚',
        label: 'Shipped'
      },
      delivered: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        icon: '✅',
        label: 'Delivered'
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        icon: '❌',
        label: 'Cancelled'
      }
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '₹0.00' : `₹${numPrice.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
        <p className="text-gray-500">The order you're looking for doesn't exist.</p>
        <Link to="/admin/orders" className="mt-4 inline-block text-green-600 hover:text-green-900">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link 
            to="/admin/orders" 
            className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Orders</span>
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Order #{order.order_id}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.order_date)} by {order.user_name}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${statusConfig.bg} ${statusConfig.text}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </span>
            <Link
              to={`/order-details/${order.order_id}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Customer View
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-2xl">🌱</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name || item.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </p>
                        {item.category_name && (
                          <p className="text-xs text-gray-500">Category: {item.category_name}</p>
                        )}
                        {item.hsn_code && (
                          <p className="text-xs text-gray-500">HSN: {item.hsn_code}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      {item.tax_amount && parseFloat(item.tax_amount) > 0 && (
                        <p className="text-xs text-gray-500">
                          +{formatPrice(item.tax_amount)} tax
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customer & Shipping Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Customer Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {order.user_name}</p>
                  <p><span className="font-medium">Email:</span> {order.user_email}</p>
                  <p><span className="font-medium">User ID:</span> #{order.user_id}</p>
                  <Link 
                    to={`/admin/users/${order.user_id}`}
                    className="inline-block text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    View Customer Profile →
                  </Link>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                {order.address_line ? (
                  <div className="space-y-1 text-sm">
                    <p>{order.address_line}</p>
                    <p>{order.city}, {order.state} {order.zip_code}</p>
                    {order.country && <p>{order.country}</p>}
                    {order.phone_number && (
                      <p className="flex items-center space-x-1 mt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{order.phone_number}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No shipping address available</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Timeline (if you have order history/notes) */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📝</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
                    <p className="text-sm text-gray-500">Order was successfully placed by customer</p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm">⚙️</span>
                    </div>
                    <div>
                      <p className="font-medium">Order {order.status}</p>
                      <p className="text-sm text-gray-600">Status updated</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Order Summary */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal || order.total_price)}</span>
                </div>
                
                {order.total_tax && parseFloat(order.total_tax) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="font-medium">{formatPrice(order.total_tax)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.payment_method || 'Cash on Delivery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium">{order.payment_status || 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Admin Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {/* Status Update Buttons */}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('processing')}
                    disabled={statusUpdateLoading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
                  >
                    Mark as Processing
                  </button>
                )}
                
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={statusUpdateLoading}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md font-medium transition-colors"
                  >
                    Mark as Shipped
                  </button>
                )}
                
                {order.status === 'shipped' && (
                  <button
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={statusUpdateLoading}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md font-medium transition-colors"
                  >
                    Mark as Delivered
                  </button>
                )}

                {/* Custom Status Update */}
                <button
                  onClick={() => setShowNotesModal(true)}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                >
                  Update Status with Notes
                </button>

                {/* Download Invoice */}
                <Link
                  to={`/orders/${order.order_id}/invoice/pdf`}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
                  target="_blank"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Invoice</span>
                </Link>

                {/* Cancel Order (if pending) */}
                {order.status === 'pending' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this order?')) {
                        handleStatusUpdate('cancelled');
                      }
                    }}
                    disabled={statusUpdateLoading}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md font-medium transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Add notes about this status update..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => newStatus && handleStatusUpdate(newStatus, notes)}
                disabled={!newStatus || statusUpdateLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md"
              >
                {statusUpdateLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail; 