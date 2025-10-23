const WelcomeSection = ({ enrolledCoursesCount }) => {
    return (
        <div className="welcome-section">
            <h1 className="welcome-title">👋 Hoşgeldin!</h1>
            <p className="welcome-subtitle">Öğrenme yolculuğuna devam et</p>
            
            <div className="student-stats">
                <div className="stat-card">
                    <div className="stat-number">{enrolledCoursesCount || 0}</div>
                    <div className="stat-label">Kayıtlı Kurs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Tamamlanan</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Toplam Saat</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">75%</div>
                    <div className="stat-label">Ortalama İlerleme</div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;