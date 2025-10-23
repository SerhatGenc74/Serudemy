import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCurrentAccountId from '../../hooks/useAccountId';
import useFileUpload from '../../hooks/useFileUpload';
import useLectureCount from '../../hooks/useLectureCount';
import '../../styles/LessonCreate.css';

const CreateLesson = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const accountId = useCurrentAccountId();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        videoDesc: ''
    });
    
    // Video upload state
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    
    // Hooks
    const { upload } = useFileUpload();
    const { data: currentLectureCount } = useLectureCount(courseId);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // File size check (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
            alert('Video dosyası boyutu 100MB\'dan küçük olmalıdır');
            return;
        }
        
        // Video type check
        if (!file.type.startsWith('video/')) {
            alert('Lütfen geçerli bir video dosyası seçin');
            return;
        }
        
        setSelectedVideoFile(file);
    console.debug('[CreateLesson] selected video file:', file.name, file.size, file.type);
        
        // Get video duration automatically
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            const duration = Math.round(video.duration);
            setVideoDuration(duration);
        };
        
        video.src = URL.createObjectURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Lütfen ders adını girin');
            return;
        }
        
        if (!selectedVideoFile) {
            alert('Lütfen bir video dosyası seçin');
            return;
        }
        
        setIsSubmitting(true);
        setSubmitMessage('');
        try {
            const videoResult = await upload(selectedVideoFile);
            const videoUrl = videoResult.filePath || videoResult.path || videoResult.fileUrl || '';
            const lessonData = {
                name: formData.name.trim(),
                videoDesc: formData.videoDesc.trim(),
                videoUrl: videoUrl,
                coursesId: parseInt(courseId),
                lectureDuration: videoDuration,
                lectureOrder: (currentLectureCount || 0) + 1,
                createdAt: new Date().toISOString()
            };
            const response = await fetch('http://localhost:5225/api/lecture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lessonData)
            });
            if (response.ok) {
                setSubmitMessage('✅ Ders başarıyla oluşturuldu!');
                setTimeout(() => {
                    navigate(`/course/${courseId}/lessons`);
                }, 2000);
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Ders oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Hata:', error);
            setSubmitMessage('❌ Hata: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/course/${courseId}/lessons`);
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    return (
        <div className="lesson-create-container">
            {/* Header */}
            <div className="lesson-create-header">
                <h1 className="lesson-create-title">➕ Yeni Ders Oluştur</h1>
                <p className="lesson-create-subtitle">
                    Kursunuza yeni bir ders ekleyin ve öğrencileriniz için içerik oluşturun
                </p>
                <div className="course-info">
                    <span className="course-badge">📚 Kurs ID: {courseId}</span>
                    <span className="lesson-count">📝 Mevcut Ders Sayısı: {currentLectureCount || 0}</span>
                </div>
            </div>


                    <div className="lesson-content-grid">
                <div className="lesson-form-container">
                    <form className="lesson-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2 className="section-title">📚 Ders Bilgileri</h2>
                            
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">
                                    Ders Adı *
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Örn: React Hooks Kullanımı"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="videoDesc">
                                    Ders Açıklaması
                                </label>
                                <textarea
                                    className="form-textarea"
                                    id="videoDesc"
                                    name="videoDesc"
                                    value={formData.videoDesc}
                                    onChange={handleInputChange}
                                    placeholder="Bu derste öğrencileriniz ne öğrenecek? Kısa bir açıklama yazın..."
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h2 className="section-title">🎥 Video Yükle</h2>
                            
                            <div className="form-group">
                                <label className="form-label">Video Dosyası *</label>
                                <div className="file-input-wrapper">
                                    <input
                                        className="file-input"
                                        type="file"
                                        id="video"
                                        accept="video/*"
                                        onChange={handleVideoFileChange}
                                        required
                                    />
                                    <label className="file-input-label" htmlFor="video">
                                        <div className="file-input-content">
                                            <span className="file-input-icon">
                                                {selectedVideoFile ? '🎬' : '📁'}
                                            </span>
                                            <div className="file-input-text">
                                                <div className="file-input-title">
                                                    {selectedVideoFile 
                                                        ? selectedVideoFile.name 
                                                        : 'Video Dosyası Seçin'
                                                    }
                                                </div>
                                                <div className="file-input-hint">
                                                    MP4, WebM, AVI formatları desteklenir (Max: 100MB)
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-submit"
                            >
                                {isSubmitting ? (
                                    <><span className="spinner">🔄</span> Ders Oluşturuluyor...</>
                                ) : (
                                    <>✅ Dersi Oluştur</>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn-cancel"
                                disabled={isSubmitting}
                            >
                                ❌ İptal Et
                            </button>
                        </div>

                        {/* Submit Message */}
                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                                {submitMessage}
                            </div>
                        )}
                    </form>
                </div>

                {/* Preview Section */}
                <div className="lesson-preview-section">
                    <div className="lesson-preview-container">
                        <h2 className="lesson-preview-header">📋 Ders Önizleme</h2>
                        
                        <div className="preview-content">
                            {/* Lesson Info Preview */}
                            <div className="preview-section">
                                <h3 className="preview-section-title">📚 Ders Bilgileri</h3>
                                <div className="preview-item">
                                    <strong>Ders Adı:</strong>
                                    <span>{formData.name || 'Henüz girilmedi'}</span>
                                </div>
                                <div className="preview-item">
                                    <strong>Açıklama:</strong>
                                    <span>{formData.videoDesc || 'Henüz girilmedi'}</span>
                                </div>
                            </div>

                            {/* Video Preview */}
                            <div className="preview-section">
                                <h3 className="preview-section-title">🎥 Video Bilgileri</h3>
                                
                                {selectedVideoFile ? (
                                    <div className="video-preview-info">
                                        <div className="video-details">
                                            <div className="video-detail-item">
                                                <span className="detail-label">📁 Dosya:</span>
                                                <span className="detail-value">{selectedVideoFile.name}</span>
                                            </div>
                                            <div className="video-detail-item">
                                                <span className="detail-label">📊 Boyut:</span>
                                                <span className="detail-value">{formatFileSize(selectedVideoFile.size)} MB</span>
                                            </div>
                                            <div className="video-detail-item">
                                                <span className="detail-label">🎬 Tip:</span>
                                                <span className="detail-value">{selectedVideoFile.type}</span>
                                            </div>
                                            {videoDuration > 0 && (
                                                <div className="video-detail-item">
                                                    <span className="detail-label">⏱️ Süre:</span>
                                                    <span className="detail-value">{formatDuration(videoDuration)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="video-placeholder">
                                        <div className="placeholder-icon">🎥</div>
                                        <div className="placeholder-text">Video seçildikten sonra burada görüntülenecek</div>
                                    </div>
                                )}
                            </div>

                            {/* Course Info */}
                            <div className="preview-section">
                                <h3 className="preview-section-title">📖 Kurs Bilgileri</h3>
                                <div className="course-preview-info">
                                    <div className="course-detail">
                                        <span className="detail-label">🆔 Kurs ID:</span>
                                        <span className="detail-value">{courseId}</span>
                                    </div>
                                    <div className="course-detail">
                                        <span className="detail-label">📝 Mevcut Ders:</span>
                                        <span className="detail-value">{currentLectureCount || 0} ders</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLesson;