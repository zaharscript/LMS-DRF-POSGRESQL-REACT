// src/api.js
import axios from "axios";

const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://lms-drf-posgresql-react.onrender.com");

console.log("🔥 API Base URL:", BASE);

const api = axios.create({
  baseURL: `${BASE.replace(/\/$/, "")}/api/`,
  headers: { "Content-Type": "application/json" },
});

// Named API helpers
export const CourseAPI = {
  list: () => api.get("courses/"),
  retrieve: (id) => api.get(`courses/${id}/`),
  create: (data) => api.post("courses/", data),
  update: (id, data) => api.patch(`courses/${id}/`, data),
  delete: (id) => api.delete(`courses/${id}/`),
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const SectionAPI = {
  list: () => api.get("sections/"),
  create: (data) => api.post("sections/", data),
  update: (id, data) => api.patch(`sections/${id}/`, data),
  delete: (id) => api.delete(`sections/${id}/`),
};

export const TopicAPI = {
  list: () => api.get("topics/"),
  create: (data) => api.post("topics/", data),
  update: (id, data) => api.patch(`topics/${id}/`, data),
  delete: (id) => api.delete(`topics/${id}/`),
};

export default api;
