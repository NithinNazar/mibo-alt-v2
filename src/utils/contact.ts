/**
 * Shared Bangalore contact details.
 * Single source of truth for the Bangalore care-team phone number.
 * (Kochi uses its own number, defined in KochiLanding.tsx.)
 */
export const BANGALORE_PHONE = "7996004444";
export const BANGALORE_PHONE_DISPLAY = `+91 ${BANGALORE_PHONE}`;
export const BANGALORE_TEL_LINK = `tel:+91${BANGALORE_PHONE}`;
export const BANGALORE_WHATSAPP_URL = `https://wa.me/91${BANGALORE_PHONE}`;

/**
 * Kochi care-team phone number (same number used on the Kochi landing page).
 */
export const KOCHI_PHONE = "9447511479";
export const KOCHI_PHONE_DISPLAY = `+91 ${KOCHI_PHONE}`;
export const KOCHI_TEL_LINK = `tel:+91${KOCHI_PHONE}`;
export const KOCHI_WHATSAPP_URL = `https://wa.me/91${KOCHI_PHONE}`;

/**
 * Default Mibo contact number, used on every page that is not a
 * location landing page (/kochi, /bangalore, /bengaluru).
 */
export const DEFAULT_PHONE = "9083335000";
export const DEFAULT_PHONE_DISPLAY = `+91 90833 35000`;
export const DEFAULT_TEL_LINK = `tel:+91${DEFAULT_PHONE}`;
export const DEFAULT_WHATSAPP_URL = `https://wa.me/91${DEFAULT_PHONE}`;