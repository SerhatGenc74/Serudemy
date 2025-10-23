const StatsGrid = ({ mockStats }) => {
    const statsConfig = [
        {
            icon: "fas fa-graduation-cap",
            iconClass: "courses",
            value: mockStats.totalCourses,
            label: "Toplam Kurs",
            change: "+2 bu ay",
            changeType: "positive"
        },
        {
            icon: "fas fa-users",
            iconClass: "students",
            value: mockStats.totalStudents.toLocaleString(),
            label: "Toplam Öğrenci",
            change: "+156 bu ay",
            changeType: "positive"
        },
        {
            icon: "fas fa-lira-sign",
            iconClass: "revenue",
            value: `₺${mockStats.totalRevenue.toLocaleString()}`,
            label: "Toplam Kazanç",
            change: "+%12 bu ay",
            changeType: "positive"
        },
        {
            icon: "fas fa-star",
            iconClass: "rating",
            value: mockStats.averageRating,
            label: "Ortalama Puan",
            change: "+0.2 bu ay",
            changeType: "positive"
        }
    ];

    return (
        <div className="stats-grid">
            {statsConfig.map((stat, index) => (
                <div key={index} className="stat-card">
                    <div className={`stat-icon ${stat.iconClass}`}>
                        <i className={stat.icon}></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                        <span className={`stat-change ${stat.changeType}`}>{stat.change}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;