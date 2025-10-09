import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import '../../styles/Register.css';

const Register = () => {
    const { data: departments, loading, error } = useFetch('http://localhost:5225/api/department');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        Surname: '',
        UserEmail: '',
        password: '',
        birthday: '',
        gender: '',
        departmentId: '',
        phone: '',
        CreatedAt: '2025-10-03',
        FotoPath: 'anlarsin.jpg',
        GradeLevel: '1',
        status: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('');
        
        try {
            const response = await fetch('http://localhost:5225/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();
            
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setFormError(responseText || 'Kayıt işlemi başarısız');
            }
        } catch (error) {
            setFormError('Bir hata oluştu: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-left">
                    <div className="register-brand">
                        <h1>Serudemy</h1>
                        <p>Eğitim yolculuğunuza başlayın ve potansiyelinizi keşfedin</p>
                    </div>
                    
                    <div className="register-benefits">
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="benefit-text">Binlerce ücretsiz kurs</span>
                        </div>
                        
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="benefit-text">Sertifika programları</span>
                        </div>
                        
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="benefit-text">Uzman eğitmenler</span>
                        </div>
                        
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="benefit-text">7/24 destek</span>
                        </div>
                    </div>
                </div>
                
                <div className="register-right">
                    <div className="register-form-container">
                        <div className="register-header">
                            <h2>Hesap Oluşturun</h2>
                            <p>Ücretsiz hesabınızı oluşturun ve öğrenmeye başlayın</p>
                        </div>

                        {formError && (
                            <div className="error-message">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                {formError}
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="name">Ad</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Adınız"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="Surname">Soyad</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <input
                                            type="text"
                                            id="Surname"
                                            name="Surname"
                                            placeholder="Soyadınız"
                                            value={formData.Surname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label htmlFor="email">E-posta</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <input
                                        type="email"
                                        id="UserEmail"
                                        name="UserEmail"
                                        placeholder="ornek@email.com"
                                        value={formData.UserEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label htmlFor="password">Şifre</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="En az 6 karakter"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="birthdate">Doğum Tarihi</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <input
                                            type="date"
                                            id="birthday"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="phone">Telefon</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="5XX XXX XX XX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label>Cinsiyet</label>
                                <div className="gender-group">
                                    <div className="radio-wrapper">
                                        <input
                                            type="radio"
                                            id="Erkek"
                                            name="gender"
                                            value="Erkek"
                                            checked={formData.gender === 'Erkek'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="male">Erkek</label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input
                                            type="radio"
                                            id="Kadın"
                                            name="gender"
                                            value="Kadın"
                                            checked={formData.gender === 'Kadın'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="Kadın">Kadın</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="departmentId">Bölüm</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <select
                                            id="departmentId"
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Bölüm seçiniz</option>
                                            {loading ? (
                                                <option disabled>Yükleniyor...</option>
                                            ) : error ? (
                                                <option disabled>Bölümler yüklenirken hata oluştu</option>
                                            ) : (
                                                departments && departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="GradeLevel">Sınıf</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <select
                                            id="GradeLevel"
                                            name="GradeLevel"
                                            value={formData.GradeLevel}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="1">1. Sınıf</option>
                                            <option value="2">2. Sınıf</option>
                                            <option value="3">3. Sınıf</option>
                                            <option value="4">4. Sınıf</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={`register-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                        Hesap oluşturuluyor...
                                    </div>
                                ) : (
                                    'Hesap Oluştur'
                                )}
                            </button>
                        </form>

                        <div className="register-footer">
                            <p>Zaten hesabınız var mı? <a href="/login">Giriş yapın</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;