import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post('http://localhost:3000/cart', {
        productId: product.id,
        quantity: 1
      });
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div className="text-center py-20">Loading products...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4">
        <h1 className="text-6xl font-extrabold mb-10 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🛍️ All Products</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white border-2 border-purple-200 rounded-2xl p-4 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-500">
              <div className="overflow-hidden rounded-xl mb-4">
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-800">{product.name}</h3>
              <p className="text-xs text-purple-500 font-semibold mb-2 uppercase">{product.category}</p>
              <p className="text-2xl text-purple-600 font-extrabold mb-3">₹{product.price}</p>
              <button 
                onClick={() => addToCart(product)} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full transition-all w-full text-sm font-bold shadow-lg hover:shadow-xl"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Products;
