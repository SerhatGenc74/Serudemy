import React, { useState, useEffect, useCallback } from 'react';
import { studentProgressService } from '../../../api';

const CourseProgress = ({ course }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // name, progress, lastActivity
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchProgressData = useCallback(async () => {
    if (!course?.courseId) return;
    
    try {
      setLoading(true);
      const data = await studentProgressService.getCourseProgressOverview(course.courseId);
      setProgressData(data);
    } catch (err) {
      console.error('İlerleme verileri yüklenirken hata:', err);
      setError('İlerleme verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [course]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 dk';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} sa ${minutes} dk`;
    }
    return `${minutes} dk`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    try {
      // Handle byte array (timestamp)
      if (Array.isArray(dateValue)) {
        return '-';
      }
      const date = new Date(dateValue);
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 50) return '#f59e0b'; // yellow
    if (percentage >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getSortedStudents = () => {
    if (!progressData?.students) return [];
    
    const sorted = [...progressData.students].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.studentName} ${a.studentSurname}`.localeCompare(`${b.studentName} ${b.studentSurname}`);
          break;
        case 'progress':
          comparison = a.progressPercentage - b.progressPercentage;
          break;
        case 'lastActivity':
          comparison = (a.lastActivity || 0) - (b.lastActivity || 0);
          break;
        case 'enrolled':
          comparison = new Date(a.enrolledAt) - new Date(b.enrolledAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="loading-small">
        <div className="loading-spinner"></div>
        <p>İlerleme verileri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>⚠️</span> {error}
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📊</span>
        <p>İlerleme verisi bulunamadı.</p>
      </div>
    );
  }

  const sortedStudents = getSortedStudents();

  return (
    <div className="course-progress">
      {/* Özet Kartları */}
      <div className="progress-summary">
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <span className="summary-value">{progressData.totalStudents}</span>
            <span className="summary-label">Kayıtlı Öğrenci</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📚</div>
          <div className="summary-content">
            <span className="summary-value">{progressData.totalLectures}</span>
            <span className="summary-label">Toplam Ders</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <span className="summary-value">%{progressData.averageProgress}</span>
            <span className="summary-label">Ortalama İlerleme</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <span className="summary-value">
              {sortedStudents.filter(s => s.courseCompleted).length}
            </span>
            <span className="summary-label">Tamamlayan</span>
          </div>
        </div>
      </div>

      {/* Öğrenci Listesi */}
      {sortedStudents.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <p>Henüz bu kursa kayıtlı öğrenci yok.</p>
        </div>
      ) : (
        <div className="students-progress-list">
          <div className="progress-list-header">
            <h3>Öğrenci İlerlemeleri</h3>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                İsim {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'progress' ? 'active' : ''}`}
                onClick={() => handleSort('progress')}
              >
                İlerleme {sortBy === 'progress' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'enrolled' ? 'active' : ''}`}
                onClick={() => handleSort('enrolled')}
              >
                Kayıt Tarihi {sortBy === 'enrolled' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="progress-items">
            {sortedStudents.map((student) => (
              <div key={student.studentId} className="student-progress-item">
                <div 
                  className="student-progress-header"
                  onClick={() => toggleStudentDetails(student.studentId)}
                >
                  <div className="student-info-left">
                    <div className="student-avatar" style={{ backgroundColor: getProgressColor(student.progressPercentage) }}>
                      {student.studentName?.charAt(0)?.toUpperCase() || 'Ö'}
                    </div>
                    <div className="student-details">
                      <span className="student-name">{student.studentName} {student.studentSurname}</span>
                      <span className="student-no">{student.studentNo}</span>
                    </div>
                  </div>
                  
                  <div className="student-progress-stats">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${student.progressPercentage}%`,
                          backgroundColor: getProgressColor(student.progressPercentage)
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      %{student.progressPercentage} ({student.completedLectures}/{student.totalLectures} ders)
                    </span>
                  </div>
                  
                  <div className="student-meta">
                    <span className="watch-time">⏱️ {formatDuration(student.totalWatchedSeconds)}</span>
                    {student.courseCompleted && <span className="completed-badge">✅ Tamamlandı</span>}
                  </div>
                  
                  <button className="expand-btn">
                    {expandedStudent === student.studentId ? '▲' : '▼'}
                  </button>
                </div>

                {expandedStudent === student.studentId && (
                  <div className="student-lecture-details">
                    <div className="detail-header">
                      <span>Kayıt Tarihi: {formatDate(student.enrolledAt)}</span>
                    </div>
                    
                    {student.lectureProgress?.length > 0 ? (
                      <div className="lecture-progress-list">
                        {student.lectureProgress.map((lecture, index) => (
                          <div key={lecture.lectureId || index} className="lecture-progress-item">
                            <div className="lecture-info">
                              <span className="lecture-order">{lecture.lectureOrder || index + 1}</span>
                              <span className="lecture-name">{lecture.lectureName || 'Ders'}</span>
                            </div>
                            <div className="lecture-status">
                              {lecture.isCompleted ? (
                                <span className="status-completed">✅ Tamamlandı</span>
                              ) : (
                                <span className="status-progress">
                                  %{Math.round(lecture.progressPerc)} • {formatDuration(lecture.watchedSeconds)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-progress">
                        <p>Henüz ders izleme kaydı yok.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;
