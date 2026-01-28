import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { courseService, lectureService, fileService } from '../../../api';
import VideoUploadWizard from './VideoUploadWizard';
import StudentAssignment from './StudentAssignment';
import CourseProgress from './CourseProgress';
import LectureEditModal from './LectureEditModal';
import './CourseManagement.css';

const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [activeTab, setActiveTab] = useState('lectures');
  const [loading, setLoading] = useState(true);
  const [editingLecture, setEditingLecture] = useState(null);
  const [draggedLectureId, setDraggedLectureId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [dragOverLectureId, setDragOverLectureId] = useState(null);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [originalLectureIds, setOriginalLectureIds] = useState([]);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const fetchCourseData = useCallback(async () => {
    try {
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);
      
      if (courseData?.courseId) {
        const lecturesData = await lectureService.getLecturesByCourse(courseData.courseId);
        const sorted = (lecturesData || []).slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
        setLectures(sorted);
        setOriginalLectureIds(sorted.map(l => l.id));
        setHasOrderChanges(false);
      }
    } catch (error) {
      console.error('Kurs verileri yüklenirken hata:', error);
      toast.error('❌ Kurs bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleLectureCreated = (newLecture) => {
    const next = [...lectures, newLecture].slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
    setLectures(next);
    setOriginalLectureIds(next.map(l => l.id));
    setHasOrderChanges(false);
    toast.success('✅ Ders başarıyla eklendi!');
  };

  const handleLectureUpdate = async (updatedLecture) => {
    try {
      await lectureService.updateLecture(updatedLecture.id, updatedLecture);
      toast.success('✅ Ders başarıyla güncellendi!');
      if (course?.courseId) {
        const lecturesData = await lectureService.getLecturesByCourse(course.courseId);
        const sorted = (lecturesData || []).slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
        setLectures(sorted);
        setOriginalLectureIds(sorted.map(l => l.id));
        setHasOrderChanges(false);
      }
    } catch (err) {
      toast.error('❌ Ders güncellenirken bir hata oluştu.');
      throw err;
    }
  };

  const handleLectureStatusChange = async (lectureId, action, value) => {
    try {
      let response;
      
      switch (action) {
        case 'publish':
          response = await lectureService.publishLecture(lectureId);
          toast.success('✅ Ders yayınlandı!');
          break;
        case 'unpublish':
          response = await lectureService.unpublishLecture(lectureId);
          toast.success('📝 Ders taslağa alındı!');
          break;
        case 'archive':
          response = await lectureService.archiveLecture(lectureId);
          toast.success('📦 Ders arşivlendi!');
          break;
        case 'accessibility':
          response = await lectureService.setLectureAccessibility(lectureId, value);
          toast.success(value ? '🔓 Ders erişilebilir yapıldı!' : '🔒 Ders erişime kapatıldı!');
          break;
        default:
          throw new Error('Geçersiz işlem');
      }

      // Dersleri yeniden yükle
      if (course?.courseId) {
        const lecturesData = await lectureService.getLecturesByCourse(course.courseId);
        const sorted = (lecturesData || []).slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
        setLectures(sorted);
        setOriginalLectureIds(sorted.map(l => l.id));
        setHasOrderChanges(false);
        
        // Eğer modal açıksa, güncel dersi bul ve modal'ı güncelle
        if (editingLecture && editingLecture.id === lectureId) {
          const updatedLecture = sorted.find(l => l.id === lectureId);
          if (updatedLecture) {
            setEditingLecture(updatedLecture);
          }
        }
      }
    } catch (err) {
      console.error('Durum değiştirme hatası:', err);
      toast.error('❌ Durum değiştirilirken bir hata oluştu.');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await lectureService.deleteLecture(lectureId);
      const next = lectures.filter(l => l.id !== lectureId);
      setLectures(next);
      setOriginalLectureIds(next.map(l => l.id));
      setHasOrderChanges(false);
      toast.success('✅ Ders başarıyla silindi.');
    } catch (error) {
      toast.error('❌ Ders silinirken bir hata oluştu.');
    }
  };

  const formatLectureDuration = (durationValue) => {
    if (!durationValue) return null;
    // Backward compatible: some records may be seconds (e.g., 300), newer ones may be minutes (e.g., 12)
    const minutes = durationValue > 240 ? Math.ceil(durationValue / 60) : durationValue;
    return `${minutes} dk`;
  };

  const moveItem = (items, fromIndex, toIndex) => {
    const next = items.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const persistLectureOrder = async (orderedLectures) => {
    if (!course?.courseId) return;

    setReordering(true);
    try {
      // Apply final order deterministically (sequential calls)
      for (let i = 0; i < orderedLectures.length; i++) {
        const lecture = orderedLectures[i];
        const newOrder = i + 1;
        await lectureService.reorderLecture(lecture.id, newOrder);
      }

      // Re-fetch from server to guarantee UI matches persisted order
      const lecturesData = await lectureService.getLecturesByCourse(course.courseId);
      const sorted = (lecturesData || []).slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
      setLectures(sorted);
      setOriginalLectureIds(sorted.map(l => l.id));
      setHasOrderChanges(false);

      toast.success('✅ Ders sırası güncellendi.');
    } catch (e) {
      toast.error('❌ Ders sırası güncellenirken hata oluştu.');
      // Re-fetch to ensure UI matches server
      const lecturesData = await lectureService.getLecturesByCourse(course.courseId);
      const sorted = (lecturesData || []).slice().sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
      setLectures(sorted);
      setOriginalLectureIds(sorted.map(l => l.id));
      setHasOrderChanges(false);
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (lectureId) => {
    setDraggedLectureId(lectureId);
  };

  const handleDropOn = (targetLectureId) => {
    if (!draggedLectureId || draggedLectureId === targetLectureId) return;

    const fromIndex = lectures.findIndex(l => l.id === draggedLectureId);
    const toIndex = lectures.findIndex(l => l.id === targetLectureId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = moveItem(lectures, fromIndex, toIndex)
      .map((l, idx) => ({ ...l, lectureOrder: idx + 1 }));

    setLectures(reordered);
    setHasOrderChanges(true);
    setDraggedLectureId(null);
    setDragOverLectureId(null);
  };

  const handleCancelReorder = () => {
    if (!hasOrderChanges) return;
    const byId = new Map(lectures.map(l => [l.id, l]));
    const restored = originalLectureIds
      .map(id => byId.get(id))
      .filter(Boolean)
      .map((l, idx) => ({ ...l, lectureOrder: idx + 1 }));
    setLectures(restored);
    setHasOrderChanges(false);
    setDraggedLectureId(null);
    setDragOverLectureId(null);
  };

  const handleSaveReorder = async () => {
    if (!hasOrderChanges) return;
    await persistLectureOrder(lectures);
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Görsel dosyası kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ Görsel dosyası 5MB\'dan küçük olmalıdır.');
      return;
    }

    setUploadingThumbnail(true);
    try {
      const result = await fileService.uploadFile(file);
      const imageUrl = result.filePath;
      
      setCourse(prev => ({ ...prev, imageUrl }));
      toast.success('✅ Kurs görseli yüklendi. Değişiklikleri kaydetmeyi unutmayın.');
    } catch (error) {
      console.error('Thumbnail yükleme hatası:', error);
      toast.error('❌ Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploadingThumbnail(false);
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

  if (!course) {
    return (
      <div className="error-container">
        <h2>Kurs bulunamadı</h2>
        <button onClick={() => navigate('/instructor/courses')} className="btn-primary">
          Kurslara Dön
        </button>
      </div>
    );
  }

  return (
    <div className="course-management">
      <div className="page-header">
        <div className="header-info">
          <button className="back-btn" onClick={() => navigate('/instructor/courses')}>
            ← Geri
          </button>
          <div>
            <h1>{course.name}</h1>
            <p>{course.targetDepartment?.name} - {course.targetGradeLevel}. Sınıf</p>
          </div>
        </div>
        <div className="header-actions">
          <span className={`status-badge ${course.isAccessible ? 'active' : 'draft'}`}>
            {course.isAccessible ? 'Yayında' : 'Taslak'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
          onClick={() => setActiveTab('lectures')}
        >
          📹 Ders İçerikleri ({lectures.length})
        </button>
        <button 
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Öğrenci Atama
        </button>
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📊 İlerleme Takibi
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Kurs Ayarları
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'lectures' && (
          <div className="lectures-section">
            <VideoUploadWizard 
              courseId={course?.courseId} 
              onLectureCreated={handleLectureCreated}
              lectureCount={lectures.length}
            />

            <div className="lectures-list">
              <div className="lectures-list-header">
                <h3>Mevcut Dersler</h3>
                <button 
                  className="btn-calendar"
                  onClick={() => navigate(`/instructor/course/${courseId}/schedule`)}
                  title="Ders Yayın Takvimi"
                >
                  📅 Takvim
                </button>
              </div>
              {hasOrderChanges && (
                <div className="reorder-savebar">
                  <span className="reorder-savebar-text">Sıralama değişti.</span>
                  <div className="reorder-savebar-actions">
                    <button
                      className="btn-secondary btn-sm"
                      onClick={handleCancelReorder}
                      disabled={reordering}
                    >
                      Vazgeç
                    </button>
                    <button
                      className="btn-primary btn-sm"
                      onClick={handleSaveReorder}
                      disabled={reordering}
                    >
                      {reordering ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </div>
              )}
              {reordering && (
                <div className="reorder-hint">Sıra güncelleniyor...</div>
              )}
              {lectures.length === 0 ? (
                <div className="empty-lectures">
                  <span>📹</span>
                  <p>Henüz ders eklenmemiş. Yukarıdaki formu kullanarak ilk dersinizi ekleyin.</p>
                </div>
              ) : (
                <div className="lecture-items">
                  {lectures.map((lecture, index) => (
                    <div
                      key={lecture.id}
                      className={`lecture-item ${draggedLectureId === lecture.id ? 'dragging' : ''} ${dragOverLectureId === lecture.id ? 'drag-over' : ''}`}
                      draggable={!reordering}
                      onDragStart={() => handleDragStart(lecture.id)}
                      onDragEnd={() => setDraggedLectureId(null)}
                      onDragEnter={() => setDragOverLectureId(lecture.id)}
                      onDragLeave={() => setDragOverLectureId(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropOn(lecture.id)}
                      title="Sürükleyip bırakarak sıralayın"
                    >
                      <div className="lecture-drag-handle" aria-hidden="true">⋮⋮</div>
                      <div className="lecture-order">{index + 1}</div>
                      <div className="lecture-info">
                        <h4>{lecture.name || lecture.videoName}</h4>
                        <p>{lecture.videoDesc || 'Açıklama yok'}</p>
                        <div className="lecture-meta">
                          {lecture.lectureDuration && (
                            <span>⏱️ {formatLectureDuration(lecture.lectureDuration)}</span>
                          )}
                          {/* Durum Badge */}
                          {lecture.lectureAccessStatus === 'Published' ? (
                            <span className="lecture-published-badge">✅ Yayında</span>
                          ) : lecture.lectureAccessStatus === 'Archived' ? (
                            <span className="lecture-archived-badge">📦 Arşiv</span>
                          ) : (
                            <span className="lecture-draft-badge">📝 Taslak</span>
                          )}
                          {/* Erişilebilirlik Badge */}
                          {lecture.isAccessible ? (
                            <span className="lecture-accessible-badge">🔓 Erişilebilir</span>
                          ) : (
                            <span className="lecture-not-accessible-badge">🔒 Kilitli</span>
                          )}
                          {/* Yayın Durumu Badge (Schedule) */}
                          {lecture.isPublished ? (
                            <span className="lecture-schedule-published">✅ Anlık</span>
                          ) : lecture.scheduledPublishDate ? (
                            <span className="lecture-scheduled-badge">
                              📅 {new Date(lecture.scheduledPublishDate).toLocaleDateString('tr-TR', { 
                                day: 'numeric', 
                                month: 'short', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="lecture-actions">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => setEditingLecture(lecture)}
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon btn-danger"
                          onClick={() => handleDeleteLecture(lecture.id)}
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <StudentAssignment courseId={courseId} course={course} />
        )}

        {activeTab === 'progress' && (
          <CourseProgress course={course} />
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-header">
              <h3>⚙️ Kurs Ayarları</h3>
              <p className="settings-subtitle">Kurs bilgilerini düzenleyin ve yönetin</p>
            </div>

            <div className="settings-grid">
              {/* Temel Bilgiler Card */}
              <div className="settings-card">
                <div className="card-header">
                  <span className="card-icon">📝</span>
                  <h4>Temel Bilgiler</h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>
                      <span className="label-icon">📚</span>
                      Kurs Adı
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      value={course.name || ''}
                      onChange={(e) => setCourse(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Örn: Modern Web Geliştirme"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="label-icon">📄</span>
                      Kurs Açıklaması
                    </label>
                    <textarea
                      className="modern-textarea"
                      value={course.description || ''}
                      onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Kurs içeriği, hedef kitle ve kazanımlar hakkında detaylı bilgi girin..."
                      rows="5"
                    />
                  </div>
                </div>
              </div>

              {/* Görsel Yönetimi Card */}
              <div className="settings-card">
                <div className="card-header">
                  <span className="card-icon">🖼️</span>
                  <h4>Kurs Görseli</h4>
                </div>
                <div className="card-body">
                  <div className="thumbnail-upload-area">
                    {!course.imageUrl ? (
                      <label htmlFor="thumbnail-upload" className="upload-placeholder">
                        <div className="upload-icon">📸</div>
                        <div className="upload-text">
                          <strong>Görsel Yükle</strong>
                          <span>veya sürükleyip bırakın</span>
                        </div>
                        <div className="upload-specs">
                          <small>PNG, JPG veya WEBP • Maks 5MB</small>
                          <small>Önerilen: 1200×675px (16:9)</small>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          disabled={uploadingThumbnail}
                          id="thumbnail-upload"
                          className="file-input-hidden"
                        />
                      </label>
                    ) : (
                      <div className="thumbnail-preview-container">
                        <div className="thumbnail-preview">
                          <img 
                            src={course.imageUrl} 
                            alt="Kurs görseli" 
                            className="preview-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="thumbnail-actions">
                          <label htmlFor="thumbnail-upload-change" className="btn-change-image">
                            <span>🔄</span> Görseli Değiştir
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              disabled={uploadingThumbnail}
                              id="thumbnail-upload-change"
                              className="file-input-hidden"
                            />
                          </label>
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={() => setCourse(prev => ({ ...prev, imageUrl: '' }))}
                            title="Görseli kaldır"
                          >
                            <span>🗑️</span> Görseli Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                    {uploadingThumbnail && (
                      <div className="upload-progress">
                        <div className="progress-spinner"></div>
                        <span>Yükleniyor...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Yayın Durumu Card */}
              <div className="settings-card">
                <div className="card-header">
                  <span className="card-icon">🚀</span>
                  <h4>Yayın Durumu</h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>
                      <span className="label-icon">👁️</span>
                      Görünürlük
                    </label>
                    <div className="status-toggle-group">
                      <div 
                        className={`status-option ${!course.isAccessible ? 'active' : ''}`}
                        onClick={() => setCourse(prev => ({ ...prev, isAccessible: false }))}
                      >
                        <div className="status-option-icon">📝</div>
                        <div className="status-option-content">
                          <strong>Taslak</strong>
                          <span>Sadece siz görebilirsiniz</span>
                        </div>
                      </div>
                      <div 
                        className={`status-option ${course.isAccessible ? 'active' : ''}`}
                        onClick={() => setCourse(prev => ({ ...prev, isAccessible: true }))}
                      >
                        <div className="status-option-icon">✅</div>
                        <div className="status-option-content">
                          <strong>Yayında</strong>
                          <span>Öğrenciler erişebilir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
              <button 
                className="btn-save"
                onClick={async () => {
                  try {
                    await courseService.updateCourse(courseId, {
                      ...course,
                      id: parseInt(courseId)
                    });
                    toast.success('✅ Kurs ayarları başarıyla güncellendi!');
                  } catch (err) {
                    console.error('Güncelleme hatası:', err);
                    toast.error('❌ Güncelleme sırasında hata oluştu.');
                  }
                }}
              >
                <span>💾</span>
                Değişiklikleri Kaydet
              </button>
              <button 
                className="btn-reset"
                onClick={() => fetchCourseData()}
              >
                <span>🔄</span>
                Geri Al
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ders Düzenleme Modal */}
      {editingLecture && (
        <LectureEditModal
          lecture={editingLecture}
          onClose={() => setEditingLecture(null)}
          onSave={handleLectureUpdate}
          onStatusChange={handleLectureStatusChange}
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CourseManagement;
