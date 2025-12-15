/**
 * Date and Time Helper Utilities
 *
 * This module provides utility functions for date and time operations
 * used throughout the patient booking application. It includes:
 * - Date formatting for API and display
 * - Time formatting for user-friendly display
 * - Appointment time checking (for video call availability)
 * - Date comparison utilities
 *
 * All functions handle timezone considerations and provide consistent
 * formatting across the application.
 *
 * @module utils/dateHelpers
 */

/**
 * Format date for API requests
 *
 * Converts a Date object to YYYY-MM-DD format required by the backend API.
 * This format is used for:
 * - Fetching appointment availability
 * - Creating appointments
 * - Filtering appointments by date
 *
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 11, 20); // December 20, 2024
 * formatDateForAPI(date); // "2024-12-20"
 *
 * const today = new Date();
 * formatDateForAPI(today); // "2024-12-15" (current date)
 * ```
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Format date for user-friendly display
 *
 * Converts a Date object or ISO string to a readable format for display in UI.
 * Uses the user's locale for formatting.
 *
 * Output formats:
 * - Short: "Dec 20, 2024"
 * - Long: "December 20, 2024"
 * - With day: "Wednesday, December 20, 2024"
 *
 * @param date - Date object or ISO string
 * @param format - Display format ("short", "long", or "full")
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 11, 20);
 *
 * formatDateForDisplay(date); // "Dec 20, 2024" (default: short)
 * formatDateForDisplay(date, "long"); // "December 20, 2024"
 * formatDateForDisplay(date, "full"); // "Friday, December 20, 2024"
 *
 * // Also works with ISO strings
 * formatDateForDisplay("2024-12-20T10:00:00+05:30"); // "Dec 20, 2024"
 * ```
 */
export function formatDateForDisplay(
  date: Date | string,
  format: "short" | "long" | "full" = "short"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: format === "short" ? "short" : "long",
    day: "numeric",
  };

  if (format === "full") {
    options.weekday = "long";
  }

  return dateObj.toLocaleDateString("en-IN", options);
}

/**
 * Format time for user-friendly display
 *
 * Converts a Date object or ISO string to a readable time format.
 * Uses 12-hour format with AM/PM.
 *
 * @param date - Date object or ISO string
 * @param includeSeconds - Whether to include seconds (default: false)
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 11, 20, 14, 30, 0);
 *
 * formatTimeForDisplay(date); // "2:30 PM"
 * formatTimeForDisplay(date, true); // "2:30:00 PM"
 *
 * // Also works with ISO strings
 * formatTimeForDisplay("2024-12-20T14:30:00+05:30"); // "2:30 PM"
 * ```
 */
export function formatTimeForDisplay(
  date: Date | string,
  includeSeconds: boolean = false
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Time";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  if (includeSeconds) {
    options.second = "2-digit";
  }

  return dateObj.toLocaleTimeString("en-IN", options);
}

/**
 * Format date and time together for display
 *
 * Combines date and time formatting for complete datetime display.
 *
 * @param date - Date object or ISO string
 * @param dateFormat - Date format ("short", "long", or "full")
 * @returns Formatted datetime string
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 11, 20, 14, 30);
 *
 * formatDateTimeForDisplay(date); // "Dec 20, 2024 at 2:30 PM"
 * formatDateTimeForDisplay(date, "long"); // "December 20, 2024 at 2:30 PM"
 * formatDateTimeForDisplay(date, "full"); // "Friday, December 20, 2024 at 2:30 PM"
 * ```
 */
export function formatDateTimeForDisplay(
  date: Date | string,
  dateFormat: "short" | "long" | "full" = "short"
): string {
  const formattedDate = formatDateForDisplay(date, dateFormat);
  const formattedTime = formatTimeForDisplay(date);

  return `${formattedDate} at ${formattedTime}`;
}

/**
 * Check if appointment is starting soon (within 15 minutes)
 *
 * Determines if an appointment is within 15 minutes of its start time.
 * Used to show "Join Video Call" button for online appointments.
 *
 * @param scheduledStartAt - Appointment start time (ISO string or Date)
 * @returns true if appointment starts within 15 minutes, false otherwise
 *
 * @example
 * ```typescript
 * // Appointment starts in 10 minutes
 * const futureDate = new Date(Date.now() + 10 * 60 * 1000);
 * isAppointmentStartingSoon(futureDate); // true
 *
 * // Appointment starts in 20 minutes
 * const laterDate = new Date(Date.now() + 20 * 60 * 1000);
 * isAppointmentStartingSoon(laterDate); // false
 *
 * // Appointment already started (5 minutes ago)
 * const pastDate = new Date(Date.now() - 5 * 60 * 1000);
 * isAppointmentStartingSoon(pastDate); // true (still within window)
 * ```
 */
export function isAppointmentStartingSoon(
  scheduledStartAt: Date | string
): boolean {
  const startTime =
    typeof scheduledStartAt === "string"
      ? new Date(scheduledStartAt)
      : scheduledStartAt;
  const now = new Date();

  // 15 minutes in milliseconds
  const fifteenMinutes = 15 * 60 * 1000;

  // Calculate time difference
  const timeDiff = startTime.getTime() - now.getTime();

  // Allow joining 15 minutes before start time
  // Also allow joining if appointment has already started (negative timeDiff)
  return timeDiff <= fifteenMinutes;
}

