import { Link } from "react-router-dom";

const QuickActions = () => {
    return (
        <div className="quick-actions">
            <h2 className="section-title">
                🚀 Hızlı Eylemler
            </h2>
            
            <div className="actions-grid">
                <Link to="/courses" className="action-card">
                    <div className="action-icon">🔍</div>
                    <div className="action-content">
                        <h3>Kursları Keşfet</h3>
                        <p>Yeni kurslar bul ve öğrenmeye başla</p>
                    </div>
                </Link>
                
                <Link to="/courses?filter=my-courses" className="action-card">
                    <div className="action-icon">📚</div>
                    <div className="action-content">
                        <h3>Kurslarım</h3>
                        <p>Kayıtlı olduğun kursları görüntüle</p>
                    </div>
                </Link>
                
                <Link to="/profile" className="action-card">
                    <div className="action-icon">👤</div>
                    <div className="action-content">
                        <h3>Profil</h3>
                        <p>Bilgilerini düzenle ve güncelle</p>
                    </div>
                </Link>
                
                <div className="action-card">
                    <div className="action-icon">🏆</div>
                    <div className="action-content">
                        <h3>Sertifikalar</h3>
                        <p>Kazandığın sertifikaları gör</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;