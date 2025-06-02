import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Dashboard() {
  const { user, logout, loading } = useAuth();
  const { getCartCount } = useCart();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    recentOrders: [],
    accountStatus: 'Verified'
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin"></div>
      </div>
    );
  }

  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            Welcome back, {user?.name?.split(' ')[0]} 🌿
          </h1>
          <p className="font-['Poppins'] text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your orders, track your garden journey, and discover new organic treasures
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Orders */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Total Orders</p>
                <p className="font-['Playfair_Display'] text-3xl font-bold text-[#5B8C3E] mt-2">{dashboardData.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-full"></div>
          </div>

          {/* Wishlist Items */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Wishlist</p>
                <p className="font-['Playfair_Display'] text-3xl font-bold text-[#7BAD50] mt-2">{dashboardData.wishlistItems}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#7BAD50] to-[#AECB95] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#7BAD50] to-[#AECB95] rounded-full"></div>
          </div>

          {/* Cart Items */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Cart Items</p>
                <p className="font-['Playfair_Display'] text-3xl font-bold text-[#AECB95] mt-2">{cartCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#AECB95] to-[#5B8C3E] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#AECB95] to-[#5B8C3E] rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937]">Recent Orders</h2>
                <Link 
                  to="/orders" 
                  className="font-['Poppins'] text-sm font-medium text-[#5B8C3E] hover:text-[#7BAD50] transition-colors duration-200"
                >
                  View All →
                </Link>
              </div>
              
              {dataLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : dashboardData.recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentOrders.slice(0, 3).map((order) => (
                    <div key={order.order_id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/60 hover:bg-white/70 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-lg flex items-center justify-center">
                          <span className="font-['Poppins'] text-white text-sm font-bold">#{order.order_id}</span>
                        </div>
                        <div>
                          <p className="font-['Poppins'] font-semibold text-[#1F2937]">Order #{order.order_id}</p>
                          <p className="font-['Poppins'] text-sm text-gray-600">{new Date(order.order_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-['Poppins'] px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                        <p className="font-['Playfair_Display'] font-bold text-[#5B8C3E]">₹{order.total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="font-['Poppins'] text-gray-600 mb-4">No orders yet</p>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white font-['Poppins'] font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Start Shopping 🌱
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937] mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/shop" 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="font-['Poppins'] font-medium">Browse Products</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link 
                  to="/orders" 
                  className="flex items-center justify-between p-4 bg-white/80 border border-[#5B8C3E]/20 text-[#5B8C3E] rounded-xl hover:bg-[#5B8C3E] hover:text-white transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="font-['Poppins'] font-medium">Track Orders</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link 
                  to="/cart" 
                  className="flex items-center justify-between p-4 bg-white/80 border border-[#7BAD50]/20 text-[#7BAD50] rounded-xl hover:bg-[#7BAD50] hover:text-white transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="font-['Poppins'] font-medium">View Cart</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-between p-4 bg-white/80 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="font-['Poppins'] font-medium">Sign Out</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] mb-4">Account Status</h3>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-['Poppins'] text-sm text-gray-600">{dashboardData.accountStatus}</span>
              </div>
              <p className="font-['Poppins'] text-xs text-gray-500 mt-2">Your account is active and verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 