/**
 * Check if a date is in the future
 *
 * Determines if a date is after the current date/time.
 * Used for categorizing appointments as upcoming or past.
 *
 * @param date - Date to check (ISO string or Date)
 * @returns true if date is in the future, false otherwise
 *
 * @example
 * ```typescript
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * isFutureDate(tomorrow); // true
 *
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * isFutureDate(yesterday); // false
 *
 * // Also works with ISO strings
 * isFutureDate("2025-12-20T10:00:00+05:30"); // true (if in future)
 * ```
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  return dateObj.getTime() > now.getTime();
}

/**
 * Check if a date is today
 *
 * Determines if a date falls on the current day (ignores time).
 *
 * @param date - Date to check (ISO string or Date)
 * @returns true if date is today, false otherwise
 *
 * @example
 * ```typescript
 * const now = new Date();
 * isToday(now); // true
 *
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * isToday(tomorrow); // false
 * ```
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Get relative time description
 *
 * Returns a human-readable description of how far in the future or past
 * a date is (e.g., "in 2 hours", "5 minutes ago", "tomorrow").
 *
 * @param date - Date to describe (ISO string or Date)
 * @returns Relative time description
 *
 * @example
 * ```typescript
 * const inTwoHours = new Date(Date.now() + 2 * 60 * 60 * 1000);
 * getRelativeTime(inTwoHours); // "in 2 hours"
 *
 * const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
 * getRelativeTime(fiveMinutesAgo); // "5 minutes ago"
 *
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * getRelativeTime(tomorrow); // "tomorrow"
 * ```
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  // Past
  if (diffMs < 0) {
    const absDiffMinutes = Math.abs(diffMinutes);
    const absDiffHours = Math.abs(diffHours);
    const absDiffDays = Math.abs(diffDays);

    if (absDiffMinutes < 1) return "just now";
    if (absDiffMinutes < 60)
      return `${absDiffMinutes} minute${absDiffMinutes > 1 ? "s" : ""} ago`;
    if (absDiffHours < 24)
      return `${absDiffHours} hour${absDiffHours > 1 ? "s" : ""} ago`;
    if (absDiffDays === 1) return "yesterday";
    if (absDiffDays < 7)
      return `${absDiffDays} day${absDiffDays > 1 ? "s" : ""} ago`;
    return formatDateForDisplay(dateObj);
  }

  // Future
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60)
    return `in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  if (diffDays === 1) return "tomorrow";
  if (diffDays < 7) return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  return formatDateForDisplay(dateObj);
}

/**
 * Parse time string to Date object
 *
 * Converts a time string (HH:MM format) to a Date object for today.
 * Useful for working with time slots from the availability API.
 *
 * @param timeString - Time in HH:MM format (e.g., "14:30")
 * @param baseDate - Optional base date (defaults to today)
 * @returns Date object with the specified time
 *
 * @example
 * ```typescript
 * parseTimeString("14:30"); // Today at 2:30 PM
 * parseTimeString("09:00"); // Today at 9:00 AM
 *
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * parseTimeString("14:30", tomorrow); // Tomorrow at 2:30 PM
 * ```
 */
export function parseTimeString(
  timeString: string,
  baseDate: Date = new Date()
): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Combine date and time into ISO datetime string
 *
 * Creates an ISO datetime string from separate date and time values.
 * Used when creating appointments from user selections.
 *
 * @param date - Date object or YYYY-MM-DD string
 * @param timeString - Time in HH:MM format
 * @returns ISO datetime string
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 11, 20);
 * combineDateAndTime(date, "14:30"); // "2024-12-20T14:30:00+05:30"
 *
 * combineDateAndTime("2024-12-20", "09:00"); // "2024-12-20T09:00:00+05:30"
 * ```
 */
export function combineDateAndTime(
  date: Date | string,
  timeString: string
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const [hours, minutes] = timeString.split(":").map(Number);

  dateObj.setHours(hours, minutes, 0, 0);

  return dateObj.toISOString();
}

/**
 * Get duration between two times in minutes
 *
 * Calculates the duration in minutes between two times.
 *
 * @param startTime - Start time (ISO string or Date)
 * @param endTime - End time (ISO string or Date)
 * @returns Duration in minutes
 *
 * @example
 * ```typescript
 * const start = new Date(2024, 11, 20, 14, 0);
 * const end = new Date(2024, 11, 20, 14, 30);
 * getDurationInMinutes(start, end); // 30
 * ```
 */
export function getDurationInMinutes(
  startTime: Date | string,
  endTime: Date | string
): number {
  const start = typeof startTime === "string" ? new Date(startTime) : startTime;
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;

  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (60 * 1000));
}

/**
 * Add minutes to a date
 *
 * Creates a new Date object with the specified minutes added.
 *
 * @param date - Base date (ISO string or Date)
 * @param minutes - Minutes to add (can be negative)
 * @returns New Date object
 *
 * @example
 * ```typescript
 * const now = new Date();
 * addMinutes(now, 30); // 30 minutes from now
 * addMinutes(now, -15); // 15 minutes ago
 * ```
 */
export function addMinutes(date: Date | string, minutes: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setMinutes(dateObj.getMinutes() + minutes);
  return dateObj;
}

/**
 * Check if two dates are on the same day
 *
 * Compares two dates to see if they fall on the same calendar day.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if dates are on the same day, false otherwise
 *
 * @example
 * ```typescript
 * const morning = new Date(2024, 11, 20, 9, 0);
 * const evening = new Date(2024, 11, 20, 18, 0);
 * isSameDay(morning, evening); // true
 *
 * const today = new Date();
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * isSameDay(today, tomorrow); // false
 * ```
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}
