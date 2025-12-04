import axios from "axios";

// Detect environment
const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://lms-drf-posgresql-react.onrender.com");

console.log("🔥 API Base URL:", BASE);

// Always ensure /api/ prefix
const api = axios.create({
  baseURL: `${BASE}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize endpoints
export const CourseAPI = {
  list: () => api.get("courses/"),
  retrieve: (id) => api.get(`courses/${id}/`),
  create: (data) => api.post("courses/", data),
};

export const SectionAPI = {
  create: (data) => api.post("sections/", data),
  update: (id, data) => api.patch(`sections/${id}/`, data),
  delete: (id) => api.delete(`sections/${id}/`),
};

export const TopicAPI = {
  create: (data) => api.post("topics/", data),
  update: (id, data) => api.patch(`topics/${id}/`, data),
  delete: (id) => api.delete(`topics/${id}/`),
};

export default api;
