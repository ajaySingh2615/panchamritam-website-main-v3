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
            <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
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
                <i className="fas fa-rupee-sign text-white text-xl"></i>
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
                <i className="fas fa-shopping-bag text-white text-xl"></i>
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
                <i className="fas fa-box text-white text-xl"></i>
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
                <i className="fas fa-users text-white text-xl"></i>
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
                  <i className="fas fa-plus text-white text-xl"></i>
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
                  <i className="fas fa-clipboard-list text-white text-xl"></i>
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
                  <i className="fas fa-users text-white text-xl"></i>
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
                  <i className="fas fa-calculator text-white text-xl"></i>
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
                  <i className="fas fa-edit text-white text-xl"></i>
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
                  <i className="fas fa-comments text-white text-xl"></i>
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
                <i className="fas fa-clipboard-list text-white text-2xl"></i>
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