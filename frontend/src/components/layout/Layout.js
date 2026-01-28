import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Rol bazlı navigasyon menüsü
  const getNavItems = () => {
    const userRole = role?.toLowerCase();
    
    switch (userRole) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/admin/students', label: 'Öğrenci Yönetimi', icon: '👥' },
          { path: '/admin/courses', label: 'Kurslar', icon: '📚' },
        ];
      case 'instructor':
      case 'teacher':
        return [
          { path: '/instructor/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/instructor/courses', label: 'Kurslarım', icon: '📚' },
          { path: '/instructor/create-course', label: 'Yeni Kurs', icon: '➕' },
        ];
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/student/courses', label: 'Derslerim', icon: '📚' },
        ];
      default:
        console.log('Unknown role:', role);
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleDisplayName = () => {
    const userRole = role?.toLowerCase();
    switch (userRole) {
      case 'admin': return 'Yönetici';
      case 'instructor':
      case 'teacher': return 'Eğitmen';
      case 'student': return 'Öğrenci';
      default: return 'Kullanıcı';
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo"> Serudemy</h1>
          <p className="subtitle">Düzce Üniversitesi</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Kullanıcı'}</span>
              <span className="user-role">{getRoleDisplayName()}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
