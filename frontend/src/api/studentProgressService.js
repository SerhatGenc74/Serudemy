import axiosClient from './axiosClient';

const studentProgressService = {
  // Tüm ilerleme kayıtlarını getir
  getAllProgress: async () => {
    const response = await axiosClient.get('/StudentProgress');
    return response.data;
  },

  // ID'ye göre ilerleme kaydı getir
  getProgressById: async (id) => {
    const response = await axiosClient.get(`/StudentProgress/${id}`);
    return response.data;
  },

  // Ders bilgisiyle ilerleme kayıtlarını getir
  getAllProgressWithLecture: async () => {
    const response = await axiosClient.get('/StudentProgress/with-lecture');
    return response.data;
  },

  // Öğrencinin tamamladığı dersleri getir
  getCompletedLessons: async (studentId, courseId) => {
    const response = await axiosClient.get(`/StudentProgress/student/${studentId}/course/${courseId}/completed`);
    return response.data;
  },

  // Öğrencinin kurstaki ilerlemesini getir
  getStudentProgressInCourse: async (studentId, courseId) => {
    const response = await axiosClient.get(`/StudentProgress/course/${courseId}/student/${studentId}/progress`);
    return response.data;
  },

  // Tamamlanan ders sayısını getir
  getCompletedLessonCount: async (studentId, courseId) => {
    const response = await axiosClient.get(`/StudentProgress/student/${studentId}/course/${courseId}/completed/count`);
    return response.data;
  },

  // Son izleme ilerlemesini getir
  getLastProgress: async (accountId, courseId) => {
    const response = await axiosClient.get(`/StudentProgress/student/${accountId}/course/${courseId}/last`);
    return response.data;
  },

  // Öğrenciye göre ilerleme kayıtları
  getProgressByStudent: async (studentId) => {
    const response = await axiosClient.get(`/StudentProgress/student/${studentId}`);
    return response.data;
  },

  // Derse göre ilerleme kayıtları
  getProgressByLecture: async (lectureId) => {
    const response = await axiosClient.get(`/StudentProgress/lecture/${lectureId}`);
    return response.data;
  },

  // Zaten ilerleme kaydı var mı kontrol et
  hasProgress: async (studentId, lectureId) => {
    const response = await axiosClient.get(`/StudentProgress/progress/${studentId}/${lectureId}`);
    return response.data;
  },

  // Kurs ilerleme özeti (öğretmenler için)
  getCourseProgressOverview: async (courseId) => {
    const response = await axiosClient.get(`/StudentProgress/course/${courseId}/overview`);
    return response.data;
  },

  // Yeni ilerleme kaydı oluştur
  createProgress: async (dto) => {
    const response = await axiosClient.post('/StudentProgress', dto);
    return response.data;
  },

  // İlerleme kaydını güncelle
  updateProgress: async (id, dto) => {
    const response = await axiosClient.put(`/StudentProgress/${id}`, dto);
    return response.data;
  },
};

export default studentProgressService;
