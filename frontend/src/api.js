import axios from "axios";

export const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_BASE_URL = isLocal ? "http://127.0.0.1:8000" : import.meta.env.VITE_API_URL;
export const GOOGLE_REDIRECT_URI = isLocal ? "http://127.0.0.1:5174/login/callback" : "https://mystudyplan25.netlify.app/login/callback";

console.log("🔥 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api/`,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        // No refresh token -> force logout
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Call your refresh token endpoint
        const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access", newAccessToken);

        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed -> logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const CourseAPI = {
  list: () => api.get("courses/"),
  retrieve: (id) => api.get(`courses/${id}/`),
  create: (data) => api.post("courses/", data),
  update: (id, data) => api.patch(`courses/${id}/`, data),
  delete: (id) => api.delete(`courses/${id}/`),
};

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
