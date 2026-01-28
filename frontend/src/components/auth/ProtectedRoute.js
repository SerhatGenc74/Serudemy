import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/authHelpers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  // Auth durumu yüklenirken loading göster
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Kullanıcı oturum açmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol kontrolü varsa ve kullanıcının rolü izin verilenler arasında değilse
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = role?.toLowerCase();
    const hasAccess = allowedRoles.some(r => r.toLowerCase() === userRole);

    if (!hasAccess) {
      // Kullanıcıyı kendi dashboard'una yönlendir
      const userDashboard = getDashboardPath(role);
      return <Navigate to={userDashboard} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
