// src/pages/Experts/data/doctors.ts
/**
 * Doctor type definition for Experts page
 * Clinician data is now fetched from the database via API
 * This file only maintains the type definition for backward compatibility
 */

export interface Doctor {
  id: number | string; // Support both string and number IDs from database
  name: string;
  qualification: string;
  designation: string;
  experience: string;
  expertise: string[];
  image: string;
  location: "Bangalore" | "Kochi" | "Mumbai";
  language: string[];
  price: string;
  sessionTypes: string;
}

/**
 * @deprecated Static doctor data is no longer used
 * Clinicians are now managed through the admin panel and fetched from database
 * This export is kept for backward compatibility only
 */
export const doctors: Doctor[] = [];
