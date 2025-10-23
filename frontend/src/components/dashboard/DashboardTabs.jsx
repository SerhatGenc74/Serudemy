const DashboardTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
            key: 'overview',
            icon: 'fas fa-chart-line',
            label: 'Genel Bakış'
        },
        {
            key: 'courses',
            icon: 'fas fa-graduation-cap',
            label: 'Kurslarım'
        },
        {
            key: 'students',
            icon: 'fas fa-users',
            label: 'Öğrenciler'
        },
        {
            key: 'analytics',
            icon: 'fas fa-chart-bar',
            label: 'Analitik'
        }
    ];

    return (
        <div className="dashboard-tabs">
            {tabs.map((tab) => (
                <button 
                    key={tab.key}
                    className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    <i className={tab.icon}></i>
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default DashboardTabs;