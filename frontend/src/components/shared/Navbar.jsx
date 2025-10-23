import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Navbar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp > currentTime) {
                    setIsLoggedIn(true);
                    setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                    setUserName(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'Kullanıcı');
                } else {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            }
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole('');
        setUserName('');
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Navigation items based on user role
    const getNavigationItems = () => {
        const commonItems = [
            { path: '/', label: '🏠 Ana Sayfa', roles: ['all'] },
            { path: '/courses', label: '📚 Kurslar', roles: ['all'] }
        ];

        if (!isLoggedIn) {
            return [
                ...commonItems,
                { path: '/login', label: '🔐 Giriş Yap', roles: ['guest'] },
                { path: '/register', label: '📝 Kayıt Ol', roles: ['guest'] }
            ];
        }

        const loggedInItems = [
            ...commonItems,
            { path: '/profile', label: '👤 Profil', roles: ['Student', 'Instructor', 'Admin'] }
        ];

        if (userRole === 'Admin') {
            loggedInItems.push({ path: '/admin', label: '⚙️ Yönetim', roles: ['Admin'] });
        }

        if (userRole === 'Teacher') {
            loggedInItems.push({ path: '/dashboard', label: '📊 Eğitmen Paneli', roles: ['Instructor'] });
        }

        if (userRole === 'Student') {
            loggedInItems.push({ path: '/courses?filter=my-courses', label: '📖 Kurslarım', roles: ['Student'] });
        }

        return loggedInItems;
    };

    const navigationItems = getNavigationItems();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <span className="brand-icon">🎓</span>
                        <span className="brand-text">Serudemy</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav desktop-nav">
                    {navigationItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* User Actions */}
                <div className="navbar-actions">
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <div className="user-info">
                                <span className="user-name">👋 {userName}</span>
                                <span className="user-role">{userRole}</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                🚪 Çıkış
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-btn login-btn">Giriş</Link>
                            <Link to="/register" className="auth-btn register-btn">Kayıt</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Menu"
                    >
                        <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-nav-content">
                    {navigationItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    
                    {isLoggedIn && (
                        <div className="mobile-user-actions">
                            <div className="mobile-user-info">
                                <span className="mobile-user-name">{userName}</span>
                                <span className="mobile-user-role">{userRole}</span>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="mobile-logout-btn"
                            >
                                🚪 Çıkış Yap
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;