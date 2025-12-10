import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session & token
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    const init = async () => {
      if (storedUser && token) {
        // If we have a token, refresh user info from backend to ensure role is accurate
        try {
          const fresh = await authAPI.me();
          const userData = {
            id: fresh.id,
            email: fresh.email,
            name: fresh.first_name && fresh.last_name ? `${fresh.first_name} ${fresh.last_name}` : fresh.email,
            role: (fresh.role || '').toLowerCase(),
            first_name: fresh.first_name,
            last_name: fresh.last_name,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } catch (err) {
          // Fallback to stored user if the me call fails
          try {
            const parsed = JSON.parse(storedUser);
            // Ensure role is normalized to lowercase to avoid case-mismatch issues
            parsed.role = (parsed.role || '').toLowerCase();
            console.debug('AuthContext.me() failed; using stored user fallback with normalized role:', parsed.role);
            setUser(parsed);
          } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const login = async (credentials) => {
    try {
      // Call backend API for authentication
      const data = await authAPI.login(credentials);

      // Backend should return: access token, refresh token, and user info
      localStorage.setItem('token', data.access);
      
      // Store user info from backend response
      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || credentials.email,
        name: data.user?.first_name && data.user?.last_name 
          ? `${data.user.first_name} ${data.user.last_name}`
          : data.user?.email,
        role: (data.user?.role || data.role || '').toLowerCase(), // normalize to lowercase
        first_name: data.user?.first_name,
        last_name: data.user?.last_name,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response || error.message);
      
      let errorMsg = 'Login failed. Please check your credentials.';
      
      // Check for various error response formats from backend
      if (error.response?.data) {
        // Check for 'error' field (from custom validation)
        if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
        // Check for detail field
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        }
        // Check for non_field_errors (DRF standard)
        else if (Array.isArray(error.response.data.non_field_errors)) {
          errorMsg = error.response.data.non_field_errors[0];
        }
        // Check if it's a field-level error object
        else if (typeof error.response.data === 'object') {
          const firstError = Object.values(error.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMsg = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMsg = firstError;
          }
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      return { success: false, error: errorMsg };
    }
  };

  const register = async (credentials) => {
    try {
      // Call backend API to register
      const data = await authAPI.register(credentials);
      
      // Registration usually doesn't auto-login, so return success message
      return { success: true, message: 'Registration successful. Please log in.' };
    } catch (error) {
      console.error('Registration failed:', error.response || error.message);
      const errorMsg = error.response?.data?.detail || 
                      error.response?.data?.email?.[0] ||
                      error.response?.data?.non_field_errors?.[0] ||
                      error.message ||
                      'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    // Call backend logout API if needed
    authAPI.logout();
    
    // Clear local storage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
