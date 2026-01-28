import React, { useState, useRef } from 'react';
import { fileService, lectureService } from '../../../api';

const VideoUploadWizard = ({ courseId, onLectureCreated, lectureCount }) => {
  const [step, setStep] = useState(1); // 1: Dosya Seç & Bilgi Gir, 2: Yükleniyor ve Kaydediliyor
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    videoName: '',
    videoDesc: '',
    lectureDuration: '',
    isScheduled: false,
    scheduledPublishDate: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'preparing', 'uploading', 'saving'
  
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Video dosyası kontrolü
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Lütfen geçerli bir video dosyası seçin (MP4, WebM, OGG)');
      return;
    }

    // Dosya boyutu kontrolü (500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Dosya boyutu 500MB\'dan büyük olamaz.');
      return;
    }

    setSelectedFile(file);
    
    // Video adını anlamlı hale getir
    const fileExtension = file.name.split('.').pop();
    const baseFileName = file.name.replace(/\.[^/.]+$/, ''); // Uzantısız dosya adı
    const timestamp = Date.now();
    const lectureNumber = lectureCount + 1;
    const meaningfulVideoName = `Ders_${lectureNumber}_${baseFileName.substring(0, 30)}`
      .replace(/[^a-zA-Z0-9_\-]/g, '_') // Özel karakterleri temizle
      .replace(/_+/g, '_'); // Çift alt çizgileri tekle indir
    
    // Video süresini otomatik hesapla
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    
    videoElement.onloadedmetadata = function() {
      window.URL.revokeObjectURL(videoElement.src);
      const durationInMinutes = Math.ceil(videoElement.duration / 60);
      setFormData(prev => ({
        ...prev,
        videoName: meaningfulVideoName,
        lectureDuration: durationInMinutes.toString(),
      }));
    };
    
    videoElement.src = URL.createObjectURL(file);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setStep(2);
    setUploadProgress(0);

    try {
      // 1. Dosyayı sunucuya yükle
      setUploadStatus('uploading');
      const result = await fileService.uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // 2. Ders kaydı oluştur
      setUploadStatus('saving');
      const lectureData = {
        name: formData.name || formData.videoName,
        coursesId: courseId,
        videoName: formData.videoName,
        videoDesc: formData.videoDesc,
        videoUrl: result.filePath,
        lectureOrder: lectureCount + 1,
        lectureDuration: formData.lectureDuration ? parseInt(formData.lectureDuration) : null,
        createdAt: new Date().toISOString(),
        // Zamanlama özellikleri
        isPublished: !formData.isScheduled, // Zamanlanmışsa yayınlanmamış olarak başla
        scheduledPublishDate: formData.isScheduled && formData.scheduledPublishDate 
          ? new Date(formData.scheduledPublishDate).toISOString() 
          : null,
      };

      const createdLecture = await lectureService.createLecture(lectureData);
      
      // Başarılı - formu sıfırla
      onLectureCreated(createdLecture);
      resetWizard();
    } catch (err) {
      setError('Video yüklenirken veya ders kaydedilirken bir hata oluştu.');
      setStep(1);
    } finally {
      setSubmitting(false);
      setUploadStatus('');
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setFormData({
      name: '',
      videoName: '',
      videoDesc: '',
      lectureDuration: '',
      isScheduled: false,
      scheduledPublishDate: '',
    });
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="video-upload-wizard">
      <h3>Yeni Ders Ekle</h3>

      {error && (
        <div className="wizard-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Step 1: Dosya Seçimi ve Bilgi Girişi */}
      {step === 1 && (
        <div className="wizard-step step-form">
          {/* Dosya Seçim Alanı */}
          <div className="file-select-section">
            <div 
              className={`upload-zone ${selectedFile ? 'file-selected' : ''}`}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              {!selectedFile ? (
                <>
                  <div className="upload-icon">📁</div>
                  <h4>Video Dosyası Seç</h4>
                  <p>MP4, WebM veya OGG formatında bir video seçin</p>
                  <p className="upload-hint">Maksimum dosya boyutu: 500MB</p>
                  <button type="button" className="btn-select">
                    Dosya Seç
                  </button>
                </>
              ) : (
                <div className="file-ready">
                  <div className="file-ready-icon">✅</div>
                  <div className="file-info">
                    <h4>Dosya yüklenmeye hazır!</h4>
                    <p className="file-name">📹 {selectedFile.name}</p>
                    <p className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-change-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Farklı Dosya Seç
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {/* Bilgi Formu - Sadece dosya seçildiyse göster */}
          {selectedFile && (
            <form onSubmit={handleSubmit} className="lecture-form">
              <div className="form-group">
                <label htmlFor="name">Ders Başlığı *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Örn: 1. Hafta - Giriş"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="videoDesc">Ders Açıklaması</label>
                <textarea
                  id="videoDesc"
                  name="videoDesc"
                  value={formData.videoDesc}
                  onChange={handleInputChange}
                  placeholder="Bu derste neler öğrenilecek..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lectureDuration">Ders Süresi (dakika)</label>
                <input
                  type="number"
                  id="lectureDuration"
                  name="lectureDuration"
                  value={formData.lectureDuration}
                  onChange={handleInputChange}
                  placeholder="Otomatik hesaplanacak"
                  min="1"
                />
                <small>Video yüklenirken otomatik hesaplanır</small>
              </div>

              {/* Zamanlama Seçeneği */}
              <div className="form-group schedule-section">
                <div className="schedule-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      name="isScheduled"
                      checked={formData.isScheduled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isScheduled: e.target.checked,
                        scheduledPublishDate: e.target.checked ? prev.scheduledPublishDate : '',
                      }))}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">
                      📅 İleri Tarihte Yayınla
                    </span>
                  </label>
                </div>
                
                {formData.isScheduled && (
                  <div className="schedule-date-picker">
                    <label htmlFor="scheduledPublishDate">Yayınlanma Tarihi ve Saati *</label>
                    <input
                      type="datetime-local"
                      id="scheduledPublishDate"
                      name="scheduledPublishDate"
                      value={formData.scheduledPublishDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      required={formData.isScheduled}
                    />
                    <small>Ders bu tarih ve saatte otomatik olarak yayınlanacaktır.</small>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={resetWizard}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  🚀 Yükle ve Kaydet
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 2: Yükleniyor ve Kaydediliyor */}
      {step === 2 && (
        <div className="wizard-step step-progress">
          <div className="progress-info">
            <span className="file-name">📹 {selectedFile?.name}</span>
            <span className="progress-percent">{uploadProgress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="progress-status">
            {uploadStatus === 'uploading' && uploadProgress < 100 && 'Video sunucuya yükleniyor...'}
            {uploadStatus === 'uploading' && uploadProgress === 100 && 'Video işleniyor...'}
            {uploadStatus === 'saving' && 'Ders kaydediliyor...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUploadWizard;
