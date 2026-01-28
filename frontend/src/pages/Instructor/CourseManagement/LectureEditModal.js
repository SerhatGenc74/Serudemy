import React, { useState, useEffect } from 'react';

const LectureEditModal = ({ lecture, onClose, onSave, onStatusChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    videoName: '',
    videoDesc: '',
    lectureDuration: '',
    lectureOrder: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lecture) {
      setFormData({
        name: lecture.name || '',
        videoName: lecture.videoName || '',
        videoDesc: lecture.videoDesc || '',
        lectureDuration: lecture.lectureDuration || '',
        lectureOrder: lecture.lectureOrder || '',
      });
    }
  }, [lecture]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await onSave({
        ...lecture,
        ...formData,
        lectureDuration: formData.lectureDuration ? parseInt(formData.lectureDuration) : null,
        lectureOrder: formData.lectureOrder ? parseInt(formData.lectureOrder) : null,
      });
      onClose();
    } catch (err) {
      setError('Ders güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeInfo = () => {
    if (!lecture) return { text: 'Taslak', class: 'draft', icon: '📝' };
    
    const status = lecture.lectureAccessStatus || 'Draft';
    const statusMap = {
      'Draft': { text: 'Taslak', class: 'draft', icon: '📝' },
      'Published': { text: 'Yayında', class: 'published', icon: '✅' },
      'Archived': { text: 'Arşivlenmiş', class: 'archived', icon: '📦' }
    };
    
    return statusMap[status] || statusMap['Draft'];
  };

  const handleStatusChange = async (newStatus) => {
    if (!onStatusChange) return;
    
    setSaving(true);
    try {
      await onStatusChange(lecture.id, newStatus);
      setError('');
    } catch (err) {
      setError('Durum değiştirilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (!lecture) return null;

  const statusInfo = getStatusBadgeInfo();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ders Düzenle</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Durum Yönetimi */}
          <div className="status-management-section">
            <div className="status-header">
              <label>Ders Durumu</label>
              <span className={`status-badge status-${statusInfo.class}`}>
                {statusInfo.icon} {statusInfo.text}
              </span>
            </div>
            <div className="status-actions">
              {lecture.lectureAccessStatus !== 'Published' && (
                <button
                  type="button"
                  className="btn-status btn-publish"
                  onClick={() => handleStatusChange('publish')}
                  disabled={saving}
                >
                  ✅ Yayınla
                </button>
              )}
              {lecture.lectureAccessStatus === 'Published' && (
                <button
                  type="button"
                  className="btn-status btn-unpublish"
                  onClick={() => handleStatusChange('unpublish')}
                  disabled={saving}
                >
                  📝 Taslağa Al
                </button>
              )}
              {lecture.lectureAccessStatus !== 'Archived' && (
                <button
                  type="button"
                  className="btn-status btn-archive"
                  onClick={() => handleStatusChange('archive')}
                  disabled={saving}
                >
                  📦 Arşivle
                </button>
              )}
            </div>
            
            {/* Erişilebilirlik Toggle */}
            <div className="accessibility-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={lecture.isAccessible || false}
                  onChange={(e) => onStatusChange && onStatusChange(lecture.id, 'accessibility', e.target.checked)}
                  disabled={saving}
                />
                <span className="toggle-text">
                  {lecture.isAccessible ? '🔓 Erişilebilir' : '🔒 Erişilebilir değil'}
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Ders Adı *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ders başlığı"
            />
          </div>

          <div className="form-group">
            <label>Video Adı</label>
            <input
              type="text"
              name="videoName"
              value={formData.videoName}
              onChange={handleChange}
              placeholder="Video dosya adı"
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              name="videoDesc"
              value={formData.videoDesc}
              onChange={handleChange}
              rows="4"
              placeholder="Ders açıklaması"
            />
          </div>

          <div className="form-group">
            <label>Sıra</label>
            <input
              type="number"
              name="lectureOrder"
              value={formData.lectureOrder}
              onChange={handleChange}
              min="1"
              placeholder="Sıra numarası"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LectureEditModal;
