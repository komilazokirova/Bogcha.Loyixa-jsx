import axios from "axios";
import useAuthStore from "@/store/authStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// MUHIM TUZATISH: token localStorage'da to'g'ridan-to'g'ri "token" kaliti bilan
// saqlanmaydi — u zustand "persist" orqali authStore ichida ("auth-storage"
// kaliti ostida, JSON obyekt sifatida) saqlanadi. Shuning uchun tokenni
// to'g'ridan-to'g'ri store'dan olamiz.
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;