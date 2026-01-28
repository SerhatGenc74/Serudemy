import axiosClient from './axiosClient';

const courseService = {
  // Tüm kursları getir
  getAllCourses: async () => {
    const response = await axiosClient.get('/Course');
    return response.data;
  },

  // Admin için tüm kurslar
  getAllCoursesForAdmin: async () => {
    const response = await axiosClient.get('/Course/admin');
    return response.data;
  },

  // Tek bir kurs getir
  getCourseById: async (courseId) => {
    const response = await axiosClient.get(`/Course/${courseId}`);
    return response.data;
  },

  // Eğitmene göre kursları getir
  getCoursesByInstructor: async (instructorId) => {
    const response = await axiosClient.get(`/Course/by-instructor/${instructorId}`);
    return response.data;
  },

  // Benzersiz kurs ID'si oluştur
  generateUniqueCourseId: async () => {
    const response = await axiosClient.get('/Course/random');
    return response.data;
  },

  // Yeni kurs oluştur
  createCourse: async (courseData) => {
    const response = await axiosClient.post('/Course/create', courseData);
    return response.data;
  },

  // Kurs güncelle
  updateCourse: async (courseId, courseData) => {
    const response = await axiosClient.put(`/Course/${courseId}`, courseData);
    return response.data;
  },

  // Kurs sil
  deleteCourse: async (courseId) => {
    const response = await axiosClient.delete(`/Course/${courseId}`);
    return response.data;
  },
};

export default courseService;
