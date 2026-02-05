/**
 * API Client Configuration
 *
 * This module provides a configured Axios instance for all API communication
 * with the Mibo Mental Health backend. It includes:
 * - Request interceptor to automatically add authentication tokens
 * - Response interceptor to handle errors and token refresh
 * - 30-second timeout for all requests
 * - Automatic redirect to login on 401 errors
 *
 * @module services/api
 */

import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Base URL for the API
 * Defaults to production API if not specified in environment variables
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

/**
 * Configured Axios instance for API calls
 *
 * Features:
 * - Base URL from environment variables
 * - 30-second timeout
 * - JSON content type by default
 * - Request/response interceptors for auth and error handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 *
 * Automatically adds the JWT authentication token to all requests
 * if the user is authenticated. The token is retrieved from localStorage.
 *
 * @param config - Axios request configuration
 * @returns Modified request configuration with auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get authentication token from localStorage
    const token = localStorage.getItem("mibo_access_token");

    // Add token to Authorization header if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 *
 * Handles API response errors and implements automatic error handling:
 * - 401 Unauthorized: Clear tokens and redirect to login
 * - Network errors: Return user-friendly error message
 * - Other errors: Pass through for component-level handling
 *
 * @param response - Successful API response
 * @param error - API error response
 * @returns Response data or rejected promise with error
 */
apiClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn(
        "Authentication failed - clearing tokens and redirecting to login",
      );

      // Clear all authentication data
      localStorage.removeItem("mibo_access_token");
      localStorage.removeItem("mibo_refresh_token");
      localStorage.removeItem("mibo_user");

      // Redirect to authentication page
      // Only redirect if not already on auth page to prevent loops
      if (!window.location.pathname.includes("/patientAuth")) {
        window.location.href = "/patientAuth";
      }

      return Promise.reject(error);
    }

    // Handle network errors (no response from server)
    if (!error.response) {
      console.error("Network error - server unreachable");
      return Promise.reject({
        message:
          "Network error. Please check your internet connection and try again.",
        type: "network_error",
        retryable: true,
        originalError: error,
      });
    }

    // Handle other errors (400, 500, etc.)
    // These will be handled by individual service methods
    return Promise.reject(error);
  },
);

/**
 * Export the configured API client
 *
 * Usage:
 * ```typescript
 * import apiClient from './services/api';
 *
 * // GET request
 * const response = await apiClient.get('/patients');
 *
 * // POST request
 * const response = await apiClient.post('/appointments', data);
 * ```
 */
export default apiClient;

/**
 * Export API base URL for use in other modules if needed
 */
export { API_BASE_URL };
