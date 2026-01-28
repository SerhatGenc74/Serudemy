import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/authHelpers';

// Zaten giriş yapmış kullanıcıları dashboard'a yönlendir
const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const dashboardPath = getDashboardPath(role);
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default PublicRoute;
