const Dashboard = ({ stats }) => (
        <div className="dashboard-content">
            <h2>Dashboard Özeti</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon courses">📚</div>
                    <div className="stat-info">
                        <h3>{stats.totalCourses}</h3>
                        <p>Toplam Kurs</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Toplam Kullanıcı</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon lectures">🎥</div>
                    <div className="stat-info">
                        <h3>{stats.totalLectures}</h3>
                        <p>Toplam Video</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon enrollments">📈</div>
                    <div className="stat-info">
                        <h3>{stats.totalEnrollments}</h3>
                        <p>Toplam Kayıt</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h3>Son Aktiviteler</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-icon">➕</span>
                        <span>Yeni kurs eklendi</span>
                        <span className="activity-time">2 saat önce</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">👤</span>
                        <span>Yeni kullanıcı kaydı</span>
                        <span className="activity-time">4 saat önce</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">🎓</span>
                        <span>Kurs tamamlandı</span>
                        <span className="activity-time">1 gün önce</span>
                    </div>
                </div>
            </div>
        </div>
    );
    export default Dashboard;