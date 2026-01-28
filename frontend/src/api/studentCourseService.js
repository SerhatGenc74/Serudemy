import axiosClient from './axiosClient';

const studentCourseService = {
  // Tüm öğrenci-kurs kayıtlarını getir
  getAllStudentCourses: async () => {
    const response = await axiosClient.get('/StudentCourse');
    return response.data;
  },

  // ID'ye göre öğrenci-kurs kaydı getir
  getStudentCourseById: async (id) => {
    const response = await axiosClient.get(`/StudentCourse/${id}`);
    return response.data;
  },

  // Öğrencinin kayıtlı olduğu kursları getir
  getCoursesByStudent: async (studentId) => {
    const response = await axiosClient.get(`/StudentCourse/courses/student/${studentId}`);
    return response.data;
  },

  // Kursa kayıtlı öğrencileri getir
  getStudentsByCourse: async (courseId) => {
    const response = await axiosClient.get(`/StudentCourse/course/${courseId}/students`);
    return response.data;
  },

  // Kurs için uygun öğrencileri getir (kayıtlı olmayanlar)
  getEligibleStudentsForCourse: async (courseId) => {
    const response = await axiosClient.get(`/StudentCourse/eligible-students?courseId=${courseId}`);
    return response.data;
  },

  // Öğrencinin kursa kayıtlı olup olmadığını kontrol et
  isStudentEnrolled: async (studentId, courseId) => {
    const response = await axiosClient.get(`/StudentCourse/is-enrolled/${studentId}/${courseId}`);
    return response.data;
  },

  // Öğrenciyi kursa kaydet
  enrollStudent: async (courseId, studentId, dto = {}) => {
    const response = await axiosClient.post(`/StudentCourse/enroll/${courseId}/${studentId}`, dto);
    return response.data;
  },

  // Yeni öğrenci-kurs kaydı oluştur
  createStudentCourse: async (dto) => {
    const response = await axiosClient.post('/StudentCourse', dto);
    return response.data;
  },

  // Öğrenci-kurs kaydını güncelle
  updateStudentCourse: async (id, dto) => {
    const response = await axiosClient.put(`/StudentCourse/${id}`, dto);
    return response.data;
  },

  // Öğrenci-kurs kaydını sil
  deleteStudentCourse: async (id) => {
    const response = await axiosClient.delete(`/StudentCourse/${id}`);
    return response.data;
  },

  // Öğrenciyi kurstan çıkar
  unenrollStudent: async (courseId, studentId) => {
    const response = await axiosClient.delete(`/StudentCourse/unenroll/${courseId}/${studentId}`);
    return response.data;
  },
};

export default studentCourseService;
