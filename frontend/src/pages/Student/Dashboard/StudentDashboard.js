import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentCourseService, studentProgressService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    averageProgress: 0
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user?.id) {
          const data = await studentCourseService.getCoursesByStudent(user.id);
          setCourses(data || []);
          
          // İstatistikleri hesapla
          if (data && data.length > 0) {
            let totalWatchedSeconds = 0;
            let totalProgress = 0;
            
            // Her kurs için ilerleme bilgisini çek
            for (const course of data) {
              try {
                if (course.courseId) {
                  const progressData = await studentProgressService.getCompletedLessonCount(user.id, course.courseId);
                  if (progressData && progressData.totalCount > 0) {
                    const courseProgress = (progressData.completedCount / progressData.totalCount) * 100;
                    totalProgress += courseProgress;
                  }
                  
                  // Toplam izlenme süresini hesapla
                  const studentProgress = await studentProgressService.getProgressByStudent(user.id);
                  if (studentProgress && Array.isArray(studentProgress)) {
                    totalWatchedSeconds = studentProgress.reduce((sum, p) => sum + (p.watchedSeconds || 0), 0);
                  }
                }
              } catch (error) {
                console.error('Kurs istatistikleri yüklenemedi:', error);
              }
            }
            
            setStats({
              totalHours: Math.round(totalWatchedSeconds / 3600),
              averageProgress: data.length > 0 ? Math.round(totalProgress / data.length) : 0
            });
          }
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Hoş Geldin, {user?.name || 'Öğrenci'}</h1>
        <p>Öğrenmeye devam et!</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Kayıtlı Kurs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">▶️</div>
          <div className="stat-info">
            <h3>{courses.filter(c => !c.courseCompleted).length}</h3>
            <p>Devam Eden</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{courses.filter(c => c.courseCompleted).length}</h3>
            <p>Tamamlanan</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div className="stat-info">
            <h3>{stats.totalHours}h</h3>
            <p>Toplam İzleme</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Derslerim</h2>
          <Link to="/student/courses" className="view-all-link">
            Tümünü Gör →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h3>Henüz kayıtlı olduğunuz kurs yok</h3>
            <p>Eğitmeniniz sizi bir kursa eklediğinde burada görünecektir.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.slice(0, 4).map(studentCourse => (
              <CourseCard key={studentCourse.id} studentCourse={studentCourse} userId={user?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Ayrı kurs kartı bileşeni - her kurs için ilerleme bilgisini yükler
const CourseCard = ({ studentCourse, userId }) => {
  const [progressData, setProgressData] = useState(null);
  const course = studentCourse.courses || studentCourse;

  useEffect(() => {
    const fetchProgress = async () => {
      if (userId && studentCourse.courseId) {
        try {
          console.log('Fetching progress for userId:', userId, 'courseId:', studentCourse.courseId);
          const data = await studentProgressService.getCompletedLessonCount(userId, studentCourse.courseId);
          console.log('Progress data received:', data);
          setProgressData(data);
        } catch (error) {
          console.error('İlerleme yüklenemedi:', error);
        }
      }
    };
    fetchProgress();
  }, [userId, studentCourse.courseId]);

  // İlerleme yüzdesini hesapla
  const progressPercent = progressData && progressData.totalCount > 0
    ? Math.round((progressData.completedCount / progressData.totalCount) * 100)
    : 0;

  return (
    <div className="course-card">
      <div className="course-image">
        {course?.imageUrl ? (
          <img src={course.imageUrl} alt={course?.name} />
        ) : (
          <div className="placeholder-image">📚</div>
        )}
        {studentCourse.courseCompleted && (
          <span className="completed-badge">✓ Tamamlandı</span>
        )}
      </div>
      <div className="course-info">
        <h3>{course?.name || 'Kurs'}</h3>
        <p>{course?.description?.substring(0, 80) || 'Açıklama yok'}...</p>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {progressData ? `${progressData.completedCount}/${progressData.totalCount} ders tamamlandı` : 'Yükleniyor...'}
          </span>
        </div>

        <Link to={`/student/courses/${studentCourse.courseId}/watch`} className="btn-watch">
          {studentCourse.courseCompleted ? 'Tekrar İzle' : 'Devam Et'}
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
