// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const { user } = useAuth();

  // If no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check if user's role is authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, allow access
  return <Outlet />;
};

export default ProtectedRoute;
