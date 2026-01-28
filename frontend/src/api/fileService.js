import axiosClient from './axiosClient';

const fileService = {
  // Dosya yükle (video/resim)
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/File/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 1800000, // 30 dakika (çok büyük videolar için)
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Resim mi kontrol et
  validateImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/File/validate/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Video mu kontrol et
  validateVideo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/File/validate/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Dosya güncelle
  updateFile: async (file, existingFilePath, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.put(`/File/update?existingFilePath=${encodeURIComponent(existingFilePath)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Dosya sil
  deleteFile: async (filePath) => {
    const response = await axiosClient.delete(`/File?filePath=${encodeURIComponent(filePath)}`);
    return response.data;
  },
};

export default fileService;
