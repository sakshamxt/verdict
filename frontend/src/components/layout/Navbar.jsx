import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FilmIcon, UserCircleIcon, CogIcon, ArrowLeftStartOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // For solid icons, use /24/solid

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = "text-slate-300 hover:text-accent transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium";
  const mobileNavLinkClasses = "block text-slate-300 hover:bg-slate-700 hover:text-accent px-3 py-2 rounded-md text-base font-medium transition-colors duration-200";

  return (
    <nav className="bg-secondary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors">
            <FilmIcon className="h-8 w-8" />
            <span className="font-bold text-xl text-text-primary">MovieVerse</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={navLinkClasses}>Home</Link>
            <Link to="/movies" className={navLinkClasses}>Movies</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className={navLinkClasses}>
                    <CogIcon className="inline h-5 w-5 mr-1" /> Admin
                  </Link>
                )}
                <span className="text-slate-400 px-3 py-2 text-sm">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className={`${navLinkClasses} flex items-center bg-red-600 hover:bg-red-700 text-white`}
                >
                  <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClasses}>Login</Link>
                <Link
                  to="/register"
                  className="bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-accent focus:outline-none p-2"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary pb-3">
          <Link to="/" className={mobileNavLinkClasses} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/movies" className={mobileNavLinkClasses} onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className={mobileNavLinkClasses} onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <div className="px-3 py-2 text-slate-400 text-base font-medium">Hi, {user?.name}</div>
              <button
                onClick={handleLogout}
                className={`${mobileNavLinkClasses} w-full text-left bg-red-600 hover:bg-red-700 text-white`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={mobileNavLinkClasses} onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className={mobileNavLinkClasses} onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;