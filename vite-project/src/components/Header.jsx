import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header() {
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && token;
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully!');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold m-0 tracking-tight">🛍️ Kathir's Shop</h1>
        <nav className="flex gap-8 items-center">
          <Link to="/" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">Home</Link>
          <Link to="/products" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">Products</Link>
          <Link to="/cart" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110 relative">
            Cart
          </Link>
          {isLoggedIn && <Link to="/orders" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">Orders</Link>}
          {isLoggedIn && user?.email === 'admin@example.com' && (
            <Link to="/admin" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">👑 Admin</Link>
          )}
          {isLoggedIn && user?.email !== 'admin@example.com' && (
            <Link to="/user" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">👤 Dashboard</Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="text-white hover:text-yellow-300 transition-all font-medium hover:scale-110">Register</Link>
              <Link to="/login" className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105">Login</Link>
            </>
          ) : (
            <>
              <span className="text-white text-sm">Welcome, {user?.name || user?.email}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
