import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/InstructorDashboard.css';

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Eğitmen verilerini çek
    const { data: instructorCourses, loading: coursesLoading, error: coursesError } = useFetch( `http://localhost:5225/api/Course/by-instructor/6` );
    // Mock data (API hazır olana kadar)
    const mockStats = {
        totalCourses: instructorCourses ? instructorCourses.length : 0,
        totalStudents: 1250,
        totalRevenue: 15750,
        averageRating: 4.7,
        totalLectures: 45,
        totalHours: 32
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return '#00b894';
            case 'draft': return '#fdcb6e';
            case 'pending': return '#74b9ff';
            default: return '#636e72';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'published': return 'Yayında';
            case 'draft': return 'Taslak';
            case 'pending': return 'İncelemede';
            default: return 'Bilinmiyor';
        }
    };


   

    return (
        <div className="instructor-dashboard">
            
            <div className="dashboard-container">
                {/* Dashboard Header */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <div className="welcome-section">
                            <h1>Hoş geldiniz, serhat!</h1>
                            <p>Eğitmen paneline erişiminiz bulunmaktadır</p>
                        </div>
                        <div className="header-actions">
                            <Link to="/instructor/create-course" className="btn btn-primary">
                                <i className="fas fa-plus"></i>
                                Yeni Kurs Oluştur
                            </Link>
                            <button className="btn btn-outline">
                                <i className="fas fa-chart-bar"></i>
                                Raporlar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon courses">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{mockStats.totalCourses}</h3>
                            <p>Toplam Kurs</p>
                            <span className="stat-change positive">+2 bu ay</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon students">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{mockStats.totalStudents.toLocaleString()}</h3>
                            <p>Toplam Öğrenci</p>
                            <span className="stat-change positive">+156 bu ay</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon revenue">
                            <i className="fas fa-lira-sign"></i>
                        </div>
                        <div className="stat-info">
                            <h3>₺{mockStats.totalRevenue.toLocaleString()}</h3>
                            <p>Toplam Kazanç</p>
                            <span className="stat-change positive">+%12 bu ay</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon rating">
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{mockStats.averageRating}</h3>
                            <p>Ortalama Puan</p>
                            <span className="stat-change positive">+0.2 bu ay</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="dashboard-content">
                    {/* Navigation Tabs */}
                    <div className="dashboard-tabs">
                        <button 
                            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <i className="fas fa-chart-line"></i>
                            Genel Bakış
                        </button>
                        <button 
                            className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            <i className="fas fa-graduation-cap"></i>
                            Kurslarım
                        </button>
                        <button 
                            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            <i className="fas fa-users"></i>
                            Öğrenciler
                        </button>
                        <button 
                            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            <i className="fas fa-chart-bar"></i>
                            Analitik
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 'overview' && (
                            <div className="overview-content">
                                <div className="content-grid">
                                    {/* Recent Activity */}
                                    <div className="activity-card">
                                        <h3>Son Aktiviteler</h3>
                                        <div className="activity-list">
                                            <div className="activity-item">
                                                <div className="activity-icon">
                                                    <i className="fas fa-user-plus"></i>
                                                </div>
                                                <div className="activity-info">
                                                    <p><strong>25 yeni öğrenci</strong> React kursuna kayıt oldu</p>
                                                    <span>2 saat önce</span>
                                                </div>
                                            </div>
                                            <div className="activity-item">
                                                <div className="activity-icon">
                                                    <i className="fas fa-star"></i>
                                                </div>
                                                <div className="activity-info">
                                                    <p><strong>Yeni 5 yıldız</strong> JavaScript kursunuza verildi</p>
                                                    <span>5 saat önce</span>
                                                </div>
                                            </div>
                                            <div className="activity-item">
                                                <div className="activity-icon">
                                                    <i className="fas fa-video"></i>
                                                </div>
                                                <div className="activity-info">
                                                    <p><strong>Node.js kursu</strong> ders 5 yayınlandı</p>
                                                    <span>1 gün önce</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="quick-stats-card">
                                        <h3>Hızlı İstatistikler</h3>
                                        <div className="quick-stats">
                                            <div className="quick-stat">
                                                <span className="stat-number">{mockStats.totalLectures}</span>
                                                <span className="stat-label">Toplam Ders</span>
                                            </div>
                                            <div className="quick-stat">
                                                <span className="stat-number">{mockStats.totalHours}s</span>
                                                <span className="stat-label">Toplam İçerik</span>
                                            </div>
                                            <div className="quick-stat">
                                                <span className="stat-number">89%</span>
                                                <span className="stat-label">Tamamlanma Oranı</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'courses' && (
                            <div className="courses-content">
                                <div className="content-header">
                                    <h2>Kurslarım ({instructorCourses ? instructorCourses.length : 0})</h2>
                                    <div className="course-filters">
                                        <button className="filter-btn active">Tümü</button>
                                        <button className="filter-btn">Yayında</button>
                                        <button className="filter-btn">Taslak</button>
                                        <button className="filter-btn">İncelemede</button>
                                    </div>
                                </div>

                                <div className="courses-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Kurs</th>
                                                <th>Öğrenci</th>
                                                <th>Kazanç</th>
                                                <th>Puan</th>
                                                <th>Durum</th>
                                                <th>İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coursesLoading ? (
                                                <tr>
                                                    <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                                                        <div className="loading-spinner"></div>
                                                        <p>Kurslar yükleniyor...</p>
                                                    </td>
                                                </tr>
                                            ) : coursesError ? (
                                                <tr>
                                                    <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                                                        <p style={{color: '#e17055'}}>Kurslar yüklenirken bir hata oluştu: {coursesError}</p>
                                                    </td>
                                                </tr>
                                            ) : instructorCourses && instructorCourses.length > 0 ? (
                                                instructorCourses.map((course) => (
                                                    <tr key={course.courseId}>
                                                        <td>
                                                            <div className="course-info">
                                                                <img 
                                                                    src={course.imageUrl || '/images/default-course.jpg'} 
                                                                    alt={course.title || course.name}
                                                                    className="course-thumbnail"
                                                                />
                                                                <div>
                                                                    <h4>{course.title || course.name}</h4>
                                                                    <p>{course.description}</p>
                                                                    <span className="course-meta">
                                                                        {course.lectureCount || 0} ders • ₺{course.price || 0}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link to={`/course/${course.courseId}/students`} className="student-link">
                                                            <span className="student-count">
                                                                {course.studentCount || 0} öğrenci
                                                            </span>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <span className="revenue">
                                                                ₺{course.revenue || 0}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="rating">
                                                                <i className="fas fa-star"></i>
                                                                {course.rating || 0}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span 
                                                                className="status-badge"
                                                                style={{ backgroundColor: getStatusColor(course.status || 'draft') }}
                                                            >
                                                                {getStatusText(course.status || 'draft')}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="course-actions">
                                                                <Link 
                                                                    to={`/courses/${course.courseId}`}
                                                                    className="action-btn view"
                                                                    title="Görüntüle"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Link>
                                                                <Link 
                                                                    to={`/instructor/edit-course/${course.courseId}`}
                                                                    className="action-btn edit"
                                                                    title="Düzenle"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>
                                                                <Link 
                                                                    to={`/course/${course.courseId}/lessons`}
                                                                    className="action-btn lectures"
                                                                    title="Dersleri Yönet"
                                                                >
                                                                    <i className="fas fa-video"></i>
                                                                </Link>
                                                                <button 
                                                                    className="action-btn analytics"
                                                                    title="Analitik"
                                                                >
                                                                    <i className="fas fa-chart-bar"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                                                        <div style={{color: '#636e72'}}>
                                                            <i className="fas fa-graduation-cap" style={{fontSize: '3rem', marginBottom: '15px'}}></i>
                                                            <h3>Henüz kurs bulunmuyor</h3>
                                                            <p>İlk kursunuzu oluşturmak için "Yeni Kurs Oluştur" butonunu kullanın</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'students' && (
                            <div className="students-content">
                                <h2>Öğrenci Yönetimi</h2>
                                <div className="coming-soon">
                                    <i className="fas fa-users"></i>
                                    <h3>Öğrenci yönetim paneli hazırlanıyor</h3>
                                    <p>Yakında öğrencilerinizi bu panelden yönetebileceksiniz</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="analytics-content">
                                <h2>Analitik & Raporlar</h2>
                                
                                {/* Revenue Analytics */}
                                <div className="analytics-section">
                                    <h3>Gelir Analizi</h3>
                                    <div className="revenue-chart">
                                        <div className="chart-placeholder">
                                            <i className="fas fa-chart-area"></i>
                                            <p>Son 6 ay gelir grafiği</p>
                                            <div className="mock-chart">
                                                <div className="chart-bars">
                                                    <div className="bar" style={{height: '60%'}}></div>
                                                    <div className="bar" style={{height: '75%'}}></div>
                                                    <div className="bar" style={{height: '45%'}}></div>
                                                    <div className="bar" style={{height: '80%'}}></div>
                                                    <div className="bar" style={{height: '90%'}}></div>
                                                    <div className="bar" style={{height: '100%'}}></div>
                                                </div>
                                                <div className="chart-labels">
                                                    <span>Oca</span>
                                                    <span>Şub</span>
                                                    <span>Mar</span>
                                                    <span>Nis</span>
                                                    <span>May</span>
                                                    <span>Haz</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Analytics */}
                                <div className="analytics-section">
                                    <h3>Öğrenci İstatistikleri</h3>
                                    <div className="student-analytics">
                                        <div className="analytics-grid">
                                            <div className="analytic-card">
                                                <div className="analytic-icon">
                                                    <i className="fas fa-user-plus"></i>
                                                </div>
                                                <div className="analytic-info">
                                                    <h4>Yeni Kayıtlar</h4>
                                                    <p className="analytic-number">127</p>
                                                    <span className="analytic-period">Bu ay</span>
                                                </div>
                                            </div>
                                            
                                            <div className="analytic-card">
                                                <div className="analytic-icon">
                                                    <i className="fas fa-graduation-cap"></i>
                                                </div>
                                                <div className="analytic-info">
                                                    <h4>Tamamlama Oranı</h4>
                                                    <p className="analytic-number">78%</p>
                                                    <span className="analytic-period">Ortalama</span>
                                                </div>
                                            </div>
                                            
                                            <div className="analytic-card">
                                                <div className="analytic-icon">
                                                    <i className="fas fa-clock"></i>
                                                </div>
                                                <div className="analytic-info">
                                                    <h4>Ortalama İzleme</h4>
                                                    <p className="analytic-number">4.2h</p>
                                                    <span className="analytic-period">Per kurs</span>
                                                </div>
                                            </div>
                                            
                                            <div className="analytic-card">
                                                <div className="analytic-icon">
                                                    <i className="fas fa-thumbs-up"></i>
                                                </div>
                                                <div className="analytic-info">
                                                    <h4>Memnuniyet</h4>
                                                    <p className="analytic-number">4.6</p>
                                                    <span className="analytic-period">5 üzerinden</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Performance */}
                                <div className="analytics-section">
                                    <h3>Kurs Performansı</h3>
                                    <div className="course-performance">
                                        <div className="performance-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Kurs</th>
                                                        <th>Kayıt</th>
                                                        <th>Tamamlama</th>
                                                        <th>Puan</th>
                                                        <th>Gelir</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>React ile Web Geliştirme</td>
                                                        <td>245</td>
                                                        <td>
                                                            <div className="progress-bar">
                                                                <div className="progress-fill" style={{width: '85%'}}></div>
                                                                <span>85%</span>
                                                            </div>
                                                        </td>
                                                        <td>4.8</td>
                                                        <td>₺12,250</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Node.js Backend</td>
                                                        <td>189</td>
                                                        <td>
                                                            <div className="progress-bar">
                                                                <div className="progress-fill" style={{width: '72%'}}></div>
                                                                <span>72%</span>
                                                            </div>
                                                        </td>
                                                        <td>4.5</td>
                                                        <td>₺9,450</td>
                                                    </tr>
                                                    <tr>
                                                        <td>JavaScript Temelleri</td>
                                                        <td>312</td>
                                                        <td>
                                                            <div className="progress-bar">
                                                                <div className="progress-fill" style={{width: '91%'}}></div>
                                                                <span>91%</span>
                                                            </div>
                                                        </td>
                                                        <td>4.7</td>
                                                        <td>₺15,600</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
