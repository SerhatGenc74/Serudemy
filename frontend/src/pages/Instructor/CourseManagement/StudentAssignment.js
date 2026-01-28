import React, { useState, useEffect, useCallback } from 'react';
import { studentCourseService } from '../../../api';

const StudentAssignment = ({ courseId, course }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!course?.courseId) return;
    
    try {
      const [enrolled, eligible] = await Promise.all([
        studentCourseService.getStudentsByCourse(course.courseId),
        studentCourseService.getEligibleStudentsForCourse(course.courseId),
      ]);
      setEnrolledStudents(enrolled || []);
      setEligibleStudents(eligible || []);
    } catch (error) {
      console.error('Öğrenci listesi yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [course]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === eligibleStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(eligibleStudents.map(s => s.id));
    }
  };

  const handleEnrollStudents = async () => {
    if (selectedStudents.length === 0) {
      setError('Lütfen en az bir öğrenci seçin.');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      // Seçili öğrencileri kursa kaydet
      for (const studentId of selectedStudents) {
        await studentCourseService.enrollStudent(course.courseId, studentId, {
          accountId: studentId,
          courseId: parseInt(course.courseId),
          courseCompleted: false,
          enrolledAt: new Date().toISOString(),
          progress: 0,
        });
      }

      setSuccess(`${selectedStudents.length} öğrenci başarıyla kursa eklendi!`);
      setSelectedStudents([]);
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Enrollment error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data || 'Öğrenci eklenirken bir hata oluştu.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    if (!window.confirm('Bu öğrenciyi kurstan çıkarmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await studentCourseService.unenrollStudent(course.courseId, studentId);
      setSuccess('Öğrenci kurstan çıkarıldı.');
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Öğrenci çıkarılırken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="loading-small">
        <div className="loading-spinner"></div>
        <p>Öğrenciler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="student-assignment">
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅</span> {success}
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="assignment-grid">
        {/* Uygun Öğrenciler */}
        <div className="assignment-panel">
          <div className="panel-header">
            <h3>Eklenebilecek Öğrenciler</h3>
            <span className="badge">{eligibleStudents.length}</span>
          </div>

          <div className="panel-info">
            <p>
              <strong>{course.targetDepartment?.name}</strong> bölümü, 
              <strong> {course.targetGradeLevel}. sınıf</strong> öğrencileri
            </p>
          </div>

          {eligibleStudents.length === 0 ? (
            <div className="empty-panel">
              <p>Tüm uygun öğrenciler zaten kursa kayıtlı.</p>
            </div>
          ) : (
            <>
              <div className="panel-actions">
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === eligibleStudents.length && eligibleStudents.length > 0}
                    onChange={handleSelectAll}
                  />
                  Tümünü Seç
                </label>
                <button 
                  className="btn-primary btn-sm"
                  onClick={handleEnrollStudents}
                  disabled={selectedStudents.length === 0 || enrolling}
                >
                  {enrolling ? 'Ekleniyor...' : `Seçilenleri Ekle (${selectedStudents.length})`}
                </button>
              </div>

              <div className="student-list">
                {eligibleStudents.map(student => (
                  <div 
                    key={student.id} 
                    className={`student-item selectable ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
                    onClick={() => handleSelectStudent(student.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="student-avatar">
                      {student.name?.charAt(0)?.toUpperCase() || 'Ö'}
                    </div>
                    <div className="student-info">
                      <span className="student-name">{student.name} {student.surname}</span>
                      <span className="student-no">{student.userno}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Kayıtlı Öğrenciler */}
        <div className="assignment-panel">
          <div className="panel-header">
            <h3>Kayıtlı Öğrenciler</h3>
            <span className="badge success">{enrolledStudents.length}</span>
          </div>

          {enrolledStudents.length === 0 ? (
            <div className="empty-panel">
              <span className="empty-icon">👥</span>
              <p>Henüz bu kursa kayıtlı öğrenci yok.</p>
            </div>
          ) : (
            <div className="student-list">
              {enrolledStudents.map(student => (
                <div key={student.id} className="student-item enrolled">
                  <div className="student-avatar enrolled">
                    {student.account?.name?.charAt(0)?.toUpperCase() || 'Ö'}
                  </div>
                  <div className="student-info">
                    <span className="student-name">{student.account?.name} {student.account?.surname}</span>
                    <span className="student-no">{student.account?.userno}</span>
                  </div>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleUnenrollStudent(student.accountId)}
                    title="Kurstan Çıkar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignment;
