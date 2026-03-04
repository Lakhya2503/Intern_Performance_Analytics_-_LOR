// ===========================================
// apiClient.js
// ===========================================

import axios from "axios";
import toast from "react-hot-toast";

// =======================
// LocalStorage Utility
// =======================
export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  static get(key) {
    if (!isBrowser) return null;
    try {
      const value = localStorage.getItem(key);
      if (!value || value === "undefined" || value === "null") return null;
      return JSON.parse(value);
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  }

  static set(key, value) {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set "${key}" in localStorage:`, error);
    }
  }

  static remove(key) {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove "${key}" in localStorage:`, error);
    }
  }

  static clear() {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("localStorage.clear() failed:", error);
    }
  }
}

// =======================
// Axios Instance
// =======================
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:5002/api/lor/v1",
  withCredentials: true, // send httpOnly cookies
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// Request Interceptor
// =======================
apiClient.interceptors.request.use((config) => {
  const token = LocalStorage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let browser handle FormData content-type automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// =======================
// Response Interceptor
// =======================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and request not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint (httpOnly cookie sent automatically)
        const refreshRes = await apiClient.post("/refresh-token");
        const newAccessToken = refreshRes.data.accessToken;

        if (!newAccessToken) throw new Error("Refresh token failed");

        // Save new accessToken
        LocalStorage.set("accessToken", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed → clear storage + redirect to login
        LocalStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// Request Handler Utility
// =======================
export const requestHandler = async (api, setLoading, onSuccess, onError) => {
  let isMounted = true;

  try {
    setLoading?.(true);

    const response = await api();
    const data = response?.data ?? response ?? null;

    if (!data) throw new Error("No data received from API");

    onSuccess?.(data);

    if (data.message) toast.success(data.message);
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
    onError?.(error?.response?.data || { message: errorMessage });
    console.error("API error:", errorMessage);

    if ([400, 401, 403].includes(error?.response?.status)) {
      // Optional: handle forced logout
      // LocalStorage.clear();
      // window.location.href = "/login";
    }

    toast.error(errorMessage);
  } finally {
    if (isMounted) setLoading?.(false);
  }
};

export default apiClient;
