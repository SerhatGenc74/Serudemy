import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user?.id) {
          const data = await courseService.getCoursesByInstructor(user.id);
          setCourses(data || []);
        }
      } catch (error) {
        console.error('Kurslar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Hoş Geldiniz, {user?.name || 'Eğitmen'}</h1>
          <p>Kurslarınızı yönetin ve yeni içerikler ekleyin.</p>
        </div>
        <Link to="/instructor/create-course" className="btn-primary">
          ➕ Yeni Kurs Oluştur
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Toplam Kurs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📹</div>
          <div className="stat-info">
            <h3>{courses.reduce((acc, c) => acc + (c.lectures?.length || 0), 0)}</h3>
            <p>Toplam Video</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Kurslarım</h2>
          <Link to="/instructor/courses" className="view-all-link">
            Tümünü Gör →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h3>Henüz kursunuz yok</h3>
            <p>İlk kursunuzu oluşturarak başlayın!</p>
            <Link to="/instructor/create-course" className="btn-primary">
              Kurs Oluştur
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.slice(0, 4).map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.name} />
                  ) : (
                    <div className="placeholder-image">📚</div>
                  )}
                  <span className={`status-badge ${course.isAccessible ? 'active' : 'draft'}`}>
                    {course.isAccessible ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <p>{course.description?.substring(0, 80)}...</p>
                  <div className="course-meta">
                    <span>📹 {course.lectures?.length || 0} Video</span>
                    <span>📍 {course.targetDepartment?.name || 'Belirsiz'}</span>
                  </div>
                  <Link to={`/instructor/courses/${course.id}/manage`} className="btn-outline">
                    Yönet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
