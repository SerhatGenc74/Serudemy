import useFetch from "../../hooks/useFetch";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/Lessons.css";

const CourseLessons = () => {
    const param = useParams();
    const navigate = useNavigate();
    const courseId = param.courseId;
    const {data: lessons, isLoading, error} = useFetch(`http://localhost:5225/api/Lecture/course/${courseId}`);
    
    if(isLoading) {
        return (
            <div className="lessons-container">
                <div className="loading-container">
                    <div className="loading-spinner">🔄</div>
                    <div className="loading-text">Dersler yükleniyor...</div>
                </div>
            </div>
        );
    }
    
    if(error) {
        return (
            <div className="lessons-container">
                <div className="error-container">
                    <div className="error-text">❌ Hata: {error.message}</div>
                </div>
            </div>
        );
    }
    
    return(
        <div className="lessons-container">
            <div className="lessons-content">
                <button 
                    className="back-button"
                    onClick={() => navigate('/instructor/dashboard')}
                    title="Instructor Dashboard'a dön"
                >
                    ← Geri Dön
                </button>
                
                <div className="lessons-header">
                    <h1 className="lessons-title">📚 Kurs Dersleri</h1>
                    <p className="lessons-subtitle">Kursunuza ait tüm dersleri görüntüleyin ve yönetin</p>
                </div>
                
                <div className="add-lesson-container">
                    <button 
                        className="btn-add-lesson"
                        onClick={() => {
                            // Ders ekleme sayfasına yönlendir
                            navigate(`/course/${courseId}/add-lesson`);
                        }}
                    >
                        ➕ Yeni Ders Ekle
                    </button>
                </div>
               
                <div className="lessons-table-container">
                {lessons && lessons.length > 0 ? (
                    <table className="lessons-table">
                        <thead>
                            <tr>
                                <th>🆔 Ders ID</th>
                                <th>📖 Ders Adı</th>
                                <th>📝 Açıklama</th>
                                <th>⚙️ İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((lesson, index) => (
                                <tr key={lesson.id || index}>
                                    <td className="lesson-id">#{lesson.id}</td>
                                    <td className="lesson-name">{lesson.name}</td>
                                    <td className="lesson-description">{lesson.description}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link to={`/course/${courseId}/lecture/${lesson.id}/edit`}>
                                                <button className="btn btn-update">
                                                    ✏️ Düzenle
                                                </button>
                                            </Link>
                                            <button className="btn btn-delete">
                                                🗑️ Sil
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <div className="empty-state-title">Henüz ders bulunmuyor</div>
                        <div className="empty-state-description">
                            Bu kursa henüz ders eklenmemiş. İlk dersi eklemek için yeni ders oluştur butonuna tıklayın.
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default CourseLessons;