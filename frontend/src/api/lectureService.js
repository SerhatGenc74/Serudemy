import axiosClient from './axiosClient';

const lectureService = {
  // Tüm dersleri getir
  getAllLectures: async () => {
    const response = await axiosClient.get('/Lecture');
    return response.data;
  },

  // Tek bir ders getir
  getLectureById: async (lectureId) => {
    const response = await axiosClient.get(`/Lecture/${lectureId}`);
    return response.data;
  },

  // Kursa göre dersleri getir
  getLecturesByCourse: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}`);
    return response.data;
  },

  // Kursa göre dersleri kurs bilgisiyle getir
  getLecturesWithCourse: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/with-course`);
    return response.data;
  },

  // Kursun ilk dersini getir
  getFirstLecture: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/first`);
    return response.data;
  },

  // Toplam ders sayısını getir
  getTotalLessonCount: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/count`);
    return response.data;
  },

  // Yeni ders oluştur
  createLecture: async (lectureData) => {
    const response = await axiosClient.post('/Lecture', lectureData);
    return response.data;
  },

  // Ders güncelle
  updateLecture: async (lectureId, lectureData) => {
    const response = await axiosClient.put(`/Lecture/${lectureId}`, lectureData);
    return response.data;
  },

  // Ders sil
  deleteLecture: async (lectureId) => {
    const response = await axiosClient.delete(`/Lecture/${lectureId}`);
    return response.data;
  },

  // Ders sırasını değiştir
  reorderLecture: async (lectureId, newOrder) => {
    const response = await axiosClient.put(`/Lecture/${lectureId}/reorder`, newOrder);
    return response.data;
  },

  // Schedule (Zamanlama) Metodları

  // Zamanlanmış dersleri yayınla
  publishScheduledLectures: async () => {
    const response = await axiosClient.post('/Lecture/publish-scheduled');
    return response.data;
  },

  // Yayınlanmış dersleri getir (öğrenciler için)
  getPublishedLectures: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/published`);
    return response.data;
  },

  // Tüm dersleri getir (öğretmenler için - zamanlanmış dahil)
  getLecturesForInstructor: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/instructor`);
    return response.data;
  },

  // Zamanlanmış dersleri getir
  getScheduledLectures: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/scheduled`);
    return response.data;
  },

  // Öğrenciler için dersleri getir (yayınlanmış + zamanlanmış kilitli olarak)
  getLecturesForStudent: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/student`);
    return response.data;
  },

  // Lecture status management (Taslak/Yayınlanma/Arşiv)

  // Dersi yayınla
  publishLecture: async (lectureId) => {
    const response = await axiosClient.post(`/Lecture/${lectureId}/publish`);
    return response.data;
  },

  // Dersi taslağa al
  unpublishLecture: async (lectureId) => {
    const response = await axiosClient.post(`/Lecture/${lectureId}/unpublish`);
    return response.data;
  },

  // Dersi arşivle
  archiveLecture: async (lectureId) => {
    const response = await axiosClient.post(`/Lecture/${lectureId}/archive`);
    return response.data;
  },

  // Ders erişilebilirliğini ayarla
  setLectureAccessibility: async (lectureId, isAccessible) => {
    const response = await axiosClient.post(`/Lecture/${lectureId}/accessibility`, isAccessible, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Yayınlanmış dersleri duruma göre getir
  getPublishedLecturesByStatus: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/published-by-status`);
    return response.data;
  },

  // Erişilebilir dersleri getir
  getAccessibleLectures: async (courseId) => {
    const response = await axiosClient.get(`/Lecture/course/${courseId}/accessible`);
    return response.data;
  },

  // Dersin erişilebilirlik durumunu kontrol et
  isLectureAccessible: async (lectureId) => {
    const response = await axiosClient.get(`/Lecture/${lectureId}/is-accessible`);
    return response.data;
  },
};

export default lectureService;
