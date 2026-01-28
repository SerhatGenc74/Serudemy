import axiosClient from './axiosClient';

const categoryService = {
  // Tüm kategorileri getir
  getAllCategories: async () => {
    const response = await axiosClient.get('/Category');
    return response.data;
  },

  // ID'ye göre kategori getir
  getCategoryById: async (id) => {
    const response = await axiosClient.get(`/Category/${id}`);
    return response.data;
  },

  // Yeni kategori oluştur
  createCategory: async (categoryData) => {
    const response = await axiosClient.post('/Category', categoryData);
    return response.data;
  },

  // Kategori güncelle
  updateCategory: async (id, categoryData) => {
    const response = await axiosClient.put(`/Category/${id}`, categoryData);
    return response.data;
  },

  // Kategori sil
  deleteCategory: async (id) => {
    const response = await axiosClient.delete(`/Category/${id}`);
    return response.data;
  },
};

export default categoryService;
