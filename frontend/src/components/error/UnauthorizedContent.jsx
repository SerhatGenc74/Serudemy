const UnauthorizedContent = () => {
    return (
        <>
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
        </>
    );
};

export default UnauthorizedContent;