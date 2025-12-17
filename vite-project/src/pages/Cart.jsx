import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        fetch('http://localhost:3000/cart'),
        fetch('http://localhost:3000/products')
      ]);
      
      const cart = await cartRes.json();
      const allProducts = await productsRes.json();
      
      // Create product lookup map
      const productMap = {};
      allProducts.forEach(p => productMap[p.id] = p);
      setProducts(productMap);
      setCartItems(cart);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart. Please try again.');
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await fetch(`http://localhost:3000/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      toast.success('Quantity updated successfully');
      fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (index) => {
    if (!confirm('Are you sure you want to remove this item from cart?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/cart/${index}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Item removed from cart successfully');
        fetchCart();
      } else {
        const error = await response.json();
        toast.error('Failed to remove item: ' + error.message);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login to place an order');
      navigate('/login');
      return;
    }
    
    setShowCheckout(true);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      toast.warning('Please fill in all shipping details');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.info('Please login to place order');
        navigate('/login');
        return;
      }

      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        productName: products[item.productId]?.name,
        price: products[item.productId]?.price,
        quantity: item.quantity
      }));

      console.log('Placing order with:', {
        items: orderItems,
        total: getTotal(),
        shippingAddress
      });
      
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          total: getTotal(),
          shippingAddress
        })
      });
      
      console.log('Order response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order placed:', data);
        toast.success('🎉 Order placed successfully!');
        setCartItems([]);
        setShowCheckout(false);
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        const error = await response.json();
        console.error('Order failed:', error);
        toast.error('Failed to place order: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading cart...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4">
        <h1 className="text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🛒 Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-12">Your cart is empty</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cartItems.map((item, index) => {
                const product = products[item.productId];
                if (!product) return null;
                
                return (
                <div key={index} className="flex items-center gap-4 p-6 bg-white border-2 border-purple-200 rounded-2xl hover:shadow-xl transition-all">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-purple-600 font-semibold">₹{product.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-bold shadow-lg"
                    >
                      -
                    </button>
                    <span className="text-xl min-w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-bold shadow-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-2xl font-extrabold text-purple-600 min-w-24 text-right">
                    ₹{(product.price * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => removeItem(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold shadow-lg transition-all"
                  >
                    Remove
                  </button>
                </div>
                );
              })}
            </div>
            <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-2xl shadow-xl">
              <h2 className="text-4xl font-extrabold mb-6 text-purple-700 text-right">Total: ₹{getTotal().toFixed(2)}</h2>
              
              {!showCheckout ? (
                <div className="text-right">
                  <button onClick={handleCheckout} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-all">
                    🚀 Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl border-2 border-purple-300">
                  <h3 className="text-2xl font-bold mb-4 text-purple-600">📦 Shipping Details</h3>
                  <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter PIN code"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-2">Address *</label>
                      <textarea
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter your complete address"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all"
                      >
                        ← Back to Cart
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-all"
                      >
                        🎉 Place Order
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
