import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './InstructorCourses.css';

const InstructorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <div className="page-header">
        <div>
          <h1>Kurslarım</h1>
          <p>Tüm kurslarınızı yönetin</p>
        </div>
        <Link to="/instructor/create-course" className="btn-primary">
          ➕ Yeni Kurs
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Kurs ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {filteredCourses.length === 0 ? (
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
          {filteredCourses.map(course => (
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
                <p>{course.description?.substring(0, 100) || 'Açıklama yok'}...</p>
                <div className="course-meta">
                  <span>📍 {course.targetDepartment?.name || 'Belirsiz'}</span>
                  <span>📊 {course.targetGradeLevel}. Sınıf</span>
                </div>
                <div className="course-actions">
                  <Link to={`/instructor/courses/${course.id}/manage`} className="btn-manage">
                    Yönet
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
