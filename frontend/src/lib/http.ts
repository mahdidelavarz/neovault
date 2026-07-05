import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ─── Refresh state (prevent concurrent refresh races) ─────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function drainQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

function rejectQueue() {
  refreshQueue.forEach((resolve) => resolve(""));
  refreshQueue = [];
}

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      // No HTTP response can mean several things — only call it "offline" when the
      // browser actually reports no connectivity. isOfflineError() (lib/offlineApi.ts)
      // relies on this exact string to decide whether to queue a mutation, so we must
      // not use it for timeouts / unreachable-server / CORS failures.
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        error.message = "You are offline";
      } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        error.message = "Request timed out";
      } else {
        error.message = "Network error — could not reach the server";
      }
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Attempt token refresh on 401, but not for the refresh endpoint itself
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined" &&
      navigator.onLine &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        return doLogout(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Update store + localStorage
        const { useAuthStore } = await import("@/features/auth/store/authStore");
        useAuthStore.getState().setAccessToken(accessToken, newRefreshToken);

        isRefreshing = false;
        drainQueue(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        isRefreshing = false;
        rejectQueue();
        return doLogout(error);
      }
    }

    // Normalise backend error message
    const serverMessage = error.response.data?.message;
    if (serverMessage && error.message !== serverMessage) {
      error.message = serverMessage;
    }

    return Promise.reject(error);
  },
);

async function doLogout(error: AxiosError) {
  if (typeof window !== "undefined") {
    const { useAuthStore } = await import("@/features/auth/store/authStore");
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }
  return Promise.reject(error);
}

export default api;

// ─── Typed helper wrappers ────────────────────────────────────────────────────

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data;
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post<T>(url, body);
  return res.data;
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put<T>(url, body);
  return res.data;
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch<T>(url, body);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<T>(url);
  return res.data;
}
