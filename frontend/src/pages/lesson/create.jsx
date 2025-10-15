
import { useState ,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/LessonCreate.css';
import useCurrentAccountId from '../../hooks/useAccountId';

const CreateLesson = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const accountId = useCurrentAccountId();
    
    const [formData, setFormData] = useState({
        name: '',
        videoDesc: '',
        courseId: courseId || ''
    });
    
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [lectureOrder, setLectureOrder] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Kurs için mevcut ders sayısını al ve sırayı belirle
    useEffect(() => {
        const fetchLectureCount = async () => {
            try {
                const response = await fetch(`http://localhost:5225/api/lecture/course/${courseId}/count`);
                if (response.ok) {
                    const json = await response.json();
                    setLectureOrder(json.count + 1);
                }
            } catch (error) {
                console.error('Ders sayısı alınamadı:', error);
                setLectureOrder(1);
            }
        };

        if (courseId) {
            fetchLectureCount();
        }
    }, [courseId]);

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
                const duration = Math.round(video.duration); // saniyeye çevir
                setVideoDuration(duration);
                console.log('Video süresi:', duration, 'Saniye');
            };
            
            video.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        
        try {
            let videoUrl = '';
            
            // Video dosyası varsa yükle
            if (selectedVideoFile) {
                console.log('Video yükleniyor:', selectedVideoFile.name);
                const videoFormData = new FormData();
                videoFormData.append('file', selectedVideoFile);
                
                const videoResponse = await fetch('http://localhost:5225/api/file/upload', {
                    method: 'POST',
                    body: videoFormData
                });
                
                if (videoResponse.ok) {
                    const videoResult = await videoResponse.json();
                    videoUrl = videoResult.filePath;
                    console.log('Video yüklendi:', videoResult);
                } else {
                    throw new Error('Video yükleme başarısız');
                }
            } else {
                throw new Error('Video dosyası seçilmedi');
            }
            
            // Dersi oluştur
            const submitData = {
                name: formData.name,
                videoName: selectedVideoFile.name,
                VideoDesc: formData.videoDesc,
                videoUrl: videoUrl,
                LectureOrder: lectureOrder,
                lectureDuration: videoDuration,
                coursesId: parseInt(courseId),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            console.log('Ders oluşturma verisi:', submitData);

            const response = await fetch('http://localhost:5225/api/lecture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });
            
            console.log('Lesson create response status:', response.status);

            if (response.ok) {
                setSubmitMessage('✅ Ders başarıyla oluşturuldu!');
                // 2 saniye sonra dersler sayfasına yönlendir
                setTimeout(() => {
                    navigate(`/course/${courseId}/lessons`);
                }, 2000);
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Ders oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage(`❌ Hata: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="lesson-create-title">📚 Yeni Ders Oluştur</h1>
                    <p className="lesson-create-subtitle">Kursunuza yeni bir ders ekleyin</p>
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
                                    required
                                />
                                <label htmlFor="video-input" className="file-input-label">
                                    <span className="file-input-icon">🎬</span>
                                    <div className="file-info">
                                        <div className="file-name">
                                            {selectedVideoFile ? selectedVideoFile.name : "Video seçin"}
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
                                � Video Açıklaması
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
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>✅ Dersi Oluştur</>
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
                            <div className="lesson-number">#{lectureOrder}</div>
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
                                    <span className="stat-value">{lectureOrder}. ders</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">⏰ Süre:</span>
                                    <span className="stat-value">{videoDuration || '?'} dakika</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">📁 Video:</span>
                                    <span className="stat-value">{selectedVideoFile ? '✅ Seçildi' : '❌ Seçilmedi'}</span>
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