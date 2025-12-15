/**
 * API Retry Utility
 *
 * This module provides retry logic with exponential backoff for API calls.
 * It automatically retries failed requests with increasing delays between attempts,
 * but skips retries for client errors (4xx status codes).
 *
 * Features:
 * - Exponential backoff (delays: 1s, 2s, 4s)
 * - Maximum 3 retry attempts
 * - Skips retries for 4xx errors (client errors)
 * - Retries network errors and 5xx errors (server errors)
 *
 * @module utils/apiRetry
 */

import { AxiosError } from "axios";

/**
 * Configuration for retry behavior
 */
interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 1000ms = 1s) */
  initialDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  backoffMultiplier: 2, // Exponential: 1s, 2s, 4s
};

/**
 * Determines if an error is retryable
 *
 * Retryable errors:
 * - Network errors (no response from server)
 * - 5xx server errors (500, 502, 503, 504, etc.)
 *
 * Non-retryable errors:
 * - 4xx client errors (400, 401, 403, 404, etc.)
 * - These indicate issues with the request itself that won't be fixed by retrying
 *
 * @param error - The error to check
 * @returns true if the error should be retried, false otherwise
 */
function isRetryableError(error: AxiosError): boolean {
  // Network errors (no response) are retryable
  if (!error.response) {
    return true;
  }

  // Get HTTP status code
  const status = error.response.status;

  // 4xx errors are client errors - don't retry
  // These indicate problems with the request (bad data, unauthorized, not found, etc.)
  if (status >= 400 && status < 500) {
    return false;
  }

  // 5xx errors are server errors - retry these
  // The server might recover on subsequent attempts
  if (status >= 500) {
    return true;
  }

  // Other errors (shouldn't happen, but be safe) - don't retry
  return false;
}

/**
 * Delays execution for a specified number of milliseconds
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes an API call with automatic retry logic and exponential backoff
 *
 * This function wraps any async API call and automatically retries it if it fails
 * with a retryable error. The delay between retries increases exponentially.
 *
 * Example delays with default config:
 * - Attempt 1: immediate
 * - Attempt 2: after 1 second
 * - Attempt 3: after 2 seconds
 * - Attempt 4: after 4 seconds
 *
 * @template T - The return type of the API call
 * @param apiCall - Async function that makes the API call
 * @param config - Optional retry configuration
 * @returns Promise that resolves with the API response or rejects with the final error
 *
 * @example
 * ```typescript
 * // Basic usage
 * const data = await apiCallWithRetry(() => apiClient.get('/patients'));
 *
 * // Custom retry config
 * const data = await apiCallWithRetry(
 *   () => apiClient.post('/appointments', appointmentData),
 *   { maxRetries: 5, initialDelay: 2000 }
 * );
 * ```
 */
export async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  // Merge provided config with defaults
  const { maxRetries, initialDelay, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error | AxiosError;
  let attempt = 0;

  // Try the API call up to maxRetries + 1 times (initial attempt + retries)
  while (attempt <= maxRetries) {
    try {
      // Attempt the API call
      const result = await apiCall();

      // Success! Return the result
      return result;
    } catch (error) {
      lastError = error as Error | AxiosError;

      // Check if this is an Axios error and if it's retryable
      const isAxiosError =
        "isAxiosError" in lastError && lastError.isAxiosError;
      const shouldRetry =
        isAxiosError && isRetryableError(lastError as AxiosError);

      // If this is the last attempt or error is not retryable, throw immediately
      if (attempt >= maxRetries || !shouldRetry) {
        console.error(
          `API call failed after ${attempt + 1} attempt(s):`,
          lastError
        );
        throw lastError;
      }

      // Calculate delay for next retry using exponential backoff
      // Formula: initialDelay * (backoffMultiplier ^ attempt)
      // Example: 1000 * (2 ^ 0) = 1000ms, 1000 * (2 ^ 1) = 2000ms, 1000 * (2 ^ 2) = 4000ms
      const delayMs = initialDelay * Math.pow(backoffMultiplier, attempt);

      console.warn(
        `API call failed (attempt ${attempt + 1}/${
          maxRetries + 1
        }). Retrying in ${delayMs}ms...`,
        lastError
      );

      // Wait before retrying
      await delay(delayMs);

      // Increment attempt counter
      attempt++;
    }
  }

  // This should never be reached due to the throw in the catch block,
  // but TypeScript needs this for type safety
  throw lastError!;
}

/**
 * Export retry configuration type for use in other modules
 */
export type { RetryConfig };
