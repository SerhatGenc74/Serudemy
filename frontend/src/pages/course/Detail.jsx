import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import '../../styles/CourseDetail.css';
import useCurrentAccountId from "../../hooks/useAccountId";

const   CourseDetail = () => {

    const param = useParams();
    const courseId = param.courseId;
    const accountId = useCurrentAccountId();
    const { data: course, loading, error } = useFetch(`http://localhost:5225/api/course/${courseId}`);
    const {data : lastvideo} = useFetch(`http://localhost:5225/api/StudentProgress/student/${accountId}/course/${courseId}/last`);
    const { data: lectures, loading: lecturesLoading, error: lecturesError } = useFetch(`http://localhost:5225/api/Lecture/course/${courseId}`);
    const {data: studentProgresses} = useFetch(`http://localhost:5225/api/StudentProgress/course/${courseId}/student/${accountId}/progress`);
    const {data: firstVideo} = useFetch(`http://localhost:5225/api/Lecture/course/${courseId}/first`);
    const {data: IsEnrolledData, loading: isEnrolledLoading} = useFetch(`http://localhost:5225/api/StudentCourse/is-enrolled/${accountId}/${courseId}`);
    const {data: accessibilityData, loading: accessibilityLoading} = useFetch(`http://localhost:5225/api/course/${courseId}/is-accessible`);

    const lastwatchedid = lastvideo ? lastvideo?.lecturesId : firstVideo?.Id;
    const IsEnrolled = IsEnrolledData?.isEnrolled;
    const isAccessible = accessibilityData?.isAccessible;
    const courseAccessStatus = accessibilityData?.courseAccessStatus;

    // Ders durumunu belirleyen fonksiyon - ProgressPerc'e göre
    const getLectureStatus = (lectureId) => {
        if (!studentProgresses || !Array.isArray(studentProgresses)) {
            return { status: 'not-started', text: '📝 Başlanmadı', class: 'status-not-started', progress: 0 };
        }

        const progress = studentProgresses.find(p => {
            // Hem number hem string karşılaştırması yapalım
            return p.lecturesId === lectureId || p.lecturesId === parseInt(lectureId) || p.lecturesId === String(lectureId);
        });
        
        if (!progress) {
            return { status: 'not-started', text: '📝 Başlanmadı', class: 'status-not-started', progress: 0 };
        }

        const progressPerc = progress.progressPerc || 0;
        
        // ProgressPerc null ise başlanmadı
        if (progressPerc === null || progressPerc === undefined) {
            return { status: 'not-started', text: '📝 Başlanmadı', class: 'status-not-started', progress: 0 };
        }
        
        // ProgressPerc = 100 ise tamamlandı
        if (progressPerc >= 100) {
            return { 
                status: 'completed', 
                text: '✅ Tamamlandı', 
                class: 'status-completed', 
                progress: 100 
            };
        }
        
        // ProgressPerc > 0 ise devam ediyor
        if (progressPerc > 0) {
            return { 
                status: 'in-progress', 
                text: `🔄 İzleniyor (%${Math.round(progressPerc)})`, 
                class: 'status-in-progress', 
                progress: progressPerc 
            };
        }
        
        // ProgressPerc = 0 ise başlanmadı
        return { status: 'not-started', text: '📝 Başlanmadı', class: 'status-not-started', progress: 0 };
    };

    if (loading || lecturesLoading || isEnrolledLoading || accessibilityLoading) return (
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

    // Kurs erişilebilirlik kontrolü
    if (!isAccessible && courseAccessStatus !== undefined) {
        return (
            <div className="course-detail-container">
                <div className="page-header">
                    <h1 className="page-title">🔒 Kurs Erişim Kapalı</h1>
                    <p className="page-subtitle">Bu kurs şu anda öğrenciler için erişilebilir durumda değil</p>
                </div>
                
                <div className="course-detail-card">
                    {course && (
                        <div className="course-hero-section">
                            <div className="course-content">
                                <h2 className="course-title">{course.name}</h2>
                                <p className="course-description">{course.description}</p>
                                <div className="course-instructor">
                                    <span className="instructor-icon">👨‍🏫</span>
                                    <span>Eğitmen: {course.courseOwner?.name || 'Bilinmiyor'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="course-info-section">
                        <div className="enrollment-status not-accessible-status" style={{
                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                            color: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            marginBottom: '2rem'
                        }}>
                            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔒</div>
                            <h3>Bu Kurs Şu Anda Erişilebilir Değil</h3>
                            <p style={{margin: '0.5rem 0', opacity: '0.9'}}>
                                {courseAccessStatus === 'Draft' && 'Kurs henüz taslak aşamasında.'}
                                {courseAccessStatus === 'Archived' && 'Kurs arşivlenmiş durumda.'}
                                {courseAccessStatus === 'Published' && 'Kurs yayınlanmış ancak öğrenci erişimi kapatılmış.'}
                            </p>
                            <p style={{margin: '0', fontSize: '0.9rem', opacity: '0.8'}}>
                                Erişim için öğretmeninizle iletişime geçin.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }

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
                                        <div className="stat-label">Kurs Durumu</div>
                                        <div className="stat-value">
                                            {(courseAccessStatus || course.courseAccessStatus) === "Draft" && "📝 Taslak"}
                                            {(courseAccessStatus || course.courseAccessStatus) === "Published" && "✅ Yayında"}
                                            {(courseAccessStatus || course.courseAccessStatus) === "Archived" && "📦 Arşivlenmiş"}
                                            {!(courseAccessStatus || course.courseAccessStatus) && "🟢 Aktif"}
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Öğrenci Erişimi</div>
                                        <div className="stat-value">
                                            {(isAccessible !== undefined ? isAccessible : course.isAccessible) ? "🔓 Açık" : "🔒 Kapalı"}
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
                                                        {Math.floor(lectures.reduce((total, lecture) => total + (lecture.lectureDuration || 5), 0) / 60)} dk
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
                                                                    ⏱️ {(lecture.lectureDuration / 60).toFixed(0) || 5} dakika
                                                                </div>
                                                                {getLectureStatus(lecture.id).progress > 0 && (
                                                                    <div className="lesson-progress-bar">
                                                                        <div 
                                                                            className="progress-fill"
                                                                            style={{
                                                                                width: `${getLectureStatus(lecture.id).progress}%`,
                                                                                background: getLectureStatus(lecture.id).status === 'completed' 
                                                                                    ? 'linear-gradient(90deg, #10b981, #059669)' 
                                                                                    : 'linear-gradient(90deg, #f59e0b, #d97706)'
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="lesson-actions">
                                                            <span className={`lesson-status ${getLectureStatus(lecture.id).class}`}>
                                                                {getLectureStatus(lecture.id).text}
                                                            </span>
                                                            <Link 
                                                                to={`/course/${courseId}/Video/${lecture.id}`}
                                                                className="play-btn"
                                                            >
                                                                {getLectureStatus(lecture.id).status === 'completed' ? '🔄 Tekrar İzle' : 
                                                                 getLectureStatus(lecture.id).status === 'in-progress' ? '▶️ Devam Et' : 
                                                                 '▶️ İzle'}
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
                                    ⚠️ Öğretmeninizin Kursa kayıt etmesi Gerekli. Öğretmeninize Danışın 
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
                                                        {Math.floor(lectures.reduce((total, lecture) => total + (lecture.lectureDuration || 5) / 60, 0))}s
                                                    </div>
                                                    <div className="summary-label">Yaklaşık Süre</div>
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