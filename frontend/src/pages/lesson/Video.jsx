import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useLecturesForCourse from '../../hooks/useLecturesForCourse';
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useCurrentAccountId from "../../hooks/useAccountId";
import VideoPlayer from "../../components/video/VideoPlayer";
import VideoInfo from "../../components/video/VideoInfo";
import LectureNavigation from "../../components/video/LectureNavigation";
import LecturesList from "../../components/video/LecturesList";
import '../../styles/Video.css';

const Video = () => {
    const param = useParams();
    const accountId = useCurrentAccountId();
    const videoRef = useRef(null);
    const isSavingRef = useRef(false);
    const progressIdRef = useRef(null); // Ref ile tut
    const wasRewoundRef = useRef(false); // Geri sarma durumunu takip et
    
    
    const { data: lecture, loading, error } = useFetch(`http://localhost:5225/api/Lecture/${param.lectureId}`);
    const {data:alllectures,loading:alllecturesloading,error:alllectureserror} = useLecturesForCourse(param.courseId);
    const {data: existingProgress, loading: progressLoading} = useFetch(`http://localhost:5225/api/StudentProgress/progress/${accountId}/${param.lectureId}`);

    const [progressId, setProgressId] = useState(null);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [lecturesCompleted, setLecturesCompleted] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    // ProgressId değiştiğinde ref'i de güncelle
    useEffect(() => {
        progressIdRef.current = progressId;
        console.log('🔄 ProgressId güncellendi:', progressId);
    }, [progressId]);

    const totalLectures = alllectures ? alllectures.length : 0;
    const currentLectureIndex = alllectures ? alllectures.findIndex(lec => lec.id == param.lectureId) : -1;
    const totalDuration = alllectures ? alllectures.reduce((sum, lec) => sum + (lec.lectureDuration || 0), 0) : 0;
    
    // Progress yükleme
    useEffect(() => {
        if (existingProgress && existingProgress.id) {
            console.log('📥 Mevcut progress yükleniyor:', existingProgress);
            const id = existingProgress.id;
            setProgressId(id);
            progressIdRef.current = id; // Ref'i de hemen set et
            setWatchedSeconds(existingProgress.watchedSeconds || 0);
            setLecturesCompleted(existingProgress.lecturesCompleted || false);
            setPlaybackPosition(existingProgress.playbackPosition || 0);
            setProgressPercentage(existingProgress.progressPerc || 0);
            
            // Video pozisyonunu ayarla
            if (videoRef.current && existingProgress.playbackPosition > 0) {
                videoRef.current.currentTime = existingProgress.playbackPosition;
                
                // Video başlatıldığında geri sarma kontrolü yap
                setTimeout(() => {
                    if (videoRef.current) {
                        const currentTime = videoRef.current.currentTime;
                        const lastPosition = existingProgress.playbackPosition;
                        
                        if (currentTime < lastPosition - 1) {
                            console.log('🔄 Video geri sarma modunda başlatıldı - son pozisyon:', lastPosition, 'şimdiki:', currentTime);
                            wasRewoundRef.current = true;
                        }
                    }
                }, 100); // Video yüklenmesi için kısa bekleme
            }
        }
    }, [existingProgress]);

    // Progress kaydetme fonksiyonu - useCallback ile güncel state'leri kullan
    const saveProgress = useCallback(async () => {
        if (!accountId || !lecture) {
            console.log('⚠️ AccountId veya Lecture yok, kayıt yapılmıyor');
            return;
        }

        if (isSavingRef.current) {
            console.log('⏳ Zaten kayıt yapılıyor, atlanıyor');
            return;
        }

        if (wasRewoundRef.current) {
            console.log('⏪ GERİ SARMA DURUMUNDA - Kayıt yapılmıyor');
            return;
        }

        isSavingRef.current = true;

        const video = videoRef.current;
        if (!video) {
            console.log('⚠️ Video ref yok');
            isSavingRef.current = false;
            return;
        }

        const currentWatchedSeconds = Math.floor(video.currentTime);
        const currentPlaybackPosition = Math.floor(video.currentTime);
        const calculatedProgressPerc = lecture.lectureDuration > 0 
            ? parseFloat(((currentWatchedSeconds / lecture.lectureDuration) * 100).toFixed(2))
            : 0;

        const payload = {
            AccountId: parseInt(accountId),
            LecturesId: parseInt(param.lectureId),
            WatchedSeconds: currentWatchedSeconds,
            PlaybackPosition: currentPlaybackPosition,
            ProgressPerc: calculatedProgressPerc,
            LecturesCompleted: lecturesCompleted
        };

        console.log('💾 Progress kaydediliyor...');
        console.log('📊 State Progress ID:', progressId);
        console.log('📊 Ref Progress ID:', progressIdRef.current);
        console.log('📦 Payload:', payload);

        try {
            // Ref'ten progressId'yi al - bu daha güncel
            const currentProgressId = progressIdRef.current;
            const method = currentProgressId ? 'PUT' : 'POST';
            const url = currentProgressId 
                ? `http://localhost:5225/api/StudentProgress/${currentProgressId}` 
                : 'http://localhost:5225/api/StudentProgress';
            
            console.log(`🔄 ${method} isteği: ${url}`);
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                console.error(`❌ ${method} hatası:`, error);
            } else {
                const result = await response.json();
                console.log(`✅ ${method} başarılı:`, result);
                
                if (!currentProgressId && result.id) {
                    console.log('🆕 Yeni Progress ID set ediliyor:', result.id);
                    setProgressId(result.id);
                    progressIdRef.current = result.id; // Ref'i de güncelle
                } else if (currentProgressId) {
                    console.log('♻️ Mevcut progress güncellendi, ID:', currentProgressId);
                }
                
                setWatchedSeconds(currentWatchedSeconds);
                setPlaybackPosition(currentPlaybackPosition);
                setProgressPercentage(calculatedProgressPerc);
            }
        } catch (err) {
            console.error('❌ Progress kaydetme hatası:', err);
        } finally {
            isSavingRef.current = false;
        }
    }, [accountId, lecture, param.lectureId, progressId, lecturesCompleted]); // Tüm bağımlılıklar

    // Video event handlers
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !lecture) return;

        let lastPosition = playbackPosition;

        const handlePlay = () => {
            console.log('▶️ Video oynatılıyor');
        };

        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            // Geri sarma kontrolü
            if (currentTime < lastPosition - 1) {
                console.log('⏪ Geri sarılma Modunda İşlemler durduruluyor');
                wasRewoundRef.current = true;
                return;
            }
            
            // Geri sarma modundayken, video son kayıtlı pozisyona ulaştı mı kontrol et
            if (wasRewoundRef.current) {
                // Video son kayıtlı pozisyona eşit veya geçti mi?
                if (currentTime >= playbackPosition - 0.5) {
                    wasRewoundRef.current = false;
                    console.log('✅ Video son pozisyona ulaştı - kayıt moduna geçildi. Son pos:', playbackPosition, 'Şimdiki:', currentTime);
                } else {
                    console.log('⏸️ Geri sarma modunda - henüz son pozisyona ulaşmadı. Hedef:', playbackPosition, 'Şimdiki:', currentTime);
                }
            }
            
            lastPosition = currentTime;
        };

        const handlePause = () => {
            if (wasRewoundRef.current) {
                console.log('⏸️ Geri sarma durumunda - kayıt yapılmıyor');
                return;
            }
            console.log('⏸️ Video durduruldu - kayıt yapılıyor');
            saveProgress();
        };

        const handleEnded = () => {
            if (wasRewoundRef.current) {
                console.log('🎬 Video bitti ama geri sarma olduğu için kayıt yapılmıyor');
                wasRewoundRef.current = false;
                return;
            }
            
            console.log('🎬 Video bitti!');
            
            // Video tamamlandıysa completed olarak işaretle
            if (lecture.lectureDuration > 0 && Math.floor(video.duration) >= lecture.lectureDuration - 5) {
                setLecturesCompleted(true);
                console.log('✅ Ders tamamlandı olarak işaretleniyor');
            }
            
            saveProgress();
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
        };
    }, [lecture]);

    // Otomatik kaydetme - Ayrı useEffect
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !lecture) return;

        console.log('⏰ Otomatik kayıt interval başlatıldı');
        
        const intervalId = setInterval(() => {
            if (!video.paused && !video.ended) {
                console.log('⏰ Otomatik kayıt tetiklendi (10 saniye interval)');
                saveProgress();
            }
        }, 10000); // 10 saniye yap

        return () => {
            console.log('⏰ Otomatik kayıt interval temizlendi');
            clearInterval(intervalId);
        };
    }, [lecture, progressId, lecturesCompleted]); // saveProgress bu state'lere bağlı

    console.log(lecture);
    if (loading || alllecturesloading) return (
        <div className="video-page-container">
            <div className="loading-state">
                🔄 Video yükleniyor...
            </div>
        </div>
        
    );
    
    if (error || alllectureserror) return (
        <div className="video-page-container">
            <div className="error-state">
                ❌ Video yüklenirken bir hata oluştu.
            </div>
        </div>
    );

    return (
        <div className="video-page-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <nav className="breadcrumb-nav">
                    <Link to="/" className="breadcrumb-link">🏠 Ana Sayfa</Link>
                    <span className="breadcrumb-separator">›</span>
                    <Link to={`/courses/${param.courseId}`} className="breadcrumb-link">📚 Kurs Detayı</Link>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">🎥 {lecture?.name || 'Video'}</span>
                </nav>
            </div>

            <div className="video-content">
                {/* Ana Video Bölümü */}
                <div className="video-section">
                    <div className="video-header">
                        <h1 className="video-title">{lecture?.name || 'Video Başlığı'}</h1>
                        <div className="video-meta">
                            <div className="meta-item">
                                <span>📹</span>
                                <span>Ders {currentLectureIndex + 1} / {totalLectures}</span>
                            </div>
                            <div className="meta-item">
                                <span>⏱️</span>
                                <span>{(lecture?.lectureDuration / 60).toFixed(2)} dakika </span>
                            </div>
                            <div className="meta-item">
                                <span>👁️</span>
                                <span>İzlenen: {Math.floor(watchedSeconds / 60)}:{(watchedSeconds % 60).toString().padStart(2, '0')}</span>
                            </div>
                            
                                <div className="meta-item">
                                    <span>📊</span>
                                    <span>%{Math.floor(progressPercentage)} tamamlandı</span>
                                </div>
                        </div>
                    </div>

                    <div className="video-wrapper">
                    {
                        lecture && (
                            lecture.videoUrl ? (
                                <video 
                                    ref={videoRef}
                                    width="640" 
                                    height="360" 
                                    controls 
                                    key={lecture.videoUrl}
                                >
                                    <source src={`http://localhost:5225${lecture.videoUrl}`} type="video/mp4" />
                                    Tarayıcınız video etiketini desteklemiyor.
                                </video>
                            ) : (
                                <div className="no-video">
                                    📹 Bu ders için video bulunmamaktadır.
                                </div>
                            )
                        )
                    }
                    </div>

                    <div className="video-controls">
                        <div className="progress-section">
                            <div className="progress-label">
                                Kurs İlerlemesi: {Math.round(progressPercentage)}%
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="video-actions">
                            {currentLectureIndex > 0 && (
                                <Link 
                                    to={`/course/${param.courseId}/Video/${alllectures[currentLectureIndex - 1].id}`}
                                    className="action-btn btn-secondary"
                                >
                                    ⬅️ Önceki Ders
                                </Link>
                            )}
                            
                            <button className="action-btn btn-secondary">
                                🔖 Favori Ekle
                            </button>
                            
                            <button className="action-btn btn-secondary">
                                💬 Not Ekle
                            </button>
                            
                            {currentLectureIndex < totalLectures - 1 && (
                                <Link 
                                    to={`/course/${param.courseId}/Video/${alllectures[currentLectureIndex + 1].id}`}
                                    className="action-btn btn-primary"
                                >
                                    Sonraki Ders ➡️
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ders Listesi Sidebar */}
                <div className="playlist-sidebar">
                    <div className="playlist-header">
                        <h2 className="playlist-title">
                            📚 Kurs İçeriği
                        </h2>
                        <div className="playlist-info">
                            {totalLectures} ders • {totalDuration / 60} dakika
                        </div>
                    </div>

                    <ul className="lectures-list">
                        {alllectures && alllectures.map((lec, index) => (
                            <li key={lec.id} className="lecture-item">
                                <Link 
                                    to={`/course/${param.courseId}/Video/${lec.id}`}
                                    className={`lecture-link ${lec.id == param.lectureId ? 'active' : ''}`}
                                >
                                    <div className="lecture-number">{index + 1}</div>
                                    <div className="lecture-details">
                                        <div className="lecture-name" title={lec.name}>
                                            {lec.name}
                                        </div>
                                        <div className="lecture-duration">
                                            ⏱️ {lec.lectureDuration || "Dakika Hesaplanmadı"} Saniye
                                        </div>
                                    </div>
                                    <div className="lecture-status">
                                        {lec.id == param.lectureId && lecturesCompleted ? (
                                            <span className="status-completed">✅</span>
                                        ) : lec.id == param.lectureId || index < currentLectureIndex ? (
                                            <span className="status-current">▶️</span>
                                        ) : (
                                            <span className="status-locked">🔒</span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default Video;
