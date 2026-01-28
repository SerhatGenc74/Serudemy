import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, lectureService } from '../../../api';
import './LectureScheduleCalendar.css';

const LectureScheduleCalendar = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [saving, setSaving] = useState(false);
  const [draggedLecture, setDraggedLecture] = useState(null);

  // Ay ve yıl için Türkçe isimler
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Kurs ve ders verilerini yükle
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      if (courseData?.courseId) {
        const lecturesData = await lectureService.getLecturesForInstructor(courseData.courseId);
        const sortedLectures = (lecturesData || []).sort((a, b) => (a.lectureOrder || 0) - (b.lectureOrder || 0));
        setLectures(sortedLectures);
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ayın günlerini hesapla
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Pazartesi = 0 olacak şekilde ayarla
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];
    
    // Önceki ayın günleri
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Mevcut ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Sonraki ayın günleri (6 satır tamamlamak için)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  // Belirli bir günde olan dersleri bul
  const getLecturesForDay = (date) => {
    return lectures.filter(lecture => {
      if (!lecture.scheduledPublishDate) return false;
      const lectureDate = new Date(lecture.scheduledPublishDate);
      return (
        lectureDate.getDate() === date.getDate() &&
        lectureDate.getMonth() === date.getMonth() &&
        lectureDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Önceki aya git
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Sonraki aya git
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Bugüne git
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Ders üzerine tıklandığında modal aç
  const handleLectureClick = (lecture, e) => {
    e.stopPropagation();
    setSelectedLecture(lecture);
    
    if (lecture.scheduledPublishDate) {
      const date = new Date(lecture.scheduledPublishDate);
      setScheduleDate(date.toISOString().split('T')[0]);
      setScheduleTime(date.toTimeString().slice(0, 5));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
      setScheduleTime('09:00');
    }
    
    setShowScheduleModal(true);
  };

  // Takvim gününe tıklandığında (zamanlanmamış ders varsa)
  const handleDayClick = (dayData) => {
    const unscheduledLectures = lectures.filter(l => !l.scheduledPublishDate && !l.isPublished);
    if (unscheduledLectures.length > 0) {
      setSelectedLecture(unscheduledLectures[0]);
      setScheduleDate(dayData.date.toISOString().split('T')[0]);
      setScheduleTime('09:00');
      setShowScheduleModal(true);
    }
  };

  // Drag & Drop
  const handleDragStart = (lecture, e) => {
    setDraggedLecture(lecture);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (dayData, e) => {
    e.preventDefault();
    if (!draggedLecture) return;

    const newDate = new Date(dayData.date);
    // Mevcut saati koru veya varsayılan saat ata
    if (draggedLecture.scheduledPublishDate) {
      const oldDate = new Date(draggedLecture.scheduledPublishDate);
      newDate.setHours(oldDate.getHours(), oldDate.getMinutes());
    } else {
      newDate.setHours(9, 0);
    }

    await updateLectureSchedule(draggedLecture.id, newDate, false);
    setDraggedLecture(null);
  };

  // Zamanlama güncelle
  const updateLectureSchedule = async (lectureId, dateTime, isPublished) => {
    try {
      setSaving(true);
      
      const lecture = lectures.find(l => l.id === lectureId);
      if (!lecture) return;

      await lectureService.updateLecture(lectureId, {
        name: lecture.name,
        videoName: lecture.videoName,
        videoDesc: lecture.videoDesc,
        videoUrl: lecture.videoUrl,
        lectureOrder: lecture.lectureOrder,
        lectureDuration: lecture.lectureDuration,
        coursesId: lecture.coursesId,
        scheduledPublishDate: dateTime ? dateTime.toISOString() : null,
        isPublished: isPublished
      });

      await fetchData();
    } catch (error) {
      console.error('Zamanlama güncellenirken hata:', error);
      alert('Zamanlama güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Modal'dan kaydet
  const handleSaveSchedule = async () => {
    if (!selectedLecture || !scheduleDate) return;

    const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    await updateLectureSchedule(selectedLecture.id, dateTime, false);
    setShowScheduleModal(false);
    setSelectedLecture(null);
  };

  // Zamanlamayı kaldır (hemen yayınla)
  const handlePublishNow = async () => {
    if (!selectedLecture) return;
    await updateLectureSchedule(selectedLecture.id, null, true);
    setShowScheduleModal(false);
    setSelectedLecture(null);
  };

  // Zamanlamayı iptal et
  const handleRemoveSchedule = async () => {
    if (!selectedLecture) return;
    await updateLectureSchedule(selectedLecture.id, null, false);
    setShowScheduleModal(false);
    setSelectedLecture(null);
  };

  // Bugün mü kontrolü
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Zamanlanmamış ve yayınlanmamış dersler
  const unscheduledLectures = lectures.filter(l => !l.scheduledPublishDate && !l.isPublished);
  const publishedLectures = lectures.filter(l => l.isPublished);
  const scheduledLectures = lectures.filter(l => !l.isPublished && l.scheduledPublishDate);

  if (loading) {
    return (
      <div className="schedule-calendar-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <div className="schedule-calendar-page">
      {/* Header */}
      <div className="schedule-calendar-header">
        <div className="schedule-header-left">
          <button className="back-button" onClick={() => navigate(`/instructor/course/${courseId}`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kursa Dön
          </button>
          <div className="schedule-header-info">
            <h1>📅 Ders Yayın Takvimi</h1>
            <p>{course?.name}</p>
          </div>
        </div>
        <div className="schedule-stats">
          <div className="stat-item published">
            <span className="stat-count">{publishedLectures.length}</span>
            <span className="stat-label">Yayında</span>
          </div>
          <div className="stat-item scheduled">
            <span className="stat-count">{scheduledLectures.length}</span>
            <span className="stat-label">Zamanlandı</span>
          </div>
          <div className="stat-item draft">
            <span className="stat-count">{unscheduledLectures.length}</span>
            <span className="stat-label">Taslak</span>
          </div>
        </div>
      </div>

      <div className="schedule-calendar-content">
        {/* Sol Panel - Zamanlanmamış Dersler */}
        <div className="schedule-sidebar">
          <h3>📝 Zamanlanmamış Dersler</h3>
          <p className="sidebar-hint">Dersleri takvime sürükleyin veya tıklayın</p>
          
          {unscheduledLectures.length === 0 ? (
            <div className="no-unscheduled">
              <span>✅</span>
              <p>Tüm dersler zamanlandı!</p>
            </div>
          ) : (
            <div className="unscheduled-lectures">
              {unscheduledLectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className="unscheduled-lecture-item"
                  draggable
                  onDragStart={(e) => handleDragStart(lecture, e)}
                  onClick={(e) => handleLectureClick(lecture, e)}
                >
                  <span className="lecture-order">{lecture.lectureOrder || index + 1}</span>
                  <div className="lecture-info">
                    <span className="lecture-name">{lecture.name || lecture.videoName}</span>
                    {lecture.lectureDuration && (
                      <span className="lecture-duration">
                        {Math.floor(lecture.lectureDuration / 60)} dk
                      </span>
                    )}
                  </div>
                  <span className="drag-handle">⋮⋮</span>
                </div>
              ))}
            </div>
          )}

          {/* Yayınlanmış Dersler */}
          {publishedLectures.length > 0 && (
            <>
              <h3 className="published-section-title">✅ Yayınlanmış Dersler</h3>
              <div className="published-lectures">
                {publishedLectures.map((lecture, index) => (
                  <div
                    key={lecture.id}
                    className="published-lecture-item"
                    onClick={(e) => handleLectureClick(lecture, e)}
                  >
                    <span className="lecture-order">{lecture.lectureOrder || index + 1}</span>
                    <div className="lecture-info">
                      <span className="lecture-name">{lecture.name || lecture.videoName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sağ Panel - Takvim */}
        <div className="schedule-calendar-main">
          {/* Takvim Navigasyonu */}
          <div className="calendar-nav">
            <button className="nav-btn" onClick={goToPrevMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button className="nav-btn" onClick={goToNextMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <button className="today-btn" onClick={goToToday}>Bugün</button>
          </div>

          {/* Takvim Grid */}
          <div className="calendar-grid">
            {/* Gün başlıkları */}
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}

            {/* Günler */}
            {days.map((dayData, index) => {
              const dayLectures = getLecturesForDay(dayData.date);
              const isPast = dayData.date < new Date().setHours(0, 0, 0, 0);
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${isToday(dayData.date) ? 'today' : ''} ${isPast ? 'past' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(dayData, e)}
                  onClick={() => handleDayClick(dayData)}
                >
                  <span className="day-number">{dayData.day}</span>
                  <div className="day-lectures">
                    {dayLectures.map(lecture => (
                      <div
                        key={lecture.id}
                        className={`calendar-lecture ${lecture.isPublished ? 'published' : 'scheduled'}`}
                        draggable
                        onDragStart={(e) => handleDragStart(lecture, e)}
                        onClick={(e) => handleLectureClick(lecture, e)}
                        title={`${lecture.name || lecture.videoName} - ${new Date(lecture.scheduledPublishDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
                      >
                        <span className="lecture-time">
                          {new Date(lecture.scheduledPublishDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="lecture-title">{lecture.name || lecture.videoName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zamanlama Modal */}
      {showScheduleModal && selectedLecture && (
        <div className="schedule-modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="schedule-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗓️ Ders Zamanla</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="lecture-preview">
                <span className="preview-order">{selectedLecture.lectureOrder}</span>
                <div>
                  <h4>{selectedLecture.name || selectedLecture.videoName}</h4>
                  {selectedLecture.lectureDuration && (
                    <span className="preview-duration">
                      ⏱️ {Math.floor(selectedLecture.lectureDuration / 60)} dakika
                    </span>
                  )}
                </div>
              </div>

              <div className="schedule-form">
                <div className="form-group">
                  <label>📅 Yayın Tarihi</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>⏰ Yayın Saati</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              {selectedLecture.scheduledPublishDate && (
                <div className="current-schedule-info">
                  <p>
                    Mevcut zamanlama: {' '}
                    <strong>
                      {new Date(selectedLecture.scheduledPublishDate).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </strong>
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowScheduleModal(false)}
                disabled={saving}
              >
                İptal
              </button>
              
              {selectedLecture.scheduledPublishDate && (
                <button 
                  className="btn btn-danger" 
                  onClick={handleRemoveSchedule}
                  disabled={saving}
                >
                  {saving ? 'İşleniyor...' : 'Zamanlamayı Kaldır'}
                </button>
              )}
              
              <button 
                className="btn btn-success" 
                onClick={handlePublishNow}
                disabled={saving}
              >
                {saving ? 'İşleniyor...' : 'Hemen Yayınla'}
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={handleSaveSchedule}
                disabled={saving || !scheduleDate}
              >
                {saving ? 'Kaydediliyor...' : 'Zamanla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureScheduleCalendar;
