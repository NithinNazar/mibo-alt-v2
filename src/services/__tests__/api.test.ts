/**
 * Unit Tests for API Client
 *
 * Tests the API client configuration including:
 * - Request interceptor (auth token injection)
 * - Response interceptor (error handling, 401 redirects)
 * - Integration with retry logic
 *
 * @module services/__tests__/api.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";
import apiClient from "../api";
import { apiCallWithRetry } from "../../utils/apiRetry";

// Create mock adapter for axios
const mock = new MockAdapter(apiClient);

describe("API Client", () => {
  // Store original localStorage methods
  const originalLocalStorage = { ...localStorage };
  const originalLocation = window.location;

  beforeEach(() => {
    // Clear all mocks before each test
    mock.reset();
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock: { [key: string]: string } = {};
    Storage.prototype.getItem = vi.fn(
      (key: string) => localStorageMock[key] || null
    );
    Storage.prototype.setItem = vi.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    Storage.prototype.removeItem = vi.fn((key: string) => {
      delete localStorageMock[key];
    });

    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: "" } as Location;
  });

  afterEach(() => {
    // Restore original localStorage
    Object.assign(localStorage, originalLocalStorage);
    // Restore window.location
    window.location = originalLocation;
  });

  describe("Request Interceptor - Authentication Token", () => {
    it("should add Authorization header when token exists in localStorage", async () => {
      // Arrange: Set up token in localStorage
      const testToken = "test-jwt-token-12345";
      localStorage.setItem("mibo_access_token", testToken);

      // Mock successful API response
      mock.onGet("/test-endpoint").reply((config) => {
        // Assert: Check that Authorization header was added
        expect(config.headers?.Authorization).toBe(`Bearer ${testToken}`);
        return [200, { success: true, data: "test data" }];
      });

      // Act: Make API call
      const response = await apiClient.get("/test-endpoint");

      // Assert: Verify response
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });

    it("should not add Authorization header when token does not exist", async () => {
      // Arrange: Ensure no token in localStorage
      localStorage.removeItem("mibo_access_token");

      // Mock successful API response
      mock.onGet("/test-endpoint").reply((config) => {
        // Assert: Check that Authorization header was not added
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { success: true, data: "test data" }];
      });

      // Act: Make API call
      const response = await apiClient.get("/test-endpoint");

      // Assert: Verify response
      expect(response.status).toBe(200);
    });

    it("should add token to multiple concurrent requests", async () => {
      // Arrange: Set up token
      const testToken = "concurrent-test-token";
      localStorage.setItem("mibo_access_token", testToken);

      // Mock multiple endpoints
      mock.onGet("/endpoint1").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${testToken}`);
        return [200, { data: "endpoint1" }];
      });

      mock.onGet("/endpoint2").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${testToken}`);
        return [200, { data: "endpoint2" }];
      });

      // Act: Make concurrent API calls
      const [response1, response2] = await Promise.all([
        apiClient.get("/endpoint1"),
        apiClient.get("/endpoint2"),
      ]);

      // Assert: Both requests succeeded
      expect(response1.data.data).toBe("endpoint1");
      expect(response2.data.data).toBe("endpoint2");
    });
  });

  describe("Response Interceptor - 401 Error Handling", () => {
    it("should clear tokens and redirect on 401 Unauthorized", async () => {
      // Arrange: Set up tokens in localStorage
      localStorage.setItem("mibo_access_token", "expired-token");
      localStorage.setItem("mibo_refresh_token", "expired-refresh");
      localStorage.setItem(
        "mibo_user",
        JSON.stringify({ id: 1, name: "Test" })
      );

      // Mock 401 response
      mock.onGet("/protected-endpoint").reply(401, {
        success: false,
        message: "Unauthorized",
      });

      // Act & Assert: API call should fail
      try {
        await apiClient.get("/protected-endpoint");
        expect.fail("Should have thrown an error");
      } catch (error) {
        // Assert: Tokens should be cleared
        expect(localStorage.getItem("mibo_access_token")).toBeNull();
        expect(localStorage.getItem("mibo_refresh_token")).toBeNull();
        expect(localStorage.getItem("mibo_user")).toBeNull();

        // Assert: Should redirect to /auth
        expect(window.location.href).toBe("/auth");
      }
    });

    it("should not redirect if already on auth page", async () => {
      // Arrange: Set current path to /auth
      Object.defineProperty(window.location, "pathname", {
        value: "/auth",
        writable: true,
      });

      // Mock 401 response
      mock.onGet("/test").reply(401);

      // Act & Assert
      try {
        await apiClient.get("/test");
        expect.fail("Should have thrown an error");
      } catch (error) {
        // Assert: Should not change href (prevent redirect loop)
        expect(window.location.href).toBe("");
      }
    });
  });

  describe("Response Interceptor - Network Error Handling", () => {
    it("should return user-friendly message for network errors", async () => {
      // Arrange: Mock network error (no response)
      mock.onGet("/test-endpoint").networkError();

      // Act & Assert
      try {
        await apiClient.get("/test-endpoint");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        // Assert: Error should have user-friendly message
        expect(error.message).toContain("Network error");
        expect(error.message).toContain("internet connection");
        expect(error.type).toBe("network_error");
        expect(error.retryable).toBe(true);
      }
    });

    it("should pass through other HTTP errors", async () => {
      // Arrange: Mock 400 Bad Request
      mock.onPost("/test-endpoint").reply(400, {
        success: false,
        message: "Invalid data",
        errors: [{ field: "email", message: "Invalid email format" }],
      });

      // Act & Assert
      try {
        await apiClient.post("/test-endpoint", { email: "invalid" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        // Assert: Should be an AxiosError with response
        expect((error as AxiosError).response?.status).toBe(400);
        expect((error as AxiosError).response?.data).toEqual({
          success: false,
          message: "Invalid data",
          errors: [{ field: "email", message: "Invalid email format" }],
        });
      }
    });
  });

  describe("Integration with Retry Logic", () => {
    it("should not retry 4xx errors", async () => {
      // Arrange: Mock 404 error
      let callCount = 0;
      mock.onGet("/not-found").reply(() => {
        callCount++;
        return [404, { success: false, message: "Not found" }];
      });

      // Act & Assert
      try {
        await apiCallWithRetry(() => apiClient.get("/not-found"));
        expect.fail("Should have thrown an error");
      } catch (error) {
        // Assert: Should only be called once (no retries for 4xx)
        expect(callCount).toBe(1);
        expect((error as AxiosError).response?.status).toBe(404);
      }
    });

    it("should retry 5xx errors with exponential backoff", async () => {
      // Arrange: Mock 500 error that succeeds on 3rd attempt
      let callCount = 0;
      mock.onGet("/flaky-endpoint").reply(() => {
        callCount++;
        if (callCount < 3) {
          return [500, { success: false, message: "Server error" }];
        }
        return [200, { success: true, data: "Success after retries" }];
      });

      // Act: Call with retry logic
      const response = await apiCallWithRetry(() =>
        apiClient.get("/flaky-endpoint")
      );

      // Assert: Should have retried and eventually succeeded
      expect(callCount).toBe(3);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toBe("Success after retries");
    });

    it("should retry network errors", async () => {
      // Arrange: Mock network error that succeeds on 2nd attempt
      let callCount = 0;
      mock.onGet("/network-test").reply(() => {
        callCount++;
        if (callCount === 1) {
          return [0, null]; // Simulate network error
        }
        return [200, { success: true, data: "Success" }];
      });

      // Act: Call with retry logic
      const response = await apiCallWithRetry(() =>
        apiClient.get("/network-test")
      );

      // Assert: Should have retried
      expect(callCount).toBe(2);
      expect(response.data.success).toBe(true);
    });

    it("should fail after max retries exceeded", async () => {
      // Arrange: Mock persistent 500 error
      let callCount = 0;
      mock.onGet("/always-fails").reply(() => {
        callCount++;
        return [500, { success: false, message: "Persistent error" }];
      });

      // Act & Assert
      try {
        await apiCallWithRetry(() => apiClient.get("/always-fails"), {
          maxRetries: 3,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        // Assert: Should have tried 4 times (initial + 3 retries)
        expect(callCount).toBe(4);
        expect((error as AxiosError).response?.status).toBe(500);
      }
    });
  });

  describe("API Client Configuration", () => {
    it("should have correct base URL", () => {
      // Assert: Check base URL configuration
      expect(apiClient.defaults.baseURL).toBeDefined();
      expect(
        apiClient.defaults.baseURL?.includes("localhost") ||
          apiClient.defaults.baseURL?.includes("api")
      ).toBe(true);
    });

    it("should have 30 second timeout", () => {
      // Assert: Check timeout configuration
      expect(apiClient.defaults.timeout).toBe(30000);
    });

    it("should have JSON content type header", () => {
      // Assert: Check default headers
      expect(apiClient.defaults.headers["Content-Type"]).toBe(
        "application/json"
      );
    });
  });
});
