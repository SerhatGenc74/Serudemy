const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            icon: "📖",
            title: "React Temelleri - Ders 3 tamamlandı",
            description: "Component'ler ve Props konusunu bitirdiniz",
            time: "2 saat önce"
        },
        {
            id: 2,
            icon: "🎯",
            title: "JavaScript Kursu %75 tamamlandı",
            description: "Sadece 3 ders kaldı!",
            time: "1 gün önce"
        },
        {
            id: 3,
            icon: "🏆",
            title: "İlk sertifikanızı kazandınız!",
            description: "HTML & CSS Temel Kurs sertifikası",
            time: "3 gün önce"
        }
    ];

    return (
        <div className="recent-activity">
            <h2 className="section-title">
                ⚡ Son Aktiviteler
            </h2>
            
            <ul className="activity-list">
                {activities.map((activity) => (
                    <li key={activity.id} className="activity-item">
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                            <div className="activity-title">{activity.title}</div>
                            <div className="activity-description">{activity.description}</div>
                        </div>
                        <div className="activity-time">{activity.time}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivity;