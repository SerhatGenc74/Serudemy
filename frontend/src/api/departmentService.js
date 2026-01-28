import axiosClient from './axiosClient';

const departmentService = {
  // Tüm bölümleri getir
  getAllDepartments: async () => {
    const response = await axiosClient.get('/Department');
    return response.data;
  },

  // ID'ye göre bölüm getir
  getDepartmentById: async (id) => {
    const response = await axiosClient.get(`/Department/${id}`);
    return response.data;
  },

  // Fakülteye göre bölümleri getir
  getDepartmentsByFaculty: async (facultyId) => {
    const response = await axiosClient.get(`/Department/faculty/${facultyId}`);
    return response.data;
  },

  // Yeni bölüm oluştur
  createDepartment: async (departmentData) => {
    const response = await axiosClient.post('/Department', departmentData);
    return response.data;
  },

  // Bölüm güncelle
  updateDepartment: async (id, departmentData) => {
    const response = await axiosClient.put(`/Department/${id}`, departmentData);
    return response.data;
  },

  // Bölüm sil
  deleteDepartment: async (id) => {
    const response = await axiosClient.delete(`/Department/${id}`);
    return response.data;
  },
};

export default departmentService;
