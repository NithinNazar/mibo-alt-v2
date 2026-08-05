// src/pages/Experts/data/doctors.ts
/**
 * Doctor type definition for Experts page
 * Clinician data is now fetched from the database via API
 * This file only maintains the type definition for backward compatibility
 */

export interface Doctor {
  id: number | string; // Support both string and number IDs from database
  name: string;
  bio?: string; // clinician description/about text, shown in the View Profile modal
  rating?: number; // optional average rating (e.g. 4.9), shown as a badge when available
  reviewsCount?: number; // optional number of reviews backing the rating
  qualification: string;
  designation: string;
  experience: string;
  expertise: string[];
  image: string; // primary/legacy image, kept for backward compatibility
  images?: string[]; // optional gallery of profile images (falls back to [image])
  videoUrl?: string; // optional YouTube URL (watch, youtu.be, or embed link)
  location: "Bangalore" | "Kochi" | "Mumbai";
  language: string[];
  price: string;
  sessionTypes: string;
  nextAvailableSlot?: string; // optional ISO date string; shown as "Next Available" when present
}

/**
 * @deprecated Static doctor data is no longer used
 * Clinicians are now managed through the admin panel and fetched from database
 * This export is kept for backward compatibility only
 */
export const doctors: Doctor[] = [];