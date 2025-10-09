import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import '../../styles/Video.css';

const Video = () => {
    const param = useParams();
    const { data: lecture, loading, error } = useFetch(`http://localhost:5225/api/Lecture/${param.lectureId}`);
    const {data:alllectures,loading:alllecturesloading,error:alllectureserror} = useFetch(`http://localhost:5225/api/Lecture/course/${param.courseId}`);
    
    if (loading || alllecturesloading) return (
        <div className="video-page-container">
            <div className="loading-state">
                🔄 Video yükleniyor...
            </div>
        </div>
    );
    
    if (error || alllectureserror) return (
        <div className="video-page-container">
            <div className="error-state">
                ❌ Video yüklenirken bir hata oluştu.
            </div>
        </div>
    );

    const currentLectureIndex = alllectures?.findIndex(lec => lec.id == param.lectureId) || 0;
    const totalLectures = alllectures?.length || 0;
    const progressPercentage = totalLectures > 0 ? ((currentLectureIndex + 1) / totalLectures) * 100 : 0;

    return (
        <div className="video-page-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <nav className="breadcrumb-nav">
                    <Link to="/" className="breadcrumb-link">🏠 Ana Sayfa</Link>
                    <span className="breadcrumb-separator">›</span>
                    <Link to={`/courses/${param.courseId}`} className="breadcrumb-link">📚 Kurs Detayı</Link>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">🎥 {lecture?.name || 'Video'}</span>
                </nav>
            </div>

            <div className="video-content">
                {/* Ana Video Bölümü */}
                <div className="video-section">
                    <div className="video-header">
                        <h1 className="video-title">{lecture?.name || 'Video Başlığı'}</h1>
                        <div className="video-meta">
                            <div className="meta-item">
                                <span>📹</span>
                                <span>Ders {currentLectureIndex + 1} / {totalLectures}</span>
                            </div>
                            <div className="meta-item">
                                <span>⏱️</span>
                                <span>{lecture?.lectureDuration || 5} dakika</span>
                            </div>
                            <div className="meta-item">
                                <span>👁️</span>
                                <span>1,234 görüntülenme</span>
                            </div>
                        </div>
                    </div>

                    <div className="video-wrapper">
                        <video 
                            className="video-player" 
                            controls 
                            poster="/api/placeholder/800/450"
                        >
                            <source src={lecture?.videoUrl || lecture?.lectureId} type="video/mp4" />
                            Tarayıcınız video etiketini desteklemiyor.
                        </video>
                    </div>

                    <div className="video-controls">
                        <div className="progress-section">
                            <div className="progress-label">
                                Kurs İlerlemesi: {Math.round(progressPercentage)}%
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="video-actions">
                            {currentLectureIndex > 0 && (
                                <Link 
                                    to={`/course/${param.courseId}/Video/${alllectures[currentLectureIndex - 1].id}`}
                                    className="action-btn btn-secondary"
                                >
                                    ⬅️ Önceki Ders
                                </Link>
                            )}
                            
                            <button className="action-btn btn-secondary">
                                🔖 Favori Ekle
                            </button>
                            
                            <button className="action-btn btn-secondary">
                                💬 Not Ekle
                            </button>
                            
                            {currentLectureIndex < totalLectures - 1 && (
                                <Link 
                                    to={`/course/${param.courseId}/Video/${alllectures[currentLectureIndex + 1].id}`}
                                    className="action-btn btn-primary"
                                >
                                    Sonraki Ders ➡️
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ders Listesi Sidebar */}
                <div className="playlist-sidebar">
                    <div className="playlist-header">
                        <h2 className="playlist-title">
                            📚 Kurs İçeriği
                        </h2>
                        <div className="playlist-info">
                            {totalLectures} ders • {Math.round(totalLectures * 8)} dakika
                        </div>
                    </div>

                    <ul className="lectures-list">
                        {alllectures && alllectures.map((lec, index) => (
                            <li key={lec.id} className="lecture-item">
                                <Link 
                                    to={`/course/${param.courseId}/Video/${lec.id}`}
                                    className={`lecture-link ${lec.id == param.lectureId ? 'active' : ''}`}
                                >
                                    <div className="lecture-number">{index + 1}</div>
                                    <div className="lecture-details">
                                        <div className="lecture-name" title={lec.name}>
                                            {lec.name}
                                        </div>
                                        <div className="lecture-duration">
                                            ⏱️ {lec.lectureDuration || "Dakika Hesaplanmadı"} dk
                                        </div>
                                    </div>
                                    <div className="lecture-status">
                                        {index < currentLectureIndex ? (
                                            <span className="status-completed">✅</span>
                                        ) : index === currentLectureIndex ? (
                                            <span className="status-current">▶️</span>
                                        ) : (
                                            <span className="status-locked">🔒</span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default Video;
