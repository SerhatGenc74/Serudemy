import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                maxWidth: '500px',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    color: '#dc3545',
                    margin: '0 0 20px 0'
                }}>403</h1>
                
                <h2 style={{
                    color: '#333',
                    marginBottom: '20px'
                }}>Erişim Engellendi</h2>
                
                <p style={{
                    color: '#666',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                }}>
                    Bu sayfaya erişim yetkiniz bulunmamaktadır. 
                    Lütfen gerekli izinler için sistem yöneticisi ile iletişime geçin.
                </p>
                
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
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
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
            </div>
        </div>
    );
};

export default Unauthorized;