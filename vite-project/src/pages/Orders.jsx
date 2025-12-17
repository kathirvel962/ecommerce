import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4">
        <h1 className="text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📦 My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-6">No orders yet</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-purple-200">
                  <div>
                    <h3 className="text-3xl font-extrabold mb-2 text-purple-700">Order #{order.id}</h3>
                    <p className="text-sm text-purple-500 font-semibold">Date: {formatDate(order.createdAt)}</p>
                    {order.shippingAddress && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p className="font-semibold">Shipping to:</p>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={`px-6 py-3 rounded-full text-white text-sm font-bold shadow-lg ${
                      order.status === 'delivered' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                      order.status === 'shipped' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                      'bg-gradient-to-r from-yellow-500 to-orange-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 my-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="font-semibold text-gray-800">{item.productName}</span>
                      <span className="text-purple-600 font-bold">Qty: {item.quantity}</span>
                      <span className="text-purple-700 font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-6 pt-6 border-t-2 border-purple-200">
                  <strong className="text-3xl text-purple-600 font-extrabold">Total: ₹{order.total.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
