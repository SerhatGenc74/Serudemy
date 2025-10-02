 const Lectures = ({lectures,lecturesLoading}) => (
        <div className="lectures-management">
            <div className="section-header">
                <h2>Video Yönetimi</h2>
                <button className="btn btn-primary">+ Yeni Video</button>
            </div>
            
            {lecturesLoading ? (
                <div className="loading">Videolar yükleniyor...</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Video Adı</th>
                                <th>Açıklama</th>
                                <th>Kurs</th>
                                <th>Sıra</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures && lectures?.map(lecture => (
                                <tr key={lecture.id}>
                                    <td>{lecture.id}</td>
                                    <td>{lecture.name}</td>
                                    <td>{lecture.videoDesc?.substring(0, 50)}...</td>
                                    <td>{lecture.courseId || 'Bilinmiyor'}</td>
                                    <td>{lecture.lectureOrder}</td>
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
    export default Lectures;