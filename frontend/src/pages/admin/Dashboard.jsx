import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminAPI';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    newUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#5B8C3E]/20 border-t-[#5B8C3E] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] pt-20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-['Poppins'] text-red-700 font-medium">Error loading dashboard: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            Admin Dashboard 🌿
          </h1>
          <p className="font-['Poppins'] text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor your business growth, manage orders, and nurture your organic marketplace
          </p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Revenue</p>
                <p className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-[#5B8C3E] mt-2">₹{stats.totalRevenue?.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-full"></div>
          </div>

          {/* Total Orders */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Orders</p>
                <p className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-[#7BAD50] mt-2">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#7BAD50] to-[#AECB95] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#7BAD50] to-[#AECB95] rounded-full"></div>
          </div>

          {/* Total Products */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Products</p>
                <p className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-[#AECB95] mt-2">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#AECB95] to-[#5B8C3E] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#AECB95] to-[#5B8C3E] rounded-full"></div>
          </div>

          {/* Total Users */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins'] text-sm font-medium text-gray-600 uppercase tracking-wide">Users</p>
                <p className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-[#5B8C3E] mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-[#5B8C3E] to-[#7BAD50] rounded-full"></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937] mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              to="/admin/products/create" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#5B8C3E] transition-colors duration-200">Add Product</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Create new product listing</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/orders" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7BAD50] to-[#AECB95] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#7BAD50] transition-colors duration-200">Manage Orders</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Process customer orders</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/users" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#AECB95] to-[#5B8C3E] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#AECB95] transition-colors duration-200">View Users</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Manage customer accounts</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/tax-management" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B8C3E] to-[#AECB95] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#5B8C3E] transition-colors duration-200">Tax Settings</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Configure GST & HSN codes</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/blog" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7BAD50] to-[#5B8C3E] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#7BAD50] transition-colors duration-200">Blog Posts</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Manage content & articles</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/contact-messages" 
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#AECB95] to-[#7BAD50] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F2937] group-hover:text-[#AECB95] transition-colors duration-200">Messages</h3>
                  <p className="font-['Poppins'] text-sm text-gray-600">Customer inquiries</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937]">Recent Activity</h2>
            <Link 
              to="/admin/orders" 
              className="font-['Poppins'] text-sm font-medium text-[#5B8C3E] hover:text-[#7BAD50] transition-colors duration-200"
            >
              View All Orders →
            </Link>
          </div>
          
          {stats.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order.order_id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/60 hover:bg-white/70 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5B8C3E] to-[#7BAD50] rounded-lg flex items-center justify-center">
                      <span className="font-['Poppins'] text-white text-sm font-bold">#{order.order_id}</span>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[#1F2937]">Order #{order.order_id}</p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {order.user_name || 'Customer'} • {new Date(order.order_date).toLocaleDateString()}
                      </p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-['Poppins'] text-gray-600">No recent orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 