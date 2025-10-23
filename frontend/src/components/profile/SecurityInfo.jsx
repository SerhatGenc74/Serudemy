import { useState } from "react";

const SecurityInfo = ({ account }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="info-section">
            <h3 className="info-section-title">
                🔐 Güvenlik Bilgileri
            </h3>
            <div className="info-grid">
                <div className="info-item">
                    <div className="info-label">
                        🔑 Şifre
                    </div>
                    <div className="info-value" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        {showPassword ? (
                            <span style={{color: '#e17055', fontFamily: 'Monaco, monospace'}}>
                                {account.password}
                            </span>
                        ) : (
                            <span className="hidden-password">
                                ••••••••
                            </span>
                        )}
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '0.2rem'
                            }}
                            title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                
                <div className="info-item">
                    <div className="info-label">
                        🆔 Kullanıcı ID
                    </div>
                    <div className="info-value" style={{fontFamily: 'Monaco, monospace'}}>
                        {account.id}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityInfo;