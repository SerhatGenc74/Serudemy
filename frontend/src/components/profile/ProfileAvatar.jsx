const ProfileAvatar = ({ account }) => {
    return (
        <div className="profile-avatar-section">
            <div className="avatar-container">
                {account.fotoPath ? (
                    <img 
                        src={`http://localhost:5225${account.fotoPath}`}
                        alt={`${account.name} ${account.surname}`}
                        className="profile-avatar"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div 
                    className="avatar-placeholder" 
                    style={{ display: account.fotoPath ? 'none' : 'flex' }}
                >
                    {account.name?.[0]?.toUpperCase() || '👤'}
                </div>
                
                {/* Status indicator */}
                <div className={`status-indicator ${account.status ? 'status-active' : 'status-inactive'}`}>
                    {account.status ? '✓' : '✕'}
                </div>
            </div>
            
            <h2 className="profile-name">
                {account.name} {account.surname}
            </h2>
            
            <div className="profile-userno">
                #{account.userno}
            </div>
            
            <div className={`status-badge-large ${account.status ? 'active' : 'inactive'}`}>
                {account.status ? (
                    <>🟢 Aktif Hesap</>
                ) : (
                    <>🔴 Pasif Hesap</>
                )}
            </div>
        </div>
    );
};

export default ProfileAvatar;