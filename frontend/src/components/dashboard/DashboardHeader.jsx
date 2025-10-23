import { Link } from 'react-router-dom';

const DashboardHeader = () => {
    return (
        <div className="dashboard-header">
            <div className="header-content">
                <div className="welcome-section">
                    <h1>Hoş geldiniz, SERHAT!</h1>
                    <p>Eğitmen paneline erişiminiz bulunmaktadır</p>
                </div>
                <div className="header-actions">
                    <Link to="/instructor/create-course" className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        Yeni Kurs Oluştur
                    </Link>
                    <button className="btn btn-outline">
                        <i className="fas fa-chart-bar"></i>
                        Raporlar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;