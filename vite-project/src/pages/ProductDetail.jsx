import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:3000/cart', {
        productId: product.id,
        quantity: 1
      });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto my-8 px-4">
        <button 
          onClick={() => navigate('/products')}
          className="mb-6 px-6 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full font-semibold transition-all"
        >
          ← Back to Products
        </button>
        
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
          <div className="overflow-hidden rounded-2xl">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
                {product.category}
              </span>
              <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                {product.name}
              </h1>
              <p className="text-4xl text-purple-600 font-extrabold mb-6">
                ₹{product.price}
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={addToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                🛒 Add to Cart
              </button>
              
              <button 
                onClick={() => navigate('/cart')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Go to Cart
              </button>
            </div>
            
            {product.createdAt && (
              <p className="text-sm text-gray-500 pt-4">
                Added on {new Date(product.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetail;
