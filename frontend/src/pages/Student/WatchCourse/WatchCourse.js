import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, lectureService, studentProgressService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './WatchCourse.css';

const WatchCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, notes, about
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [savedPlaybackPosition, setSavedPlaybackPosition] = useState(0);
  const [isLectureCompleted, setIsLectureCompleted] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Backend URL'i
  const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5225').replace('/api', '');

  const fetchCourseData = useCallback(async () => {
    try {
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      if (!courseData?.courseId) {
        setLoading(false);
        return;
      }

      // Öğrencilere yayınlanmış ve zamanlanmış (kilitli) dersleri göster
      const lecturesData = await lectureService.getLecturesForStudent(courseData.courseId);
      const sortedLectures = (lecturesData || []).sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
      setLectures(sortedLectures);

      // Sadece yayınlanmış dersleri say (progress için)
      const publishedLectures = sortedLectures.filter(l => l.isPublished);
      const firstPublishedLecture = publishedLectures[0];

      // Bölümleri grupla ve hepsini aç
      const sections = {};
      sortedLectures.forEach((lecture, index) => {
        const sectionNum = Math.floor(index / 5) + 1;
        sections[sectionNum] = true;
      });
      setExpandedSections(sections);

      if (user?.id) {
        const completed = await studentProgressService.getCompletedLessons(user.id, courseData.courseId);
        const completedLectureIds = completed?.map(p => p.lecturesId) || [];
        setCompletedLectures(completedLectureIds);
        
        // Sadece yayınlanmış dersler için tamamlanma kontrolü
        if (completedLectureIds.length === publishedLectures.length && publishedLectures.length > 0) {
          setIsCourseCompleted(true);
        }

        try {
          const lastProgress = await studentProgressService.getLastProgress(user.id, courseData.courseId);
          if (lastProgress?.lectures) {
            const lastLecture = publishedLectures.find(l => l.id === lastProgress.lecturesId) || firstPublishedLecture;
            setCurrentLecture(lastLecture);
            // Son kaldığı pozisyonu ve tamamlanma durumunu kaydet
            setSavedPlaybackPosition(lastProgress.playbackPosition || 0);
            setIsLectureCompleted(lastProgress.lecturesCompleted || false);
          } else {
            setCurrentLecture(firstPublishedLecture);
            setSavedPlaybackPosition(0);
            setIsLectureCompleted(false);
          }
        } catch {
          setCurrentLecture(firstPublishedLecture);
          setSavedPlaybackPosition(0);
          setIsLectureCompleted(false);
        }
      } else {
        setCurrentLecture(firstPublishedLecture);
        setSavedPlaybackPosition(0);
        setIsLectureCompleted(false);
      }
    } catch (error) {
      console.error('Kurs verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Video URL'ini oluştur
  const getVideoUrl = (videoUrl) => {
    if (!videoUrl) return '';
    
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      return videoUrl;
    }
    
    const cleanPath = videoUrl.replace(/\\/g, '/').replace(/^\//, '');
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Dersi seç
  const handleSelectLecture = async (lecture) => {
    // Kilitli (zamanlanmış) derse tıklanınca engelle
    if (!lecture.isPublished) {
      return;
    }
    
    setCurrentLecture(lecture);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // En son kaldığı yeri yükle
    if (user?.id && lecture?.id) {
      try {
        const progressData = await studentProgressService.hasProgress(user.id, lecture.id);
        if (progressData?.result && progressData.progress) {
          setSavedPlaybackPosition(progressData.progress.playbackPosition || 0);
          setIsLectureCompleted(progressData.progress.lecturesCompleted || false);
        } else {
          setSavedPlaybackPosition(0);
          setIsLectureCompleted(false);
        }
      } catch (error) {
        console.error('Playback pozisyonu yüklenemedi:', error);
        setSavedPlaybackPosition(0);
        setIsLectureCompleted(false);
      }
    }
  };

  // Video event handlers
  const handleTimeUpdate = useCallback(async () => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(current);

    // İlerlemeyi kaydet (her 10 saniyede bir veya son 5 saniyede daha sık)
    const isNearEnd = total - current <= 5;
    const shouldSave = (Math.floor(current) % 10 === 0) || (isNearEnd && Math.floor(current) % 2 === 0);
    
    if (shouldSave && user?.id && currentLecture && total > 0) {
      try {
        const hasExisting = await studentProgressService.hasProgress(user.id, currentLecture.id);
        
        // Eğer video zaten tamamlanmışsa veya kullanıcı geriye sardıysa güncelleme yapma
        if (hasExisting?.result) {
          const existingProgress = hasExisting.progress;
          
          // Video zaten tamamlanmışsa güncelleme yapma
          if (existingProgress.lecturesCompleted === true) {
            return;
          }
          
          // Mevcut pozisyon, kaydedilmiş pozisyondan küçükse (geriye sarma) güncelleme yapma
          if (Math.floor(current) < (existingProgress.playbackPosition || 0)) {
            return;
          }
        }
        
        const progress = current / total;
        // Son 5 saniyede veya %95'in üzerinde ise tamamlandı say
        const isCompleted = progress >= 0.95 || (total - current <= 5);
        
        const progressData = {
          accountId: parseInt(user.id),
          lecturesId: currentLecture.id,
          progressPerc: isCompleted ? 100 : Math.min(progress * 100, 99),
          lecturesCompleted: isCompleted,
          playbackPosition: Math.floor(current),
          watchedSeconds: Math.floor(current),
        };

        if (hasExisting?.result) {
          await studentProgressService.updateProgress(hasExisting.progressId, progressData);
        } else {
          await studentProgressService.createProgress(progressData);
        }

        if (isCompleted && !completedLectures.includes(currentLecture.id)) {
          setCompletedLectures(prev => [...prev, currentLecture.id]);
        }
      } catch (error) {
        console.error('İlerleme kaydedilemedi:', error);
      }
    }
  }, [user, currentLecture, completedLectures]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // Tamamlanmış videolarda baştan başlat, tamamlanmamışlarda kaldığı yerden devam et
      if (isLectureCompleted) {
        // Tamamlanmış video - başa sar ve duraklat
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(false);
      } else if (savedPlaybackPosition > 0 && savedPlaybackPosition < videoRef.current.duration - 5) {
        // Tamamlanmamış video - en son kaldığı yerden devam et (son 5 saniye hariç)
        videoRef.current.currentTime = savedPlaybackPosition;
        setCurrentTime(savedPlaybackPosition);
        
        // Video yüklendikten sonra otomatik oynat
        if (isPlaying) {
          videoRef.current.play().catch(err => {
            console.log('Auto-play prevented:', err);
            setIsPlaying(false);
          });
        }
      } else {
        // Baştan başlat
        if (isPlaying) {
          videoRef.current.play().catch(err => {
            console.log('Auto-play prevented:', err);
            setIsPlaying(false);
          });
        }
      }
    }
  };

  const handleEnded = async () => {
    // Video bittiğinde %100 tamamlandı olarak kaydet
    if (user?.id && currentLecture && videoRef.current) {
      try {
        const hasExisting = await studentProgressService.hasProgress(user.id, currentLecture.id);
        const progressData = {
          accountId: parseInt(user.id),
          lecturesId: currentLecture.id,
          progressPerc: 100,
          lecturesCompleted: true,
          playbackPosition: Math.floor(videoRef.current.duration),
          watchedSeconds: Math.floor(videoRef.current.duration),
        };

        if (hasExisting?.result) {
          await studentProgressService.updateProgress(hasExisting.progressId, progressData);
        } else {
          await studentProgressService.createProgress(progressData);
        }

        if (!completedLectures.includes(currentLecture.id)) {
          setCompletedLectures(prev => [...prev, currentLecture.id]);
        }
        
        // Sadece yeni tamamlanan videolarda sonraki derse geç (zaten tamamlanmışsa geçme)
        const wasAlreadyCompleted = isLectureCompleted;
        setIsLectureCompleted(true);
        
        // Tüm derslerin tamamlanıp tamamlanmadığını kontrol et
        const updatedCompleted = completedLectures.includes(currentLecture.id) 
          ? completedLectures 
          : [...completedLectures, currentLecture.id];
        
        if (updatedCompleted.length === lectures.length) {
          // Tüm dersler tamamlandı!
          setIsCourseCompleted(true);
        } else if (!wasAlreadyCompleted) {
          // Eğer video zaten tamamlanmışsa, sonraki derse otomatik geçme
          const currentIndex = lectures.findIndex(l => l.id === currentLecture.id);
          if (currentIndex < lectures.length - 1) {
            // 1 saniye bekle sonra geç
            setTimeout(() => {
              handleSelectLecture(lectures[currentIndex + 1]);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Video bitişi kaydedilemedi:', error);
      }
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(true);
      // Overlay'i kaldır - öğrenci videoyu inceleyebilsin
      setIsLectureCompleted(false);
      videoRef.current.play();
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const skipForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          console.log('Play prevented:', err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  }, [isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipBackward();
          break;
        case 'arrowright':
          e.preventDefault();
          skipForward();
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(v => Math.min(v + 0.1, 1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(v => Math.max(v - 0.1, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayPause, toggleMute, skipBackward, skipForward]);

  // Süreyi formatla
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // İlerleme yüzdesini hesapla
  const calculateProgress = () => {
    if (lectures.length === 0) return 0;
    return Math.round((completedLectures.length / lectures.length) * 100);
  };

  // Sonraki/Önceki ders
  const goToNextLecture = () => {
    const currentIndex = lectures.findIndex(l => l.id === currentLecture?.id);
    if (currentIndex < lectures.length - 1) {
      handleSelectLecture(lectures[currentIndex + 1]);
    }
  };

  const goToPrevLecture = () => {
    const currentIndex = lectures.findIndex(l => l.id === currentLecture?.id);
    if (currentIndex > 0) {
      handleSelectLecture(lectures[currentIndex - 1]);
    }
  };

  const toggleSection = (sectionNum) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionNum]: !prev[sectionNum]
    }));
  };

  // Dersleri bölümlere grupla
  const groupLecturesIntoSections = () => {
    const sections = [];
    const itemsPerSection = 5;
    
    for (let i = 0; i < lectures.length; i += itemsPerSection) {
      const sectionLectures = lectures.slice(i, i + itemsPerSection);
      const sectionNum = Math.floor(i / itemsPerSection) + 1;
      const completedInSection = sectionLectures.filter(l => completedLectures.includes(l.id)).length;
      
      sections.push({
        number: sectionNum,
        title: `Bölüm ${sectionNum}`,
        lectures: sectionLectures,
        completedCount: completedInSection,
        totalCount: sectionLectures.length,
        totalDuration: sectionLectures.reduce((acc, l) => acc + (l.lectureDuration || 0), 0)
      });
    }
    
    return sections;
  };

  if (loading) {
    return (
      <div className="watch-loading">
        <div className="watch-loading-content">
          <div className="watch-loading-spinner"></div>
          <p>Kurs yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="watch-error">
        <div className="watch-error-content">
          <div className="watch-error-icon">📚</div>
          <h2>Kurs bulunamadı</h2>
          <p>Bu kurs mevcut değil veya erişim izniniz yok.</p>
          <button onClick={() => navigate('/student/courses')} className="watch-error-btn">
            Kurslarıma Dön
          </button>
        </div>
      </div>
    );
  }

  const sections = groupLecturesIntoSections();
  const currentIndex = lectures.findIndex(l => l.id === currentLecture?.id);

  return (
    <div className="watch-page">
      {/* Top Navigation Bar */}
      <header className="watch-navbar">
        <div className="watch-navbar-left">
          <button className="watch-nav-btn back-btn" onClick={() => navigate('/student/courses')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="watch-course-info">
            <span className="watch-course-label">Kurs</span>
            <h1 className="watch-course-title">{course.name}</h1>
          </div>
        </div>
        
        <div className="watch-navbar-center">
          <div className="watch-progress-info">
            <div className="watch-progress-bar-wrapper">
              <div className="watch-progress-bar">
                <div 
                  className="watch-progress-fill" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            <span className="watch-progress-text">
              %{calculateProgress()} tamamlandı • {completedLectures.length}/{lectures.length} ders
            </span>
          </div>
        </div>

        <div className="watch-navbar-right">
          <button 
            className="watch-nav-btn sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Menüyü Aç' : 'Menüyü Kapat'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="watch-main">
        {/* Video Section */}
        <div className={`watch-video-area ${sidebarCollapsed ? 'expanded' : ''}`}>
          <div 
            className="watch-video-container" 
            ref={videoContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {currentLecture?.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  className="watch-video-player"
                  src={getVideoUrl(currentLecture.videoUrl)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={handlePlayPause}
                  playsInline
                />
                
                {/* Course Completion Overlay */}
                {isCourseCompleted && (
                  <div className="watch-course-completion-overlay">
                    <div className="watch-completion-content">
                      <div className="watch-completion-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L4 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5zm-1 16l-4-4 1.41-1.41L11 15.17l6.59-6.59L19 10l-8 8z"/>
                        </svg>
                      </div>
                      <h2>Tebrikler! 🎉</h2>
                      <h3>Bu Kursu Başarıyla Tamamladınız</h3>
                      <p>
                        <strong>{course.name}</strong> kursundaki tüm videoları izleyerek bu kursu bitirdiniz.
                        Öğrenmeye devam etmek için diğer kurslarımıza göz atabilirsiniz.
                      </p>
                      <div className="watch-completion-stats">
                        <div className="watch-completion-stat">
                          <div className="stat-value">{lectures.length}</div>
                          <div className="stat-label">Video İzlendi</div>
                        </div>
                        <div className="watch-completion-stat">
                          <div className="stat-value">100%</div>
                          <div className="stat-label">Tamamlama Oranı</div>
                        </div>
                      </div>
                      <div className="watch-completion-actions">
                        <button className="watch-completion-btn primary" onClick={() => navigate('/student/courses')}>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Diğer Kurslara Göz At
                        </button>
                        <button className="watch-completion-btn secondary" onClick={() => setIsCourseCompleted(false)}>
                          Videoları İncele
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Completed Video Overlay */}
                {isLectureCompleted && !isPlaying && !isCourseCompleted && (
                  <div className="watch-video-completed-overlay">
                    <div className="watch-completed-content">
                      <div className="watch-completed-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <h3>Zaten Bu Videoyu Tamamladınız</h3>
                      <p>Bu dersi daha önce sonuna kadar izlediniz.</p>
                      <button className="watch-replay-btn" onClick={handleReplay}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                        </svg>
                        Tekrar Oynat
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Custom Video Controls */}
                <div className={`watch-video-controls ${showControls ? 'visible' : ''}`}>
                  {/* Progress Bar */}
                  <div className="watch-progress-container" onClick={handleSeek}>
                    <div className="watch-video-progress">
                      <div 
                        className="watch-video-progress-filled" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                      <div 
                        className="watch-video-progress-handle"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="watch-controls-row">
                    <div className="watch-controls-left">
                      <button className="watch-control-btn" onClick={handlePlayPause}>
                        {isPlaying ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                      
                      <button className="watch-control-btn" onClick={skipBackward} title="10 saniye geri">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.5 3c4.695 0 8.5 3.805 8.5 8.5S17.195 20 12.5 20c-3.538 0-6.564-2.166-7.84-5.25l1.758-.67C7.392 16.583 9.728 18.5 12.5 18.5c3.867 0 7-3.133 7-7s-3.133-7-7-7c-1.93 0-3.68.783-4.95 2.05L10 9H3V2l2.707 2.707C7.384 3.05 9.808 2 12.5 2v1zm-5 8.25h1.5v4h1v-4H11.5v-1h-4v1zm2.5 3h1v1h-1v-1z"/>
                        </svg>
                      </button>
                      
                      <button className="watch-control-btn" onClick={skipForward} title="10 saniye ileri">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.5 3c-4.695 0-8.5 3.805-8.5 8.5S6.805 20 11.5 20c3.538 0 6.564-2.166 7.84-5.25l-1.758-.67C16.608 16.583 14.272 18.5 11.5 18.5c-3.867 0-7-3.133-7-7s3.133-7 7-7c1.93 0 3.68.783 4.95 2.05L14 9h7V2l-2.707 2.707C16.616 3.05 14.192 2 11.5 2v1zm2.5 8.25h1.5v4h1v-4H18v-1h-4v1zm2.5 3h1v1h-1v-1z"/>
                        </svg>
                      </button>

                      <div className="watch-volume-control">
                        <button className="watch-control-btn" onClick={toggleMute}>
                          {isMuted || volume === 0 ? (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                          ) : volume < 0.5 ? (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="watch-volume-slider"
                        />
                      </div>

                      <span className="watch-time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="watch-controls-right">
                      <div className="watch-speed-control">
                        <button className="watch-control-btn watch-speed-btn">
                          {playbackSpeed}x
                        </button>
                        <div className="watch-speed-menu">
                          {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                            <button
                              key={speed}
                              className={`watch-speed-option ${playbackSpeed === speed ? 'active' : ''}`}
                              onClick={() => handleSpeedChange(speed)}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <button className="watch-control-btn" onClick={toggleFullscreen}>
                        {isFullscreen ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center Play Button Overlay */}
                {!isPlaying && (
                  <div className="watch-play-overlay" onClick={handlePlayPause}>
                    <div className="watch-play-button">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="watch-no-video">
                <div className="watch-no-video-icon">🎬</div>
                <h3>Video bulunamadı</h3>
                <p>Bu ders için video mevcut değil</p>
              </div>
            )}
          </div>

          {/* Video Info Section */}
          <div className="watch-video-info">
            <div className="watch-lecture-header">
              <div className="watch-lecture-number">
                Ders {currentIndex + 1}
              </div>
              <h2 className="watch-lecture-title">{currentLecture?.name || 'Ders'}</h2>
            </div>

            {/* Tabs */}
            <div className="watch-tabs">
              <button 
                className={`watch-tab ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                📋 İçerik
              </button>
              <button 
                className={`watch-tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                ℹ️ Hakkında
              </button>
            </div>

            <div className="watch-tab-content">
              {activeTab === 'content' && (
                <div className="watch-lecture-description">
                  {currentLecture?.videoDesc || 'Bu ders için açıklama mevcut değil.'}
                </div>
              )}
              
              {activeTab === 'about' && (
                <div className="watch-course-about">
                  <h3>Kurs Hakkında</h3>
                  <p>{course.description || 'Kurs açıklaması mevcut değil.'}</p>
                  
                  <div className="watch-course-stats">
                    <div className="watch-stat">
                      <span className="watch-stat-value">{lectures.length}</span>
                      <span className="watch-stat-label">Toplam Ders</span>
                    </div>
                    <div className="watch-stat">
                      <span className="watch-stat-value">{completedLectures.length}</span>
                      <span className="watch-stat-label">Tamamlanan</span>
                    </div>
                    <div className="watch-stat">
                      <span className="watch-stat-value">%{calculateProgress()}</span>
                      <span className="watch-stat-label">İlerleme</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="watch-lecture-nav">
              <button 
                className="watch-nav-lecture-btn prev"
                onClick={goToPrevLecture}
                disabled={currentIndex === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Önceki Ders
              </button>
              <button 
                className="watch-nav-lecture-btn next"
                onClick={goToNextLecture}
                disabled={currentIndex === lectures.length - 1}
              >
                Sonraki Ders
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`watch-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="watch-sidebar-header">
            <h3>Kurs İçeriği</h3>
            <span className="watch-sidebar-progress">
              {completedLectures.length}/{lectures.length} ders tamamlandı
            </span>
          </div>

          <div className="watch-sidebar-content">
            {sections.map((section) => (
              <div key={section.number} className="watch-section">
                <button 
                  className="watch-section-header"
                  onClick={() => toggleSection(section.number)}
                >
                  <div className="watch-section-info">
                    <span className="watch-section-title">{section.title}</span>
                    <span className="watch-section-meta">
                      {section.completedCount}/{section.totalCount} • {Math.round(section.totalDuration / 60)} dk
                    </span>
                  </div>
                  <svg 
                    className={`watch-section-arrow ${expandedSections[section.number] ? 'expanded' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {expandedSections[section.number] && (
                  <div className="watch-section-lectures">
                    {section.lectures.map((lecture, idx) => {
                      const isActive = currentLecture?.id === lecture.id;
                      const isCompleted = completedLectures.includes(lecture.id);
                      const isLocked = !lecture.isPublished;
                      const globalIndex = lectures.findIndex(l => l.id === lecture.id);

                      return (
                        <button
                          key={lecture.id}
                          className={`watch-lecture-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                          onClick={() => handleSelectLecture(lecture)}
                          disabled={isLocked}
                          title={isLocked && lecture.scheduledPublishDate 
                            ? `Bu ders ${new Date(lecture.scheduledPublishDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} tarihinde erişilebilir olacak` 
                            : ''}
                        >
                          <div className="watch-lecture-status">
                            {isLocked ? (
                              <svg className="lock-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                              </svg>
                            ) : isCompleted ? (
                              <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            ) : isActive ? (
                              <div className="watch-playing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            ) : (
                              <span className="watch-lecture-number">{globalIndex + 1}</span>
                            )}
                          </div>
                          <div className="watch-lecture-details">
                            <span className="watch-lecture-name">{lecture.name || lecture.videoName}</span>
                            {isLocked && lecture.scheduledPublishDate ? (
                              <span className="watch-lecture-locked-date">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                                </svg>
                                {new Date(lecture.scheduledPublishDate).toLocaleDateString('tr-TR', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            ) : (
                              <span className="watch-lecture-duration">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14L11 13V7h1.5v5.25l4.75 2.67-.75 1.08z"/>
                                </svg>
                                {lecture.lectureDuration ? `${Math.floor(lecture.lectureDuration / 60)} dk` : '—'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchCourse;
