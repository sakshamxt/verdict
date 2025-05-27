import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/ui/LoadingSpinner'; // For route-level suspense

// Public Pages (Code-splitting with React.lazy)
const HomePage = lazy(() => import('../pages/public/HomePage'));
const MovieListingsPage = lazy(() => import('../pages/public/MovieListingsPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage')); // Create this page

// Admin Pages (Code-splitting)
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminMoviesPage = lazy(() => import('../pages/admin/AdminMoviesPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminReviewsPage = lazy(() => import('../pages/admin/AdminReviewsPage'));


const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner size="xl" /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MovieListingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - Protected */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}> {/* AdminLayout wraps admin pages */}
            <Route index element={<AdminDashboardPage />} /> {/* Default admin page */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="movies" element={<AdminMoviesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            {/* Add more admin sub-routes here */}
          </Route>
        </Route>

        {/* Example of a route only for logged-in users (any role) */}
        {/*
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
        */}

        {/* Not Found Route - Should be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;