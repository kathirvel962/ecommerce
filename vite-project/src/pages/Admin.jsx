import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Admin() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user?.isAdmin) {
      navigate('/');
      return;
    }
    
    fetchProducts();
    // Mock stats - replace with actual API calls
    setStats({
      totalProducts: 25,
      totalUsers: 150,
      totalOrders: 89,
      totalRevenue: 125000
    });
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data);
      setStats(prev => ({ ...prev, totalProducts: data.length }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.warning('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image || 'https://via.placeholder.com/400x300'
        })
      });

      if (response.ok) {
        toast.success('Product added successfully to database! ✅');
        setFormData({ name: '', price: '', category: '', image: '' });
        fetchProducts();
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    }
  };
const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Product deleted successfully! 🗑️');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4 w-full">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            👑 Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-purple-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'text-purple-600 border-b-4 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'add-product'
                ? 'text-purple-600 border-b-4 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'manage-products'
                ? 'text-purple-600 border-b-4 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            📦 Manage Products
          </button>
        </div>

        {/* Manage Products Tab */}
        {activeTab === 'manage-products' && (
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">📦 All Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-xl">No products available</p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-purple-200">
                      <th className="text-left py-3 px-4 font-bold text-purple-600">Image</th>
                      <th className="text-left py-3 px-4 font-bold text-purple-600">Name</th>
                      <th className="text-left py-3 px-4 font-bold text-purple-600">Category</th>
                      <th className="text-left py-3 px-4 font-bold text-purple-600">Price</th>
                      <th className="text-left py-3 px-4 font-bold text-purple-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-purple-100 hover:bg-purple-50">
                        <td className="py-4 px-4">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-4 px-4 font-semibold">{product.name}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-purple-600">₹{product.price}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-bold">{stats.totalProducts}</div>
                <div className="text-purple-100">Total Products</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-blue-100">Total Users</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-2">🛒</div>
                <div className="text-3xl font-bold">{stats.totalOrders}</div>
                <div className="text-green-100">Total Orders</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold">₹{stats.totalRevenue}</div>
                <div className="text-orange-100">Total Revenue</div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-purple-600">📈 Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">New order received</p>
                    <p className="text-sm text-gray-600">Order #12345 - ₹1,299</p>
                  </div>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">New user registered</p>
                    <p className="text-sm text-gray-600">user@example.com</p>
                  </div>
                  <span className="text-gray-500 text-sm">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">Product updated</p>
                    <p className="text-sm text-gray-600">Laptop - Stock updated</p>
                  </div>
                  <span className="text-gray-500 text-sm">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl p-10 border-2 border-purple-300 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">👑 Admin Panel</h2>
              <h2 className="text-2xl text-center mb-10 text-purple-600 font-semibold">Add New Product</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-4 text-base border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="p-4 text-base border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="p-4 text-base border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="p-4 text-base border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Enter image URL (optional)"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full text-lg font-bold mt-6 shadow-xl hover:scale-105 transition-all">
                  ✨ Add Product
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Admin;
