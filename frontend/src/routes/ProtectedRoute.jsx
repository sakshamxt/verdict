import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while authentication status is being checked
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Logged in, but role not allowed for this route
    // Redirect to an unauthorized page or home page
    // You might want to create a specific "Unauthorized" page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated and (no specific roles required OR user has an allowed role)
  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;