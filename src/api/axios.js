import axios from "axios";

const instance = axios.create({
  baseURL: "https://mindful-ai-backend-1.onrender.com",
});

// Attach token for protected requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
