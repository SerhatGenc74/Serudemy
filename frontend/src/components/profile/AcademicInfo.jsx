const AcademicInfo = ({ account, department, faculty }) => {
    // Sınıf seviyesi
    const getGradeLevel = (level) => {
        if (!level) return 'Belirtilmemiş';
        return `${level}. Sınıf`;
    };

    if (!department && !faculty && !account.gradeLevel) {
        return null;
    }

    return (
        <div className="info-section">
            <h3 className="info-section-title">
                🎓 Akademik Bilgiler
            </h3>
            <div className="info-grid">
                {faculty && (
                    <div className="info-item">
                        <div className="info-label">
                            🏛️ Fakülte
                        </div>
                        <div className="info-value faculty">
                            {faculty.name}
                        </div>
                    </div>
                )}
                
                {department && (
                    <div className="info-item">
                        <div className="info-label">
                            🏫 Bölüm
                        </div>
                        <div className="info-value department">
                            {department.name}
                        </div>
                    </div>
                )}
                
                {account.gradeLevel && (
                    <div className="info-item">
                        <div className="info-label">
                            🎯 Sınıf Seviyesi
                        </div>
                        <div className="info-value grade">
                            {getGradeLevel(account.gradeLevel)}
                        </div>
                    </div>
                )}
                
                {department && faculty && (
                    <div className="info-item">
                        <div className="info-label">
                            📍 Tam Konum
                        </div>
                        <div className="info-value" style={{fontSize: '0.95rem', lineHeight: '1.4'}}>
                            <div style={{color: '#6c5ce7', fontWeight: '600'}}>
                                🏛️ {faculty.name}
                            </div>
                            <div style={{color: '#a29bfe', margin: '0.2rem 0'}}>
                                🏫 {department.name}
                            </div>
                            {account.gradeLevel && (
                                <div style={{color: '#fd79a8'}}>
                                    🎯 {getGradeLevel(account.gradeLevel)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicInfo;