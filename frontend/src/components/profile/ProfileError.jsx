import { Link } from "react-router-dom";

const ProfileError = ({ error }) => {
    return (
        <div className="profile-container">
            <div className="profile-error">
                <div className="error-icon">⚠️</div>
                <div className="error-text">
                    Profil bilgileri yüklenirken bir hata oluştu
                </div>
                <div style={{opacity: 0.8, marginBottom: '1rem'}}>
                    {error?.message || 'Kullanıcı bulunamadı'}
                </div>
                <Link to="/dashboard" className="back-button">
                    ← Dashboard'a Dön
                </Link>
            </div>
        </div>
    );
};

export default ProfileError;