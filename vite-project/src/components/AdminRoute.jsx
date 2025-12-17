import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && token;
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
