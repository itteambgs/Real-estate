import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token'); // Check if user is logged in
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
