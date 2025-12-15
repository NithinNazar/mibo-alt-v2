/**
 * Centre Service
 *
 * This service handles operations related to hospital centres (locations).
 * It provides methods to:
 * - Fetch all centres
 * - Get individual centre details
 * - Fallback to hardcoded data if API fails
 *
 * Fallback Strategy:
 * - Primary: Fetch centres from backend API
 * - Fallback: Use hardcoded centre data for Bangalore, Mumbai, and Kochi
 * - This ensures the booking flow works even if the centres API is unavailable
 *
 * @module services/centreService
 */

import apiClient from "./api";
import type { Centre, APIResponse } from "../types";

/**
 * Centre Service Class
 *
 * Manages hospital centre data with fallback support.
 * Implements singleton pattern - use the exported instance.
 */
class CentreService {
  /**
   * Fallback centre data
   * Used when API is unavailable or fails
   * @private
   */
  private readonly fallbackCentres: Centre[] = [
    {
      id: 1,
      name: "Mibo Bangalore Centre",
      city: "bangalore",
      address_line_1: "MG Road, Bangalore",
      address_line_2: null,
      pincode: "560001",
      contact_phone: "9876543210",
      is_active: true,
    },
    {
      id: 2,
      name: "Mibo Mumbai Centre",
      city: "mumbai",
      address_line_1: "Andheri West, Mumbai",
      address_line_2: null,
      pincode: "400053",
      contact_phone: "9876543211",
      is_active: true,
    },
    {
      id: 3,
      name: "Mibo Kochi Centre",
      city: "kochi",
      address_line_1: "Marine Drive, Kochi",
      address_line_2: null,
      pincode: "682031",
      contact_phone: "9876543212",
      is_active: true,
    },
  ];

  /**
   * Get all centres
   *
   * Fetches the list of all hospital centres from the backend API.
   * If the API call fails (network error, server error, etc.), it falls back
   * to hardcoded centre data to ensure the booking flow continues to work.
   *
   * The fallback data includes centres in:
   * - Bangalore (MG Road)
   * - Mumbai (Andheri West)
   * - Kochi (Marine Drive)
   *
   * @returns Promise with array of centres
   *
   * @example
   * ```typescript
   * try {
   *   const centres = await centreService.getCentres();
   *   console.log(`Found ${centres.length} centres`);
   *
   *   centres.forEach(centre => {
   *     console.log(`${centre.name} - ${centre.city}`);
   *     console.log(`Address: ${centre.address_line_1}`);
   *     console.log(`Contact: ${centre.contact_phone}`);
   *   });
   * } catch (error) {
   *   // This should rarely happen due to fallback
   *   console.error("Failed to fetch centres:", error);
   * }
   * ```
   */
  async getCentres(): Promise<Centre[]> {
    try {
      // Attempt to fetch centres from API
      const response = await apiClient.get<APIResponse<Centre[]>>("/centres");
      console.log("Centres fetched from API successfully");
      return response.data.data;
    } catch (error) {
      // API call failed - use fallback data
      console.warn(
        "Failed to fetch centres from API, using fallback data:",
        error
      );
      return this.fallbackCentres;
    }
  }

  /**
   * Get centre by ID
   *
   * Fetches detailed information about a specific centre.
   * If the API call fails, it attempts to find the centre in the fallback data.
   * If the centre is not found in fallback data either, the error is thrown.
   *
   * @param id - Centre ID
   * @returns Promise with centre details
   * @throws {AxiosError} If centre not found in both API and fallback data
   *
   * @example
   * ```typescript
   * try {
   *   const centre = await centreService.getCentreById(1);
   *   console.log(`Centre: ${centre.name}`);
   *   console.log(`Location: ${centre.city}`);
   *   console.log(`Address: ${centre.address_line_1}, ${centre.pincode}`);
   *   console.log(`Contact: ${centre.contact_phone}`);
   * } catch (error) {
   *   console.error("Centre not found");
   * }
   * ```
   */
  async getCentreById(id: number): Promise<Centre> {
    try {
      // Attempt to fetch centre from API
      const response = await apiClient.get<APIResponse<Centre>>(
        `/centres/${id}`
      );
      console.log(`Centre ${id} fetched from API successfully`);
      return response.data.data;
    } catch (error) {
      // API call failed - try fallback data
      console.warn(
        `Failed to fetch centre ${id} from API, checking fallback data:`,
        error
      );

      const fallbackCentre = this.fallbackCentres.find((c) => c.id === id);

      if (fallbackCentre) {
        console.log(`Using fallback data for centre ${id}`);
        return fallbackCentre;
      }

      // Centre not found in fallback data either
      console.error(`Centre ${id} not found in API or fallback data`);
      throw error;
    }
  }

