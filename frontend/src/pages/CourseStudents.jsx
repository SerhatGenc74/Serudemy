import { Link, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/CourseStudents.css'; // CSS dosyasını içe aktar

const CourseStudents = () => {

    const params = useParams();
    const {courseId}  = params;
    const {data:Students,loading,error} = useFetch(`http://localhost:5225/api/StudentCourse/course/${courseId}/students`);
    
    return (
        <div className="course-students-container">
            <div className="course-students-card">
                <div className="students-header">
                    <h1 className="students-title">Kursa Kayıtlı Öğrenciler</h1>
                    <p className="students-subtitle">Bu kursta eğitim alan öğrencilerin listesi</p>
                </div>
                
                <div className="students-content">
                    {Students && Students.length > 0 && (
                        <div className="students-count">
                            📚 Toplam {Students.length} öğrenci bu kursa kayıtlı
                        </div>
                    )}
                    
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>👤 Öğrenci No</th>
                                <th>📝 Ad</th>
                                <th>📝 Soyad</th>
                                <th>✉️ E-posta</th>
                                <th>⚡ İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="loading-row">
                                        🔄 Öğrenciler yükleniyor...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={5} className="error-row">
                                        ❌ Hata: {error.message}
                                    </td>
                                </tr>
                            )}
                            {Students && Students.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="empty-state">
                                        <div className="empty-state-icon">📚</div>
                                        <div>Bu kursa henüz kayıtlı öğrenci bulunmuyor</div>
                                    </td>
                                </tr>
                            )}
                            {Students && Students.map(student => (
                                <tr key={student.account.id}>
                                    <td>
                                        <span className="student-userno">{student.account.userno}</span>
                                    </td>
                                    <td>
                                        <span className="student-info">{student.account.name}</span>
                                    </td>
                                    <td>
                                        <span className="student-info">{student.account.surname}</span>
                                    </td>
                                    <td>
                                        <span className="student-email">{student.account.userEmail}</span>
                                    </td>
                                    <td>
                                        <Link 
                                            to={`/StudentCourse/course/${courseId}/student/${student.account.id}/lectures`} 
                                            className="action-btn"
                                            title="Öğrenci ilerlemesini görüntüle"
                                        >
                                            <i className="fas fa-chart-line"></i>
                                            <span>İlerlemesini Gör</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default CourseStudents;