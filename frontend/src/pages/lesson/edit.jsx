import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import '../../styles/LessonCreate.css';
import useCurrentAccountId from '../../hooks/useAccountId';

const EditLesson = () => {
    const { courseId, lectureId } = useParams();
    const navigate = useNavigate();
    const accountId = useCurrentAccountId();
    
    // Mevcut ders bilgilerini al
    const { data: lecture, loading, error } = useFetch(`http://localhost:5225/api/lecture/${lectureId}`);
    
    const [formData, setFormData] = useState({
        name: '',
        videoDesc: '',
        courseId: courseId || ''
    });
    
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Ders bilgileri geldiğinde form'u doldur
    useEffect(() => {
        if (lecture) {
            setFormData({
                name: lecture.name || '',
                videoDesc: lecture.videoDesc || '',
                courseId: courseId || ''
            });
            setVideoDuration(lecture.lectureDuration || 0);
            setCurrentVideoUrl(lecture.videoUrl || '');
        }
    }, [lecture, courseId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Video file size kontrolü (100MB limit)
            if (file.size > 100 * 1024 * 1024) {
                alert('Video dosyası boyutu 100MB\'dan küçük olmalıdır');
                return;
            }
            
            // Video type kontrolü
            if (!file.type.startsWith('video/')) {
                alert('Lütfen geçerli bir video dosyası seçin');
                return;
            }
            
            setSelectedVideoFile(file);
            
            // Video süresini otomatik al
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                const duration = Math.round(video.duration / 60); // dakikaya çevir
                setVideoDuration(duration);
                console.log('Video süresi:', duration, 'dakika');
            };
            
            video.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        
        try {
            let videoUrl = currentVideoUrl;
            let videoName = lecture?.videoName;
            
            // Yeni video dosyası seçilmişse yükle
            if (selectedVideoFile) {
                console.log('Video güncelleniyor:', selectedVideoFile.name);
                const fileFormData = new FormData();
                fileFormData.append('file', selectedVideoFile);
                
                // Existing file path query parameter olarak gönder
                const existingFilePath = currentVideoUrl || '';
                const updateUrl = `http://localhost:5225/api/file/update?existingFilePath=${encodeURIComponent(existingFilePath)}`;
                
                const fileResponse = await fetch(updateUrl, {
                    method: 'PUT',
                    body: fileFormData
                });
                
                if (fileResponse.ok) {
                    const fileResult = await fileResponse.json();
                    videoUrl = fileResult.filePath;
                    videoName = selectedVideoFile.name;
                    console.log('Video güncellendi:', fileResult);
                } else {
                    throw new Error('Video güncelleme başarısız');
                }
            }
            
            // Dersi güncelle
            const submitData = {
                name: formData.name,
                videoName: videoName,
                videoDesc: formData.videoDesc,
                videoUrl: videoUrl,
                lectureOrder: lecture?.lectureOrder,
                lectureDuration: videoDuration,
                coursesId: parseInt(courseId),
                updatedAt: new Date().toISOString()
            };
            
            console.log('Ders güncelleme verisi:', submitData);

            const response = await fetch(`http://localhost:5225/api/lecture/${lectureId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });
            
            if (response.ok) {
                setSubmitMessage('✅ Ders başarıyla güncellendi!');
                setTimeout(() => {
                    navigate(`/course/${courseId}/lessons`);
                }, 2000);
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Ders güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error updating lesson:', error);
            setSubmitMessage(`❌ Hata: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="lesson-create-container">
            <div className="loading-container">
                <div className="loading-spinner">🔄</div>
                <div className="loading-text">Ders bilgileri yükleniyor...</div>
            </div>
        </div>
    );
    
    if (error || !lecture) return (
        <div className="lesson-create-container">
            <div className="error-container">
                <div className="error-text">❌ Hata: {error?.message || 'Ders bulunamadı'}</div>
                <button 
                    className="btn btn-cancel"
                    onClick={() => navigate(`/course/${courseId}/lessons`)}
                >
                    ← Derslere Dön
                </button>
            </div>
        </div>
    );

    return (
        <div className="lesson-create-container">
            <div className="lesson-create-content">
                <a 
                    href={`/course/${courseId}/lessons`} 
                    className="back-button"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/course/${courseId}/lessons`);
                    }}
                >
                    ← Derslere Geri Dön
                </a>
                
                <div className="lesson-create-header">
                    <h1 className="lesson-create-title">✏️ Ders Düzenle</h1>
                    <p className="lesson-create-subtitle">Ders bilgilerini güncelleyin</p>
                </div>

                <div className="lesson-content-grid">
                    <div className="lesson-form-container">
                        <form onSubmit={handleSubmit} className="lesson-form">
                            <div className="form-section-title">📝 Ders Bilgileri</div>
                            
                            <div className="form-group full-width">
                                <label className="form-label">
                                    📖 Ders Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ders adını girin..."
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    🎥 Video Dosyası
                                </label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        className="file-input"
                                        accept="video/*"
                                        onChange={handleVideoFileChange}
                                        id="video-input"
                                    />
                                    <label htmlFor="video-input" className="file-input-label">
                                        <span className="file-input-icon">🎬</span>
                                        <div className="file-info">
                                            <div className="file-name">
                                                {selectedVideoFile 
                                                    ? selectedVideoFile.name 
                                                    : (lecture?.videoName || "Mevcut video (değiştirmek için seçin)")
                                                }
                                            </div>
                                            <div className="file-hint">MP4, AVI, MOV formatında (Max: 100MB)</div>
                                            {videoDuration > 0 && (
                                                <div className="video-duration">
                                                    ⏱️ Süre: {videoDuration} dakika
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    📝 Video Açıklaması
                                </label>
                                <textarea
                                    name="videoDesc"
                                    value={formData.videoDesc}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Video hakkında açıklama yazın..."
                                    required
                                ></textarea>
                            </div>

                            {submitMessage && (
                                <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                                    {submitMessage}
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-cancel"
                                    onClick={() => navigate(`/course/${courseId}/lessons`)}
                                    disabled={isSubmitting}
                                >
                                    ❌ İptal
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading-spinner">🔄</span>
                                            Güncelleniyor...
                                        </>
                                    ) : (
                                        <>✅ Dersi Güncelle</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="lesson-preview-container">
                        <div className="form-section-title">👁️ Ön İzleme</div>
                        
                        <div className="lesson-preview-card">
                            <div className="lesson-preview-header">
                                <div className="lesson-number">#{lecture?.lectureOrder || '?'}</div>
                                <div className="lesson-meta">
                                    <span className="lesson-badge">📹 Video Ders</span>
                                    {videoDuration > 0 && (
                                        <span className="duration-badge">⏱️ {videoDuration} dk</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="lesson-preview-content">
                                <h3 className="lesson-preview-title">
                                    {formData.name || "Ders başlığı..."}
                                </h3>
                                
                                <div className="video-preview-section">
                                    {selectedVideoFile ? (
                                        <div className="video-preview-info">
                                            <div className="video-icon">🎬</div>
                                            <div className="video-details">
                                                <div className="video-name">{selectedVideoFile.name}</div>
                                                <div className="video-size">
                                                    {(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </div>
                                            </div>
                                        </div>
                                    ) : currentVideoUrl ? (
                                        <div className="video-preview-info">
                                            <div className="video-icon">🎬</div>
                                            <div className="video-details">
                                                <div className="video-name">{lecture?.videoName || 'Mevcut video'}</div>
                                                <div className="video-size">Mevcut video dosyası</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="video-placeholder">
                                            <div className="placeholder-icon">🎥</div>
                                            <div className="placeholder-text">Video henüz seçilmedi</div>
                                        </div>
                                    )}
                                </div>

                                <div className="lesson-description-preview">
                                    <h4>📄 Açıklama</h4>
                                    <p>{formData.videoDesc || "Ders açıklaması henüz girilmedi..."}</p>
                                </div>

                                <div className="lesson-stats-preview">
                                    <div className="stat-item">
                                        <span className="stat-label">📊 Sıra:</span>
                                        <span className="stat-value">{lecture?.lectureOrder || '?'}. ders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">⏰ Süre:</span>
                                        <span className="stat-value">{videoDuration || '?'} dakika</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">📁 Video:</span>
                                        <span className="stat-value">
                                            {selectedVideoFile ? '🔄 Yeni seçildi' : 
                                             currentVideoUrl ? '✅ Mevcut' : '❌ Yok'}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">📅 Durum:</span>
                                        <span className="stat-value">✏️ Düzenleniyor</span>
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

export default EditLesson;