  /**
   * Get centres by city
   *
   * Filters centres by city. This is a client-side filter that works
   * with both API data and fallback data.
   *
   * @param city - City name (bangalore, mumbai, or kochi)
   * @returns Promise with array of centres in the specified city
   *
   * @example
   * ```typescript
   * const bangaloreCentres = await centreService.getCentresByCity("bangalore");
   * console.log(`Found ${bangaloreCentres.length} centres in Bangalore`);
   * ```
   */
  async getCentresByCity(
    city: "bangalore" | "mumbai" | "kochi"
  ): Promise<Centre[]> {
    const allCentres = await this.getCentres();
    return allCentres.filter(
      (centre) => centre.city.toLowerCase() === city.toLowerCase()
    );
  }

  /**
   * Get active centres only
   *
   * Filters centres to return only those that are currently active.
   * Inactive centres are not available for booking.
   *
   * @returns Promise with array of active centres
   *
   * @example
   * ```typescript
   * const activeCentres = await centreService.getActiveCentres();
   * // Use these centres in booking flow
   * ```
   */
  async getActiveCentres(): Promise<Centre[]> {
    const allCentres = await this.getCentres();
    return allCentres.filter((centre) => centre.is_active);
  }

  /**
   * Get fallback centres
   *
   * Returns the hardcoded fallback centre data without making an API call.
   * Useful for testing or when you explicitly want to use fallback data.
   *
   * @returns Array of fallback centres
   *
   * @example
   * ```typescript
   * const fallbackCentres = centreService.getFallbackCentres();
   * console.log("Fallback centres:", fallbackCentres);
   * ```
   */
  getFallbackCentres(): Centre[] {
    return [...this.fallbackCentres]; // Return a copy to prevent mutation
  }

  /**
   * Format centre address
   *
   * Utility method to format a centre's address into a single string.
   * Useful for displaying addresses in UI components.
   *
   * @param centre - Centre object
   * @returns Formatted address string
   *
   * @example
   * ```typescript
   * const centre = await centreService.getCentreById(1);
   * const address = centreService.formatAddress(centre);
   * console.log(address);
   * // Output: "MG Road, Bangalore, 560001"
   * ```
   */
  formatAddress(centre: Centre): string {
    const parts = [centre.address_line_1];

    if (centre.address_line_2) {
      parts.push(centre.address_line_2);
    }

    // Capitalize city name
    const cityName = centre.city.charAt(0).toUpperCase() + centre.city.slice(1);
    parts.push(cityName);

    parts.push(centre.pincode);

    return parts.join(", ");
  }

  /**
   * Get centre display name with city
   *
   * Returns a formatted display name including the city.
   * Useful for dropdowns and selection lists.
   *
   * @param centre - Centre object
   * @returns Formatted display name
   *
   * @example
   * ```typescript
   * const centre = await centreService.getCentreById(1);
   * const displayName = centreService.getDisplayName(centre);
   * console.log(displayName);
   * // Output: "Mibo Bangalore Centre (Bangalore)"
   * ```
   */
  getDisplayName(centre: Centre): string {
    const cityName = centre.city.charAt(0).toUpperCase() + centre.city.slice(1);
    return `${centre.name} (${cityName})`;
  }
}

/**
 * Export singleton instance of CentreService
 *
 * Use this instance throughout the application for centre operations.
 * Do not create new instances of CentreService.
 *
 * @example
 * ```typescript
 * import centreService from './services/centreService';
 *
 * // Get all centres
 * const centres = await centreService.getCentres();
 *
 * // Get specific centre
 * const centre = await centreService.getCentreById(1);
 *
 * // Get centres by city
 * const bangaloreCentres = await centreService.getCentresByCity("bangalore");
 *
 * // Get only active centres
 * const activeCentres = await centreService.getActiveCentres();
 *
 * // Format address
 * const address = centreService.formatAddress(centre);
 * ```
 */
export default new CentreService();
