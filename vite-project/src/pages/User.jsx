import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function User() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    if (!isLoggedIn || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Mock orders data - replace with actual API call
    const mockOrders = [
      {
        id: '1',
        date: '2025-12-10',
        status: 'Delivered',
        total: 1299,
        items: 2
      },
      {
        id: '2',
        date: '2025-12-13',
        status: 'Pending',
        total: 499,
        items: 1
      },
      {
        id: '3',
        date: '2025-12-14',
        status: 'Shipped',
        total: 899,
        items: 3
      }
    ];
    
    setOrders(mockOrders);
    
    // Calculate stats
    const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = mockOrders.filter(order => order.status === 'Pending').length;
    
    setStats({
      totalOrders: mockOrders.length,
      totalSpent,
      pendingOrders
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4 w-full">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            👤 User Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Welcome back, <span className="font-bold text-purple-600">{user.name || user.email}</span>!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <div className="text-purple-100">Total Orders</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold">₹{stats.totalSpent}</div>
            <div className="text-pink-100">Total Spent</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            <div className="text-orange-100">Pending Orders</div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-purple-600">👤 Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-semibold w-32">Name:</span>
              <span className="text-gray-800">{user.name || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-semibold w-32">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-semibold w-32">Member Since:</span>
              <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all">
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-purple-600">📋 Recent Orders</h2>
            <Link 
              to="/orders" 
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-xl">No orders yet</p>
              <Link 
                to="/products" 
                className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Date</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Items</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Total</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-purple-100 hover:bg-purple-50">
                      <td className="py-4 px-4 font-semibold">#{order.id}</td>
                      <td className="py-4 px-4">{order.date}</td>
                      <td className="py-4 px-4">{order.items}</td>
                      <td className="py-4 px-4 font-bold text-purple-600">₹{order.total}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-purple-600 hover:text-purple-800 font-semibold">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link 
            to="/products" 
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-3">🛍️</div>
            <h3 className="text-xl font-bold">Browse Products</h3>
          </Link>
          
          <Link 
            to="/cart" 
            className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-3">🛒</div>
            <h3 className="text-xl font-bold">View Cart</h3>
          </Link>
          
          <Link 
            to="/orders" 
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-3">📦</div>
            <h3 className="text-xl font-bold">My Orders</h3>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default User;
