import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  const topProducts = [
    { id: 1, name: 'Laptop', price: 999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop' },
    { id: 2, name: 'Smartphone', price: 699, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' },
    { id: 3, name: 'Headphones', price: 199, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
  ];

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">Welcome to Kathir'Shop</h1>
            <p className="text-2xl mb-10 font-light"></p>
            <Link to="/products" className="inline-block bg-yellow-400 text-purple-900 px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-300  ">
            Shop Now
            </Link>
          </div>
        </section>

        {/* Top Products */}
        <section className="max-w-7xl mx-auto my-16 px-4">
          <h2 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🔥 Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {topProducts.map(product => (
              <div key={product.id} className="bg-white border-2 border-purple-200 rounded-2xl p-4 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-500">
                <div className="overflow-hidden rounded-xl mb-4">
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-2xl text-purple-600 font-extrabold mb-3">₹{product.price}</p>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full transition-all w-full text-sm font-bold shadow-lg hover:shadow-xl">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
