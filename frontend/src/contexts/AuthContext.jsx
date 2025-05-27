import React, { createContext, useState, useEffect, useCallback } from 'react';
// import axiosInstance from '../api/axiosInstance'; // Use our configured Axios
import { loginUserApi, registerUserApi, getMeApi } from '../api/authApi'; // We'll create these API calls

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state for checking auth
  const [error, setError] = useState(null); // For login/register errors

  const setAuthError = (errorMessage) => {
    setError(errorMessage);
    // Clear error after some time
    setTimeout(() => setError(null), 5000);
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        setLoading(true);
        const response = await getMeApi(); // API call to /auth/me
        setUser(response.data.data); // Assuming backend returns { success: true, data: user }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('authToken'); // Invalid token
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // No token, not loading
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginUserApi(credentials);
      localStorage.setItem('authToken', response.data.token);
      // Fetch user details after setting token to update Axios headers for the next call
      await fetchUser(); // This will set the user state
      setLoading(false);
      return true; // Indicate success
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      console.error('Login error:', err.response?.data || err.message);
      return false; // Indicate failure
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await registerUserApi(userData);
      // Optionally auto-login or prompt user to login
      setLoading(false);
      return true; // Indicate success
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      console.error('Registration error:', err.response?.data || err.message);
      return false; // Indicate failure
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Optionally redirect to home or login page using useNavigate if this context has router access
    // or handle redirection in the component calling logout.
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, fetchUser, setAuthError, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;