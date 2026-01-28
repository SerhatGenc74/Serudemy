import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api';
import { getUserFromToken, isTokenValid, getDashboardPath } from '../utils/authHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Token değiştiğinde kullanıcı bilgilerini güncelle
  useEffect(() => {
    if (token && isTokenValid(token)) {
      const userData = getUserFromToken(token);
      setUser(userData);
    } else {
      setUser(null);
      if (token) {
        // Geçersiz token'ı temizle
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Giriş yap
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log('Auth service response:', response);
      
      const token = response.token || response.accessToken;
      
      if (response.success && token) {
        localStorage.setItem('token', token);
        setToken(token);
        
        const userData = getUserFromToken(token);
        console.log('User data from token:', userData);
        setUser(userData);
        
        const redirectPath = getDashboardPath(userData?.role);
        console.log('Redirect path:', redirectPath);
        
        return {
          success: true,
          user: userData,
          redirectPath: redirectPath
        };
      }
      
      return {
        success: false,
        message: response.message || 'Giriş başarısız'
      };
    } catch (error) {
      console.error('Login error in context:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Giriş sırasında bir hata oluştu'
      };
    }
  };

  // Çıkış yap
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  // Kullanıcının belirtilen role sahip olup olmadığını kontrol et
  const hasRole = (requiredRole) => {
    if (!user?.role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => role.toLowerCase() === user.role.toLowerCase());
    }
    
    return user.role.toLowerCase() === requiredRole.toLowerCase();
  };

  // Kullanıcı oturum açmış mı?
  const isAuthenticated = !!user && !!token && isTokenValid(token);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    role: user?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
