const CourseTable = ({ courses, coursesLoading }) => (
        <div className="courses-management">
            <div className="section-header">
                <h2>Kurs Yönetimi</h2>
                <button className="btn btn-primary">+ Yeni Kurs</button>
            </div>
            
            {coursesLoading ? (
                <div className="loading">Kurslar yükleniyor...</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Kurs Adı</th>
                                <th>Açıklama</th>
                                <th>Eğitmen</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses && courses?.map(course => (
                                <tr key={course.courseId}>
                                    <td>{course.courseId}</td>
                                    <td>{course.name}</td>
                                    <td>{course.description?.substring(0, 50)}...</td>
                                    <td>{course.courseOwner?.name || 'Bilinmiyor'}</td>
                                    <td>
                                        <span className={`status ${course.status ? 'active' : 'inactive'}`}>
                                            {course.status ? 'Aktif' : 'Pasif'}
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
export default CourseTable;