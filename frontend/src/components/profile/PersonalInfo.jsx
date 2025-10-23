const PersonalInfo = ({ account }) => {
    // Cinsiyet emoji ve renk
    const getGenderDisplay = (gender) => {
        switch(gender?.toLowerCase()) {
            case 'erkek': 
            case 'male': 
                return '👨 Erkek';
            case 'kadın': 
            case 'female': 
                return '👩 Kadın';
            default: 
                return '👤 Belirtilmemiş';
        }
    };

    // Tarih formatı
    const formatDate = (dateString) => {
        if (!dateString) return 'Belirtilmemiş';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="info-section">
            <h3 className="info-section-title">
                👤 Kişisel Bilgiler
            </h3>
            <div className="info-grid">
                <div className="info-item">
                    <div className="info-label">
                        🎂 Doğum Tarihi
                    </div>
                    <div className="info-value birthday">
                        {formatDate(account.birthday)}
                    </div>
                </div>
                
                <div className="info-item">
                    <div className="info-label">
                        ⚧️ Cinsiyet
                    </div>
                    <div className="info-value gender">
                        {getGenderDisplay(account.gender)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;