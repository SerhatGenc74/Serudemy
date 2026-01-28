import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService, departmentService, categoryService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './CreateCourse.css';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    targetDepartmentId: '',
    targetGradeLevel: 1,
    courseAccessStatus: 'Draft',
    isAccessible: false,
  });
  
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, catData] = await Promise.all([
          departmentService.getAllDepartments(),
          categoryService.getAllCategories(),
        ]);
        setDepartments(deptData || []);
        setCategories(catData || []);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Benzersiz CourseId oluştur
      const uniqueCourseId = await courseService.generateUniqueCourseId();

      const courseData = {
        courseId: uniqueCourseId,
        courseOwnerId: parseInt(user?.id),
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        targetDepartmentId: formData.targetDepartmentId ? parseInt(formData.targetDepartmentId) : null,
        targetGradeLevel: parseInt(formData.targetGradeLevel),
        courseAccessStatus: formData.courseAccessStatus,
        isAccessible: formData.isAccessible,
        createdAt: new Date().toISOString(),
      };

      const createdCourse = await courseService.createCourse(courseData);
      
      // Başarılı oluşturma sonrası kurs yönetim sayfasına yönlendir
      navigate(`/instructor/courses/${createdCourse.id}/manage`);
    } catch (error) {
      setError(error.response?.data?.message || 'Kurs oluşturulurken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="create-course">
      <div className="page-header">
        <h1>Yeni Kurs Oluştur</h1>
        <p>Yeni bir kurs oluşturmak için aşağıdaki formu doldurun.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h2>Temel Bilgiler</h2>
          
          <div className="form-group">
            <label htmlFor="name">Kurs Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Örn: Programlamaya Giriş"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Kurs hakkında kısa bir açıklama yazın..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Kategori</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
            >
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Hedef Kitle</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetDepartmentId">Hedef Bölüm *</label>
              <select
                id="targetDepartmentId"
                name="targetDepartmentId"
                value={formData.targetDepartmentId}
                onChange={handleInputChange}
                required
              >
                <option value="">Bölüm Seçin</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetGradeLevel">Hedef Sınıf *</label>
              <select
                id="targetGradeLevel"
                name="targetGradeLevel"
                value={formData.targetGradeLevel}
                onChange={handleInputChange}
                required
              >
                <option value={1}>1. Sınıf</option>
                <option value={2}>2. Sınıf</option>
                <option value={3}>3. Sınıf</option>
                <option value={4}>4. Sınıf</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Yayın Ayarları</h2>

          <div className="form-group">
            <label htmlFor="courseAccessStatus">Durum</label>
            <select
              id="courseAccessStatus"
              name="courseAccessStatus"
              value={formData.courseAccessStatus}
              onChange={handleInputChange}
            >
              <option value="Draft">Taslak</option>
              <option value="Published">Yayında</option>
              <option value="Archived">Arşivlenmiş</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAccessible"
                checked={formData.isAccessible}
                onChange={handleInputChange}
              />
              <span className="checkbox-label">
                Kursu şimdi yayınla (Öğrenciler erişebilir)
              </span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/instructor/dashboard')}
          >
            İptal
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <span className="btn-spinner"></span>
                Oluşturuluyor...
              </>
            ) : (
              'Kurs Oluştur'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
