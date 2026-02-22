/**
 * Clinician Service
 *
 * This service handles all operations related to clinicians (doctors/therapists).
 * It provides methods to:
 * - Fetch all clinicians with optional filtering
 * - Get individual clinician details
 * - Cache clinician data to reduce API calls
 *
 * Caching Strategy:
 * - Clinician data is cached for 5 minutes after first fetch
 * - Subsequent requests within 5 minutes use cached data
 * - Cache automatically expires after 5 minutes
 * - Cache can be manually cleared if needed
 *
 * @module services/clinicianService
 */

import axios from "axios";
import apiClient from "./api";
import type { Clinician, GetCliniciansParams, APIResponse } from "../types";

/**
 * Cache structure for storing clinician data
 */
interface ClinicianCache {
  data: Clinician[] | null;
  timestamp: number | null;
}

/**
 * Clinician Service Class
 *
 * Manages clinician data fetching and caching.
 * Implements singleton pattern - use the exported instance.
 */
class ClinicianService {
  /**
   * In-memory cache for clinician data
   * @private
   */
  private cache: ClinicianCache = {
    data: null,
    timestamp: null,
  };

  /**
   * Cache duration in milliseconds (5 minutes)
   * @private
   */
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all clinicians with optional filters
   *
   * This method fetches clinician data from the API or returns cached data
   * if available and not expired. Supports filtering by centre and specialization.
   *
   * This is a PUBLIC endpoint - no authentication required.
   * If a 401 error occurs, it will retry without the auth token.
   *
   * Caching behavior:
   * - First call: Fetches from API and caches result
   * - Subsequent calls within 5 minutes: Returns cached data
   * - Calls after 5 minutes: Fetches fresh data from API
   *
   * @param params - Optional filters for clinicians
   * @param params.centreId - Filter by primary centre ID
   * @param params.specialization - Filter by specialization (case-insensitive substring match)
   * @returns Promise with array of clinicians matching the filters
   * @throws {AxiosError} If API request fails
   *
   * @example
   * ```typescript
   * // Get all clinicians
   * const allClinicians = await clinicianService.getClinicians();
   *
   * // Get clinicians at a specific centre
   * const bangaloreClinicians = await clinicianService.getClinicians({
   *   centreId: 1
   * });
   *
   * // Get clinicians with specific specialization
   * const psychiatrists = await clinicianService.getClinicians({
   *   specialization: "Psychiatry"
   * });
   *
   * // Combine filters
   * const bangalorePsychiatrists = await clinicianService.getClinicians({
   *   centreId: 1,
   *   specialization: "Psychiatry"
   * });
   * ```
   */
  async getClinicians(params?: GetCliniciansParams): Promise<Clinician[]> {
    // Check if cache is valid (data exists and not expired)
    const now = Date.now();
    const isCacheValid =
      this.cache.data !== null &&
      this.cache.timestamp !== null &&
      now - this.cache.timestamp < this.CACHE_DURATION;

    // If cache is valid, use cached data
    if (isCacheValid) {
      console.log("Using cached clinician data");
      return this.filterClinicians(this.cache.data!, params);
    }

    // Cache is invalid or expired, fetch fresh data from API
    console.log("Fetching fresh clinician data from API");

    try {
      // Create a custom axios instance without auth interceptor for this public endpoint
      const response = await axios.get<APIResponse<Clinician[]>>(
        `${apiClient.defaults.baseURL}/users/clinicians`,
        {
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Update cache with fresh data
      this.cache.data = response.data.data;
      this.cache.timestamp = now;

      // Apply filters and return
      return this.filterClinicians(this.cache.data, params);
    } catch (error) {
      console.error("Failed to fetch clinicians:", error);
      throw error;
    }
  }

  /**
   * Get clinician by ID
   *
   * Fetches detailed information about a specific clinician.
   * This method always fetches fresh data from the API to ensure
   * the most up-to-date information.
   *
   * @param id - Clinician ID
   * @returns Promise with clinician details
   * @throws {AxiosError} If clinician not found or API request fails
   *
   * @example
   * ```typescript
   * try {
   *   const clinician = await clinicianService.getClinicianById(5);
   *   console.log(`Dr. ${clinician.full_name}`);
   *   console.log(`Specialization: ${clinician.specialization}`);
   *   console.log(`Experience: ${clinician.experience_years} years`);
   *   console.log(`Fee: ₹${clinician.consultation_fee}`);
   * } catch (error) {
   *   console.error("Clinician not found");
   * }
   * ```
   */
  async getClinicianById(id: number): Promise<Clinician> {
    try {
      const response = await apiClient.get<APIResponse<Clinician>>(
        `/users/clinicians/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch clinician with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Clear the clinician cache
   *
   * Forces the next getClinicians() call to fetch fresh data from the API.
   * Useful when you know clinician data has been updated and want to
   * immediately reflect those changes.
   *
   * @example
   * ```typescript
   * // After a clinician updates their profile
   * clinicianService.clearCache();
   * const updatedClinicians = await clinicianService.getClinicians();
   * ```
   */
  clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = null;
    console.log("Clinician cache cleared");
  }

  /**
   * Filter clinicians based on provided parameters
   *
   * Applies client-side filtering to clinician array based on:
   * - Centre ID: Exact match on primary_centre_id
   * - Specialization: Case-insensitive substring match
   *
   * @private
   * @param clinicians - Array of clinicians to filter
   * @param params - Filter parameters
   * @returns Filtered array of clinicians
   */
  private filterClinicians(
    clinicians: Clinician[],
    params?: GetCliniciansParams,
  ): Clinician[] {
    // If no filters provided, return all clinicians
    if (!params) {
      return clinicians;
    }

    // Apply filters
    return clinicians.filter((clinician) => {
      // Filter by centre ID (exact match)
      if (
        params.centreId !== undefined &&
        clinician.primaryCentreId !== params.centreId
      ) {
        return false;
      }

      // Filter by specialization (case-insensitive substring match)
      if (params.specialization) {
        // Handle both string and array specialization
        const specializationStr = Array.isArray(clinician.specialization)
          ? clinician.specialization.join(" ")
          : clinician.specialization;
        const specializationLower = specializationStr.toLowerCase();
        const searchLower = params.specialization.toLowerCase();

        if (!specializationLower.includes(searchLower)) {
          return false;
        }
      }

      // Clinician passes all filters
      return true;
    });
  }

  /**
   * Get cache status
   *
   * Returns information about the current cache state.
   * Useful for debugging and monitoring cache behavior.
   *
   * @returns Object with cache status information
   *
   * @example
   * ```typescript
   * const status = clinicianService.getCacheStatus();
   * console.log(`Cache has data: ${status.hasData}`);
   * console.log(`Cache is valid: ${status.isValid}`);
   * console.log(`Time until expiry: ${status.timeUntilExpiry}ms`);
   * ```
   */
  getCacheStatus(): {
    hasData: boolean;
    isValid: boolean;
    timestamp: number | null;
    timeUntilExpiry: number | null;
  } {
    const now = Date.now();
    const hasData = this.cache.data !== null;
    const isValid =
      hasData &&
      this.cache.timestamp !== null &&
      now - this.cache.timestamp < this.CACHE_DURATION;

    const timeUntilExpiry =
      isValid && this.cache.timestamp !== null
        ? this.CACHE_DURATION - (now - this.cache.timestamp)
        : null;

    return {
      hasData,
      isValid,
      timestamp: this.cache.timestamp,
      timeUntilExpiry,
    };
  }
}

/**
 * Export singleton instance of ClinicianService
 *
 * Use this instance throughout the application for clinician operations.
 * Do not create new instances of ClinicianService.
 *
 * @example
 * ```typescript
 * import clinicianService from './services/clinicianService';
 *
 * // Fetch clinicians
 * const clinicians = await clinicianService.getClinicians();
 *
 * // Filter by centre
 * const centreClinic = await clinicianService.getClinicians({ centreId: 1 });
 *
 * // Get specific clinician
 * const doctor = await clinicianService.getClinicianById(5);
 *
 * // Clear cache when needed
 * clinicianService.clearCache();
 * ```
 */
export default new ClinicianService();
