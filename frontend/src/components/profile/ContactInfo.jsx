const ContactInfo = ({ account }) => {
    return (
        <div className="info-section">
            <h3 className="info-section-title">
                📧 İletişim Bilgileri
            </h3>
            <div className="info-grid">
                <div className="info-item">
                    <div className="info-label">
                        📮 E-posta Adresi
                    </div>
                    <div className="info-value email">
                        {account.userEmail}
                    </div>
                </div>
                
                {account.phone && (
                    <div className="info-item">
                        <div className="info-label">
                            📱 Telefon Numarası
                        </div>
                        <div className="info-value phone">
                            {account.phone}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactInfo;