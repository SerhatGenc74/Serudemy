import axiosClient from './axiosClient';

const accountService = {
  // Tüm hesapları getir
  getAllAccounts: async () => {
    const response = await axiosClient.get('/Account');
    return response.data;
  },

  // ID'ye göre hesap getir
  getAccountById: async (id) => {
    const response = await axiosClient.get(`/Account/${id}`);
    return response.data;
  },

  // Numara'ya göre hesap getir
  getAccountByNumber: async (number) => {
    const response = await axiosClient.get(`/Account/number/${number}`);
    return response.data;
  },

  // Yeni hesap oluştur
  createAccount: async (accountData) => {
    const response = await axiosClient.post('/Account', accountData);
    return response.data;
  },

  // Hesap güncelle
  updateAccount: async (id, accountData) => {
    const response = await axiosClient.put(`/Account/${id}`, accountData);
    return response.data;
  },

  // Hesap sil
  deleteAccount: async (id) => {
    const response = await axiosClient.delete(`/Account/${id}`);
    return response.data;
  },
};

export default accountService;
