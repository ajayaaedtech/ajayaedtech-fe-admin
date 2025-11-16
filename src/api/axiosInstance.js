import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001",
});

// Automatically attach Bearer Token from Cookie
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");   // ← ONLY COOKIE

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handler (Toast)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || "API Error occurred";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosInstance;
