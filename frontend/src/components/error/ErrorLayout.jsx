const ErrorLayout = ({ children }) => {
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
                {children}
            </div>
        </div>
    );
};

export default ErrorLayout;