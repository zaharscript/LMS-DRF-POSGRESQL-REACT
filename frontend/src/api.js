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

export default api;
