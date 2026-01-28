import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentCourseService, studentProgressService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user?.id) {
          const data = await studentCourseService.getCoursesByStudent(user.id);
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

  const filteredCourses = courses.filter(studentCourse => {
    if (filter === 'completed') return studentCourse.courseCompleted;
    if (filter === 'in-progress') return !studentCourse.courseCompleted;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="page-header">
        <h1>Derslerim</h1>
        <p>Kayıtlı olduğunuz tüm kurslar</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tümü ({courses.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          Devam Eden ({courses.filter(c => !c.courseCompleted).length})
        </button>
        <button 
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Tamamlanan ({courses.filter(c => c.courseCompleted).length})
        </button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <h3>
            {filter === 'all' 
              ? 'Henüz kayıtlı olduğunuz kurs yok'
              : filter === 'completed'
              ? 'Henüz tamamladığınız kurs yok'
              : 'Devam eden kursunuz yok'}
          </h3>
          <p>Eğitmeniniz sizi bir kursa eklediğinde burada görünecektir.</p>
        </div>
      ) : (
        <div className="courses-list">
          {filteredCourses.map(studentCourse => (
            <CourseListItem 
              key={studentCourse.id} 
              studentCourse={studentCourse} 
              userId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Kurs listesi öğesi
const CourseListItem = ({ studentCourse, userId }) => {
  const [progress, setProgress] = useState({ completedCount: 0, totalCount: 0 });
  const course = studentCourse.courses || studentCourse;

  useEffect(() => {
    const fetchData = async () => {
      if (userId && studentCourse.courseId) {
        try {
          console.log('Fetching progress for userId:', userId, 'courseId:', studentCourse.courseId);
          const progressData = await studentProgressService.getCompletedLessonCount(userId, studentCourse.courseId);
          console.log('Progress data received:', progressData);
          setProgress(progressData || { completedCount: 0, totalCount: 0 });
        } catch (error) {
          console.error('İlerleme yüklenemedi:', error);
        }
      }
    };
    fetchData();
  }, [userId, studentCourse.courseId]);

  // İlerleme yüzdesini gerçek verilerden hesapla
  const progressPercent = progress.totalCount > 0
    ? Math.round((progress.completedCount / progress.totalCount) * 100)
    : 0;

  return (
    <div className="course-list-item">
      <div className="course-thumbnail">
        {course?.imageUrl ? (
          <img src={course.imageUrl} alt={course?.name} />
        ) : (
          <div className="placeholder-thumb">📚</div>
        )}
      </div>

      <div className="course-details">
        <div className="course-header">
          <h3>{course?.name || 'Kurs'}</h3>
          {studentCourse.courseCompleted && (
            <span className="completed-badge">✓ Tamamlandı</span>
          )}
        </div>
        <p className="course-desc">{course?.description?.substring(0, 150) || 'Açıklama yok'}...</p>
        
        <div className="course-meta">
          <span>📍 {course?.targetDepartment?.name || 'Bölüm'}</span>
          <span>📹 {progress?.completedCount || 0}/{progress?.totalCount || 0} ders</span>
          <span>📅 {new Date(studentCourse.enrolledAt).toLocaleDateString('tr-TR')}</span>
        </div>

        <div className="progress-row">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="progress-percent">%{Math.round(progressPercent)}</span>
        </div>
      </div>

      <div className="course-actions">
        <Link to={`/student/courses/${studentCourse.courseId}/watch`} className="btn-primary">
          {studentCourse.courseCompleted ? '↺ Tekrar İzle' : '▶ Devam Et'}
        </Link>
      </div>
    </div>
  );
};

export default MyCourses;
