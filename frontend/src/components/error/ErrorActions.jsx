import { Link } from 'react-router-dom';

const ErrorActions = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link 
                to="/" 
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s'
                }}
            >
                Ana Sayfaya Dön
            </Link>
            
            <button 
                onClick={handleLogout}
                style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                }}
            >
                Çıkış Yap
            </button>
        </div>
    );
};

export default ErrorActions;