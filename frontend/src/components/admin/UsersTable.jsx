const UsersTable = ({ accounts ,accountsLoading}) => (
        <div className="users-management">
            <div className="section-header">
                <h2>Kullanıcı Yönetimi</h2>
                <button className="btn btn-primary">+ Yeni Kullanıcı</button>
            </div>
            
            {accountsLoading ? (
                <div className="loading">Kullanıcılar yükleniyor...</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ad Soyad</th>
                                <th>Email</th>
                                <th>Kullanıcı No</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts&&accounts?.map(account => (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.name} {account.surname}</td>
                                    <td>{account.userEmail}</td>
                                    <td>{account.userno}</td>
                                    <td>
                                        <span className={`status ${account.status ? 'active' : 'inactive'}`}>
                                            {account.status ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-edit">✏️</button>
                                            <button className="btn-delete">🗑️</button>
                                            <button className="btn-view">👁️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
    export default UsersTable;