import CourseList from "../components/CourseList"
import useFetch from "../hooks/useFetch"
import { Link, useParams } from "react-router-dom"
import '../styles/StudentHome.css'

const Home = () => {
    const params = useParams();
    // Öğrencinin aldığı kursları çek (studentId = 6 örnek olarak)
    const studentId = 6;
    const {data: enrolledCourses, loading, error} = useFetch(`http://localhost:5225/api/StudentCourse/courses/student/${studentId}`);
    if (loading) return (
        <div className="student-home-container">
            <div className="loading-state">
                🔄 Kurslarınız yükleniyor...
            </div>
        </div>
    );

    if (error) return (
        <div className="student-home-container">
            <div className="error-state">
                ❌ Kurslar yüklenirken bir hata oluştu.
            </div>
        </div>
    );

    return (
        <div className="student-home-container">
            <div className="student-home-content">
                {/* Hoşgeldin Bölümü */}
                <div className="welcome-section">
                    <h1 className="welcome-title">👋 Hoşgeldin!</h1>
                    <p className="welcome-subtitle">Öğrenme yolculuğuna devam et</p>
                    
                    <div className="student-stats">
                        <div className="stat-card">
                            <div className="stat-number">{enrolledCourses?.length || 0}</div>
                            <div className="stat-label">Kayıtlı Kurs</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">0</div>
                            <div className="stat-label">Tamamlanan</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">0</div>
                            <div className="stat-label">Toplam Saat</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">75%</div>
                            <div className="stat-label">Ortalama İlerleme</div>
                        </div>
                    </div>
                </div>

                {/* Kurslarım Bölümü */}
                <div className="courses-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            📚 Kurslarım
                        </h2>
                        <Link to="/courses" className="view-all-link">
                            Tüm Kursları Gör →
                        </Link>
                    </div>

                    {enrolledCourses && enrolledCourses.length > 0 ? (
                        <div className="courses-grid">
                            {enrolledCourses.map((courseData) => {
                                const course = courseData.course || courseData;                                
                                return (
                                    <div key={course.courseId} className="course-card">
                                        <div className="course-image">
                                            📖
                                        </div>
                                        <div className="course-content">
                                            <h3 className="course-title">{course.name}</h3>
                                            <p className="course-instructor">
                                                👨‍🏫 {course.courseOwner?.name || 'Eğitmen'}
                                            </p>
                                            
                                            <div className="course-progress">
                                                <div className="progress-label">
                                                    <span>İlerleme</span>
                                                    <span>55%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill" 
                                                        style={{ width: `55%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            <div className="course-actions">
                                                <Link 
                                                    to={`/courses/${course.courseId}`}
                                                    className="action-btn btn-primary"
                                                >
                                                    ▶️ Devam Et
                                                </Link>
                                                <Link 
                                                    to={`/courses/${course.courseId}/lectures`}
                                                    className="action-btn btn-secondary"
                                                >
                                                    📋 Dersler
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h3 className="empty-state-title">Henüz hiç kurs almadınız</h3>
                            <p className="empty-state-description">
                                Öğrenme yolculuğunuza başlamak için kurslarımıza göz atın!
                            </p>
                            <Link to="/courses" className="browse-courses-btn">
                                🔍 Kursları Keşfet
                            </Link>
                        </div>
                    )}
                </div>

                {/* Son Aktiviteler */}
                <div className="recent-activity">
                    <h2 className="section-title">
                        ⚡ Son Aktiviteler
                    </h2>
                    
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon">📖</div>
                            <div className="activity-content">
                                <div className="activity-title">React Temelleri - Ders 3 tamamlandı</div>
                                <div className="activity-description">Component'ler ve Props konusunu bitirdiniz</div>
                            </div>
                            <div className="activity-time">2 saat önce</div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">🎯</div>
                            <div className="activity-content">
                                <div className="activity-title">JavaScript Kursu %75 tamamlandı</div>
                                <div className="activity-description">Sadece 3 ders kaldı!</div>
                            </div>
                            <div className="activity-time">1 gün önce</div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon">🏆</div>
                            <div className="activity-content">
                                <div className="activity-title">İlk sertifikanızı kazandınız!</div>
                                <div className="activity-description">HTML & CSS Temel Kurs sertifikası</div>
                            </div>
                            <div className="activity-time">3 gün önce</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Home;