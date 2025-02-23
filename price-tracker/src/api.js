// src/api.js
import axios from "axios";

// Axios instance oluşturma ve global yapılandırma
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Backend API URL'niz
});

// Token'ı header'da göndermek için request interceptor ekleyelim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // Token'ı localStorage'dan al
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Authorization header ekle
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);  // Hata durumunda reddet
  }
);

export default api;