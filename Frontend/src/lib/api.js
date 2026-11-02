import axios from "axios";

const baseURL = (
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

console.log("[API] Base URL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("learnhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.message ||
    fallback
  );
}

export default api;