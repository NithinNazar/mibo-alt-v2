/**
 * Authentication Service
 *
 * This service handles patient authentication via phone OTP (One-Time Password).
 * It manages the complete authentication flow:
 * 1. Send OTP to patient's phone number
 * 2. Verify OTP and receive authentication tokens
 * 3. Store tokens and user data in localStorage
 * 4. Provide authentication state helpers
 *
 * Authentication tokens are stored in localStorage with keys:
 * - mibo_access_token: JWT token for API authentication
 * - mibo_refresh_token: Token for refreshing expired access tokens
 * - mibo_user: Serialized user object with patient details
 *
 * @module services/authService
 */

import apiClient from "./api";

/**
 * Response structure for OTP send request
 */
interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    phone: string;
    expiresIn: number; // OTP expiry time in seconds
  };
}

/**
 * Response structure for OTP verification/login
 */
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      phone: string;
      email: string | null;
      user_type: "PATIENT";
    };
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * User object structure stored in localStorage
 */
export interface AuthUser {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  user_type: "PATIENT";
}

/**
 * Authentication Service Class
 *
 * Provides methods for patient authentication and session management.
 * Implements singleton pattern - use the exported instance.
 */
class AuthService {
  /**
   * Send OTP to patient's phone number
   *
   * This initiates the authentication flow by sending a 6-digit OTP
   * to the provided phone number via SMS. The OTP is valid for a limited
   * time (typically 5-10 minutes).
   *
   * @param phone - 10-digit Indian mobile number (e.g., "9876543210")
   * @returns Promise with OTP send confirmation including expiry time
   * @throws {AxiosError} If phone number is invalid or SMS service fails
   *
   * @example
   * ```typescript
   * try {
   *   const response = await authService.sendOTP("9876543210");
   *   console.log(`OTP sent! Expires in ${response.data.expiresIn} seconds`);
   * } catch (error) {
   *   console.error("Failed to send OTP:", error.response?.data?.message);
   * }
   * ```
   */
  async sendOTP(phone: string): Promise<SendOTPResponse> {
    const response = await apiClient.post<SendOTPResponse>("/auth/send-otp", {
      phone,
    });
    return response.data;
  }

  /**
   * Verify OTP and authenticate patient
   *
   * This completes the authentication flow by verifying the OTP entered
   * by the patient. On successful verification:
   * - Access token and refresh token are stored in localStorage
   * - User data is stored in localStorage
   * - Patient is automatically authenticated for subsequent API calls
   *
   * @param phone - 10-digit phone number (must match the number OTP was sent to)
   * @param otp - 6-digit OTP code received via SMS
   * @returns Promise with user data and authentication tokens
   * @throws {AxiosError} If OTP is invalid, expired, or phone number doesn't match
   *
   * @example
   * ```typescript
   * try {
   *   const response = await authService.verifyOTP("9876543210", "123456");
   *   console.log(`Welcome ${response.data.user.full_name}!`);
   *   // User is now authenticated, tokens are stored automatically
   * } catch (error) {
   *   console.error("Invalid OTP:", error.response?.data?.message);
   * }
   * ```
   */
  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login/phone-otp",
      {
        phone,
        otp,
      }
    );

    // Extract tokens and user data from response
    const { accessToken, refreshToken, user } = response.data.data;

    // Store authentication data in localStorage
    // These will be automatically used by the API client for subsequent requests
    localStorage.setItem("mibo_access_token", accessToken);
    localStorage.setItem("mibo_refresh_token", refreshToken);
    localStorage.setItem("mibo_user", JSON.stringify(user));

    return response.data;
  }

  /**
   * Check if user is currently authenticated
   *
   * Verifies that both access token and user data exist in localStorage.
   * This is a simple check and does not validate token expiry - the API
   * client will handle expired tokens automatically.
   *
   * @returns true if user has valid authentication data, false otherwise
   *
   * @example
   * ```typescript
   * if (authService.isAuthenticated()) {
   *   // User is logged in, show dashboard
   *   navigate('/dashboard');
   * } else {
   *   // User is not logged in, show login page
   *   navigate('/auth');
   * }
   * ```
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem("mibo_access_token");
    const user = localStorage.getItem("mibo_user");

    // Both token and user data must exist for valid authentication
    return !!(token && user);
  }

  /**
   * Get current authenticated user data
   *
   * Retrieves the user object stored in localStorage during authentication.
   * Returns null if user is not authenticated.
   *
   * @returns User object with patient details, or null if not authenticated
   *
   * @example
   * ```typescript
   * const user = authService.getCurrentUser();
   * if (user) {
   *   console.log(`Logged in as: ${user.full_name}`);
   *   console.log(`Patient ID: ${user.id}`);
   * } else {
   *   console.log("No user logged in");
   * }
   * ```
   */
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem("mibo_user");

    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr) as AuthUser;
    } catch (error) {
      // If JSON parsing fails, clear corrupted data
      console.error("Failed to parse user data from localStorage:", error);
      this.logout();
      return null;
    }
  }

  /**
   * Logout user and clear all authentication data
   *
   * Removes all authentication-related data from localStorage:
   * - Access token
   * - Refresh token
   * - User data
   *
   * After logout, the user will need to authenticate again to access
   * protected resources. The API client will automatically redirect to
   * login page on subsequent API calls.
   *
   * @example
   * ```typescript
   * // Logout button handler
   * const handleLogout = () => {
   *   authService.logout();
   *   navigate('/auth');
   *   toast.success('Logged out successfully');
   * };
   * ```
   */
  logout(): void {
    localStorage.removeItem("mibo_access_token");
    localStorage.removeItem("mibo_refresh_token");
    localStorage.removeItem("mibo_user");
  }

  /**
   * Get access token from localStorage
   *
   * Utility method to retrieve the current access token.
   * Primarily used internally by the API client.
   *
   * @returns Access token string or null if not authenticated
   */
  getAccessToken(): string | null {
    return localStorage.getItem("mibo_access_token");
  }

  /**
   * Get refresh token from localStorage
   *
   * Utility method to retrieve the current refresh token.
   * Can be used for implementing token refresh logic.
   *
   * @returns Refresh token string or null if not authenticated
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("mibo_refresh_token");
  }
}

/**
 * Export singleton instance of AuthService
 *
 * Use this instance throughout the application for authentication operations.
 * Do not create new instances of AuthService.
 *
 * @example
 * ```typescript
 * import authService from './services/authService';
 *
 * // Send OTP
 * await authService.sendOTP(phoneNumber);
 *
 * // Verify OTP
 * await authService.verifyOTP(phoneNumber, otpCode);
 *
 * // Check authentication
 * if (authService.isAuthenticated()) {
 *   const user = authService.getCurrentUser();
 * }
 * ```
 */
export default new AuthService();
