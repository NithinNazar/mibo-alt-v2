/**
 * Patient Service
 *
 * This service handles patient profile management operations including:
 * - Fetching patient details
 * - Updating patient profile
 * - Validating email and phone formats
 *
 * Validation:
 * - Email: Standard email format validation
 * - Phone: Indian mobile number format (10 digits starting with 6-9)
 *
 * @module services/patientService
 */

import apiClient from "./api";
import type { Patient, UpdatePatientRequest, APIResponse } from "../types";

/**
 * Patient Service Class
 *
 * Manages patient profile data and validation.
 * Implements singleton pattern - use the exported instance.
 */
class PatientService {
  /**
   * Get patient by ID
   *
   * Fetches complete profile information for a patient including:
   * - Personal details (name, phone, email)
   * - Demographics (date of birth, gender, blood group)
   * - Emergency contact information
   * - Additional notes
   *
   * @param id - Patient ID
   * @returns Promise with patient details
   * @throws {AxiosError} If patient not found or API request fails
   *
   * @example
   * ```typescript
   * try {
   *   const patient = await patientService.getPatientById(123);
   *   console.log(`Patient: ${patient.full_name}`);
   *   console.log(`Phone: ${patient.phone}`);
   *   console.log(`Email: ${patient.email || 'Not provided'}`);
   *   console.log(`DOB: ${patient.date_of_birth || 'Not provided'}`);
   *   console.log(`Gender: ${patient.gender || 'Not specified'}`);
   *
   *   if (patient.emergency_contact_name) {
   *     console.log(`Emergency Contact: ${patient.emergency_contact_name}`);
   *     console.log(`Emergency Phone: ${patient.emergency_contact_phone}`);
   *   }
   * } catch (error) {
   *   console.error("Failed to fetch patient details:", error);
   * }
   * ```
   */
  async getPatientById(id: number): Promise<Patient> {
    try {
      const response = await apiClient.get<APIResponse<Patient>>(
        `/patients/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch patient ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update patient profile
   *
   * Updates editable fields in a patient's profile. The following fields
   * can be updated:
   * - date_of_birth: Date in YYYY-MM-DD format
   * - gender: "male", "female", or "other"
   * - blood_group: Blood group (e.g., "A+", "O-", "B+")
   * - emergency_contact_name: Name of emergency contact person
   * - emergency_contact_phone: Phone number of emergency contact
   * - notes: Additional notes or medical history
   *
   * Note: Name and phone number cannot be updated through this method
   * as they are tied to authentication.
   *
   * @param id - Patient ID
   * @param data - Updated patient data (only include fields to update)
   * @returns Promise with updated patient details
   * @throws {AxiosError} If validation fails or update fails
   *
   * @example
   * ```typescript
   * try {
   *   const updatedPatient = await patientService.updatePatient(123, {
   *     date_of_birth: "1990-05-15",
   *     gender: "male",
   *     blood_group: "O+",
   *     emergency_contact_name: "John Doe",
   *     emergency_contact_phone: "9876543210"
   *   });
   *
   *   console.log("Profile updated successfully!");
   * } catch (error) {
   *   if (error.response?.status === 400) {
   *     console.error("Validation error:", error.response.data.message);
   *   } else {
   *     console.error("Failed to update profile:", error);
   *   }
   * }
   * ```
   */
  async updatePatient(
    id: number,
    data: UpdatePatientRequest
  ): Promise<Patient> {
    try {
      // Validate phone number if provided
      if (
        data.emergency_contact_phone &&
        !this.validatePhone(data.emergency_contact_phone)
      ) {
        throw new Error(
          "Invalid emergency contact phone number. Must be a 10-digit Indian mobile number."
        );
      }

      const response = await apiClient.put<APIResponse<Patient>>(
        `/patients/${id}`,
        data
      );

      console.log(`Patient ${id} updated successfully`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update patient ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate email format
   *
   * Validates that an email address follows the standard email format.
   * Uses a regex pattern that checks for:
   * - Local part (before @)
   * - @ symbol
   * - Domain name
   * - Top-level domain
   *
   * @param email - Email address to validate
   * @returns true if email is valid, false otherwise
   *
   * @example
   * ```typescript
   * // Valid emails
   * patientService.validateEmail("user@example.com"); // true
   * patientService.validateEmail("john.doe@hospital.co.in"); // true
   *
   * // Invalid emails
   * patientService.validateEmail("invalid"); // false
   * patientService.validateEmail("user@"); // false
   * patientService.validateEmail("@example.com"); // false
   * patientService.validateEmail("user @example.com"); // false (space)
   * ```
   */
  validateEmail(email: string): boolean {
    // Standard email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Indian phone number format
   *
   * Validates that a phone number follows the Indian mobile number format:
   * - Exactly 10 digits
   * - Starts with 6, 7, 8, or 9 (valid Indian mobile prefixes)
   * - No spaces, dashes, or other characters
   *
   * @param phone - Phone number to validate
   * @returns true if phone number is valid, false otherwise
   *
   * @example
   * ```typescript
   * // Valid phone numbers
   * patientService.validatePhone("9876543210"); // true
   * patientService.validatePhone("8123456789"); // true
   * patientService.validatePhone("7000000000"); // true
   * patientService.validatePhone("6999999999"); // true
   *
   * // Invalid phone numbers
   * patientService.validatePhone("5876543210"); // false (starts with 5)
   * patientService.validatePhone("987654321"); // false (only 9 digits)
   * patientService.validatePhone("98765432100"); // false (11 digits)
   * patientService.validatePhone("9876 543 210"); // false (contains spaces)
   * patientService.validatePhone("9876-543-210"); // false (contains dashes)
   * ```
   */
  validatePhone(phone: string): boolean {
    // Indian mobile number regex: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate date of birth
   *
   * Validates that a date of birth is:
   * - In valid YYYY-MM-DD format
   * - Not in the future
   * - Represents a reasonable age (not more than 150 years ago)
   *
   * @param dateOfBirth - Date string in YYYY-MM-DD format
   * @returns true if date is valid, false otherwise
   *
   * @example
   * ```typescript
   * patientService.validateDateOfBirth("1990-05-15"); // true
   * patientService.validateDateOfBirth("2025-01-01"); // false (future date)
   * patientService.validateDateOfBirth("1850-01-01"); // false (too old)
   * patientService.validateDateOfBirth("15-05-1990"); // false (wrong format)
   * ```
   */
  validateDateOfBirth(dateOfBirth: string): boolean {
    // Check format: YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      return false;
    }

    const date = new Date(dateOfBirth);
    const now = new Date();

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }

    // Check if date is not in the future
    if (date > now) {
      return false;
    }

    // Check if date is not more than 150 years ago
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 150);
    if (date < minDate) {
      return false;
    }

    return true;
  }

  /**
   * Calculate age from date of birth
   *
   * Calculates the current age in years from a date of birth.
   *
   * @param dateOfBirth - Date string in YYYY-MM-DD format
   * @returns Age in years, or null if date is invalid
   *
   * @example
   * ```typescript
   * const age = patientService.calculateAge("1990-05-15");
   * console.log(`Patient is ${age} years old`);
   * ```
   */
  calculateAge(dateOfBirth: string): number | null {
    if (!this.validateDateOfBirth(dateOfBirth)) {
      return null;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Format patient name
   *
   * Formats a patient's name for display (capitalizes first letter of each word).
   *
   * @param name - Patient's full name
   * @returns Formatted name
   *
   * @example
   * ```typescript
   * patientService.formatName("john doe"); // "John Doe"
   * patientService.formatName("JANE SMITH"); // "Jane Smith"
   * ```
   */
  formatName(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Format phone number for display
   *
   * Formats a 10-digit phone number with spaces for better readability.
   *
   * @param phone - 10-digit phone number
   * @returns Formatted phone number
   *
   * @example
   * ```typescript
   * patientService.formatPhone("9876543210"); // "98765 43210"
   * ```
   */
  formatPhone(phone: string): string {
    if (phone.length !== 10) {
      return phone;
    }
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
}

/**
 * Export singleton instance of PatientService
 *
 * Use this instance throughout the application for patient operations.
 * Do not create new instances of PatientService.
 *
 * @example
 * ```typescript
 * import patientService from './services/patientService';
 *
 * // Get patient details
 * const patient = await patientService.getPatientById(123);
 *
 * // Update patient profile
 * const updated = await patientService.updatePatient(123, {
 *   date_of_birth: "1990-05-15",
 *   gender: "male",
 *   blood_group: "O+"
 * });
 *
 * // Validate email
 * if (patientService.validateEmail(email)) {
 *   // Email is valid
 * }
 *
 * // Validate phone
 * if (patientService.validatePhone(phone)) {
 *   // Phone is valid
 * }
 * ```
 */
export default new PatientService();
