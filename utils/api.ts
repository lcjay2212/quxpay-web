import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import storage from 'constants/storage';
import { clearStorage } from './clearStorage';
import { notify } from './notify';
import { queryClient } from './queryClient';

const isBrowser = typeof window !== 'undefined';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Version: 2,
  },
});

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Function to handle logout when token is expired
const handleLogout = async (message = 'Session expired. Please login again.'): Promise<void> => {
  if (isBrowser) {
    clearStorage(); // Clear storage

    // Show notification
    notify(message, { status: 'error' });

    // Clear all queries from react-query
    queryClient.clear();

    // If we're not already on the login page, redirect to shop
    if (window.location.pathname !== '/auth/signin') {
      window.location.href = '/auth/signin';
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(storage.QUX_PAY_USER_TOKEN);

      // If no refresh token exists, logout immediately
      if (!refreshToken) {
        isRefreshing = false;
        // await handleLogout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/refresh`, {
          refreshToken,
        });

        // Update both cookie and localStorage
        if (isBrowser) {
          localStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.accessToken);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Handle logout on refresh token failure
        await handleLogout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = isBrowser ? localStorage.getItem(storage.QUX_PAY_USER_TOKEN) : null;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;
