const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { key: 'dashboard', icon: '📊', label: 'Dashboard' },
        { key: 'courses', icon: '📚', label: 'Kurslar' },
        { key: 'users', icon: '👥', label: 'Kullanıcılar' },
        { key: 'lectures', icon: '🎥', label: 'Videolar' },
        { key: 'enrollments', icon: '📈', label: 'Kayıtlar' }
    ];

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                <h2>Serudemy Admin</h2>
            </div>
            
            <nav className="admin-nav">
                {navItems.map((item) => (
                    <button 
                        key={item.key}
                        className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.key)}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;