import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Kullanıcının gitmeye çalıştığı sayfa
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Redirecting to:', from || result.redirectPath);
        // Kullanıcıyı uygun dashboard'a yönlendir
        navigate(from || result.redirectPath, { replace: true });
      } else {
        setError(result.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎓 Serudemy</h1>
          <p>Üniversite Video Eğitim Platformu</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Giriş Yap</h2>
          
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@universite.edu.tr"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Serudemy - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
