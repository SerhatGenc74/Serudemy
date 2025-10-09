import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import '../../styles/CourseDetail.css';

const CourseDetail = () => {

    const param = useParams();
    const courseId = param.courseId;
    const studentId = 6; // Örnek öğrenci ID'si
    const { data: course, loading, error } = useFetch(`http://localhost:5225/api/course/${courseId}`);
    const {data : videos,loading:videoloading,error:videoerror} = useFetch(`http://localhost:5225/api/StudentProgress/student/6/course/${courseId}/last`);
    const { data: lectures, loading: lecturesLoading, error: lecturesError } = useFetch(`http://localhost:5225/api/Lecture/course/${courseId}`);
    const {data: Progress} = useFetch(`http://localhost:5225/api/StudentProgress/course/${courseId}/student/${studentId}/progress`);

    const lastwatchedid = videos?.lecturesId; 
    const IsEnrolled = true;

    if (loading || lecturesLoading) return (
        <div className="course-detail-container">
            <div className="loading-state">
                🔄 Kurs detayları yükleniyor...
            </div>
        </div>
    );
    
    if (error) return (
        <div className="course-detail-container">
            <div className="error-state">
                ❌ Kurs detayları yüklenirken bir hata oluştu.
            </div>
        </div>
    );
    if (IsEnrolled) {
        return (
            <div className="course-detail-container">
                <div className="page-header">
                    <h1 className="page-title">📚 Kurs Detayları</h1>
                    <p className="page-subtitle">Öğrenme yolculuğuna devam edin</p>
                </div>
                
                <div className="course-detail-card">
                    {course && (
                        <>
                            <div className="course-hero-section">
                                <div className="course-content">
                                    <h2 className="course-title">{course.name}</h2>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-instructor">
                                        <span className="instructor-icon">👨‍🏫</span>
                                        <span>Eğitmen: {course.courseOwner?.name || 'Bilinmiyor'}</span>
                                    </div>
                                    <div className="course-actions">
                                        <Link 
                                            to={`/course/${courseId}/Video/${lastwatchedid}`} 
                                            className="action-btn btn-primary"
                                        >
                                            ▶️ İzlemeye Devam Et
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="course-info-section">
                                <div className="enrollment-status">
                                    ✅ Bu kursa kayıtlısınız
                                </div>
                                
                                <div className="course-stats">
                                    <div className="stat-card">
                                        <div className="stat-label">Seviye</div>
                                        <div className="stat-value">
                                            🎯 {course.targetGradeLevel || 'Belirtilmemiş'}. Sınıf
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Bölüm</div>
                                        <div className="stat-value">
                                            🏫 {course.targetDepartment?.name || 'Belirtilmemiş'}
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Durum</div>
                                        <div className="stat-value">
                                            🟢 Aktif
                                        </div>
                                    </div>
                                </div>
                                
                                
                                {/* Kurs İçerikleri Bölümü */}
                                <div className="course-lessons-section">
                                    <h3 className="lessons-title">
                                        📚 Kurs İçerikleri
                                    </h3>
                                    
                                    {lectures && lectures.length > 0 ? (
                                        <>
                                            <div className="lessons-summary">
                                                <div className="summary-item">
                                                    <div className="summary-number">{lectures.length}</div>
                                                    <div className="summary-label">Toplam Ders</div>
                                                </div>
                                                <div className="summary-item">
                                                    <div className="summary-number">
                                                        {Math.floor(lectures.reduce((total, lecture) => total + (lecture.duration || 5), 0) / 60)}s
                                                    </div>
                                                    <div className="summary-label">Toplam Süre</div>
                                                </div>
                                                <div className="summary-item">
                                                    <div className="summary-number">∞</div>
                                                    <div className="summary-label">Erişim Süresi</div>
                                                </div>
                                            </div>
                                            
                                            <ul className="lessons-list">
                                                {lectures.map((lecture, index) => (
                                                    <li key={lecture.id} className="lesson-item">
                                                        <div className="lesson-info">
                                                            <div className="lesson-number">{index + 1}</div>
                                                            <div className="lesson-details">
                                                                <div className="lesson-title">{lecture.name}</div>
                                                                <div className="lesson-duration">
                                                                    ⏱️ {lecture.duration || 5} dakika
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="lesson-actions">
                                                            <span className="lesson-status status-not-started">
                                                                📝 Henüz İzlenmedi
                                                            </span>
                                                            <Link 
                                                                to={`/course/${courseId}/Video/${lecture.id}`}
                                                                className="play-btn"
                                                            >
                                                                ▶️ İzle
                                                            </Link>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <div className="no-lessons">
                                            <div className="no-lessons-icon">📚</div>
                                            <div>Bu kursa henüz ders eklenmemiş</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="course-detail-container">
                <div className="page-header">
                    <h1 className="page-title">📚 Kurs Detayları</h1>
                    <p className="page-subtitle">Bu kursa kaydolun ve öğrenmeye başlayın</p>
                </div>
                
                <div className="course-detail-card">
                    {course && (
                        <>
                            <div className="course-hero-section">
                                <div className="course-content">
                                    <h2 className="course-title">{course.name}</h2>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-instructor">
                                        <span className="instructor-icon">👨‍🏫</span>
                                        <span>Eğitmen: {course.courseOwner?.name || 'Bilinmiyor'}</span>
                                    </div>
                                    <div className="course-actions">
                                        <Link 
                                            to={`/course/${courseId}/enroll`} 
                                            className="action-btn btn-primary"
                                        >
                                            🚀 Hemen Kaydol
                                        </Link>
                                        <Link 
                                            to={`/course/${courseId}/preview`} 
                                            className="action-btn btn-secondary"
                                        >
                                            👁️ Önizleme
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="course-info-section">
                                <div className="enrollment-status not-enrolled-status">
                                    ⚠️ Bu kursa henüz kayıtlı değilsiniz
                                </div>
                                
                                <div className="course-stats">
                                    <div className="stat-card">
                                        <div className="stat-label">Seviye</div>
                                        <div className="stat-value">
                                            🎯 {course.targetGradeLevel || 'Belirtilmemiş'}. Sınıf
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Bölüm</div>
                                        <div className="stat-value">
                                            🏫 {course.targetDepartment?.name || 'Belirtilmemiş'}
                                        </div>
                                    </div>
                                </div>
                                
                                
                                
                                {/* Kurs İçerikleri Önizlemesi */}
                                <div className="course-lessons-section">
                                    <h3 className="lessons-title">
                                        📚 Kurs İçerikleri
                                    </h3>
                                    
                                    {lectures && lectures.length > 0 ? (
                                        <>
                                            <div className="lessons-summary">
                                                <div className="summary-item">
                                                    <div className="summary-number">{lectures.length}</div>
                                                    <div className="summary-label">Toplam Ders</div>
                                                </div>
                                                <div className="summary-item">
                                                    <div className="summary-number">
                                                        {Math.floor(lectures.reduce((total, lecture) => total + (lecture.duration || 5), 0) / 60)}s
                                                    </div>
                                                    <div className="summary-label">Toplam Süre</div>
                                                </div>
                                                <div className="summary-item">
                                                    <div className="summary-number">🔒</div>
                                                    <div className="summary-label">Kayıt Gerekli</div>
                                                </div>
                                            </div>
                                            
                                            <ul className="lessons-list">
                                                {lectures.slice(0, 3).map((lecture, index) => (
                                                    <li key={lecture.id} className="lesson-item">
                                                        <div className="lesson-info">
                                                            <div className="lesson-number">{index + 1}</div>
                                                            <div className="lesson-details">
                                                                <div className="lesson-title">{lecture.name}</div>
                                                                <div className="lesson-duration">
                                                                    ⏱️ {lecture.duration || 5} dakika
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="lesson-actions">
                                                            <span className="lesson-status status-not-started">
                                                                🔒 Kilitli
                                                            </span>
                                                            <button 
                                                                className="play-btn"
                                                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                                                disabled
                                                            >
                                                                🔒 İzle
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                                {lectures.length > 3 && (
                                                    <li className="lesson-item" style={{ background: '#f1f5f9', border: '2px dashed #cbd5e1' }}>
                                                        <div className="lesson-info">
                                                            <div className="lesson-number">...</div>
                                                            <div className="lesson-details">
                                                                <div className="lesson-title">+{lectures.length - 3} ders daha</div>
                                                                <div className="lesson-duration">
                                                                    🎓 Kursa kaydolarak tümüne erişin
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="lesson-actions">
                                                            <Link 
                                                                to={`/course/${courseId}/enroll`}
                                                                className="play-btn"
                                                            >
                                                                🚀 Kaydol
                                                            </Link>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </>
                                    ) : (
                                        <div className="no-lessons">
                                            <div className="no-lessons-icon">📚</div>
                                            <div>Bu kursa henüz ders eklenmemiş</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}
export default CourseDetail;