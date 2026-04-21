# Default Session Duration Fetch Fix Design

## Overview

This design addresses a bug where the default session duration configured for clinicians in the admin panel is not being properly fetched and displayed on the frontend booking page. The issue stems from a missing database field in the backend API queries, causing the frontend to fall back to hardcoded default values instead of using the clinician-specific configuration.

The fix involves adding the missing `default_consultation_duration_minutes` field to the database queries in the backend API endpoints that serve clinician data to the frontend booking system.

## Glossary

- **Bug_Condition (C)**: The condition where a user navigates to the booking page for a clinician who has a configured default session duration in the admin panel, but the booking page displays a hardcoded default (50 minutes) instead of the clinician's actual configured duration
- **Property (P)**: The desired behavior where the booking page displays the correct default session duration as configured for that specific clinician in the admin panel
- **Preservation**: Existing functionality that must remain unchanged, including all other clinician data display, booking flow functionality, and admin panel operations
- **defaultDurationMinutes**: The frontend property that should contain the clinician's configured default session duration
- **default_consultation_duration_minutes**: The database field that stores the clinician's default session duration configuration

## Bug Details

### Bug Condition

The bug manifests when users navigate to the booking page (`/book-appointment/:doctorId`) for any clinician. The `Step1SessionDetails` component fetches clinician data via the `/users/clinicians/:id` API endpoint, but the returned data does not include the `defaultDurationMinutes` field, causing the frontend to display a hardcoded fallback value of 50 minutes instead of the clinician's actual configured default session duration.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type { clinicianId: number, bookingPageLoad: boolean }
  OUTPUT: boolean

  RETURN input.bookingPageLoad = true
         AND clinicianHasConfiguredDuration(input.clinicianId) = true
         AND displayedDuration != configuredDuration(input.clinicianId)
END FUNCTION
```

### Examples

- **Example 1**: Dr. Smith has a configured default session duration of 45 minutes in the admin panel, but the booking page shows "50 mins, 1 session" instead of "45 mins, 1 session"
- **Example 2**: Dr. Johnson has a configured default session duration of 60 minutes in the admin panel, but the booking page shows "50 mins, 1 session" instead of "60 mins, 1 session"
- **Example 3**: Dr. Patel has a configured default session duration of 30 minutes in the admin panel, but the booking page shows "50 mins, 1 session" instead of "30 mins, 1 session"
- **Edge Case**: New clinician with no configured duration should display the system default (50 minutes)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- All other clinician information display (name, specialization, experience, consultation fee, etc.) must continue to work exactly as before
- The booking flow functionality (date/time selection, payment processing, appointment creation) must remain unchanged
- Admin panel clinician management and configuration must continue to work exactly as before
- API endpoints for other clinician operations (create, update, availability management) must remain unchanged

**Scope:**
All functionality that does NOT involve displaying the default session duration on the booking page should be completely unaffected by this fix. This includes:

- Clinician listing and filtering on the experts page
- Admin panel CRUD operations for clinicians
- Appointment scheduling and management
- Other booking page elements (mode selection, date/time picking, pricing display)

## Hypothesized Root Cause

Based on the code analysis, the most likely issues are:

1. **Missing Database Field Selection**: The SQL queries in `StaffRepository.findClinicians()` and `StaffRepository.findClinicianById()` use `cp.*` to select all fields from the `clinician_profiles` table, but the `default_consultation_duration_minutes` field may not exist in the database schema or is not being properly selected.

2. **Database Schema Gap**: The `default_consultation_duration_minutes` field may not have been added to the `clinician_profiles` table during database migrations, even though the admin panel form includes this field.

3. **Field Mapping Issue**: The `transformClinicianResponse()` function correctly maps `default_consultation_duration_minutes` to `defaultDurationMinutes`, but if the database field doesn't exist or isn't selected, the transformation has no data to work with.

4. **API Response Structure**: The frontend expects `defaultDurationMinutes` in the clinician object, but the backend API is not providing this field due to the missing database column or query selection.

## Correctness Properties

Property 1: Bug Condition - Default Session Duration Display

_For any_ clinician who has a configured default session duration in the admin panel, the booking page SHALL display that exact configured duration instead of the hardcoded fallback value, ensuring data consistency between admin configuration and frontend display.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Non-Duration Booking Functionality

_For any_ booking page interaction that does NOT involve the default session duration display (mode selection, date/time picking, clinician info display, payment processing), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing booking flow functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `backend/src/repositories/staff.repository.ts`

**Function**: `findClinicians` and `findClinicianById`

**Specific Changes**:

1. **Database Schema Verification**: Verify that the `default_consultation_duration_minutes` field exists in the `clinician_profiles` table. If not, create a migration to add it.

2. **Query Field Selection**: Ensure the SQL queries explicitly select the `default_consultation_duration_minutes` field or verify that `cp.*` includes this field.

3. **Default Value Handling**: Add proper default value handling for clinicians who don't have a configured duration (should default to 50 minutes).

4. **API Response Validation**: Ensure the `transformClinicianResponse()` function receives the database field and properly maps it to `defaultDurationMinutes`.

5. **Frontend Fallback Logic**: Update the frontend to use the API-provided `defaultDurationMinutes` value instead of the hardcoded fallback.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create test scenarios that configure different default session durations for clinicians in the admin panel, then navigate to their booking pages to verify the displayed duration. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:

1. **Admin Panel Configuration Test**: Configure a clinician with 45-minute default duration in admin panel (will succeed on unfixed code)
2. **Booking Page Display Test**: Navigate to that clinician's booking page and verify duration display (will fail on unfixed code - shows 50 instead of 45)
3. **API Response Test**: Call `/users/clinicians/:id` endpoint and verify `defaultDurationMinutes` field presence (will fail on unfixed code - field missing)
4. **Database Query Test**: Query the database directly to verify the field exists and has the correct value (may fail on unfixed code)

**Expected Counterexamples**:

- Booking page displays hardcoded 50 minutes instead of configured duration
- API response missing `defaultDurationMinutes` field
- Possible causes: missing database field, incorrect query selection, transformation issues

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**

```
FOR ALL clinician WHERE hasConfiguredDuration(clinician) DO
  bookingPageData := fetchBookingPageData(clinician.id)
  ASSERT bookingPageData.defaultDurationMinutes = clinician.configuredDuration
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL bookingOperation WHERE NOT involvesDefaultDuration(bookingOperation) DO
  ASSERT originalBookingFlow(bookingOperation) = fixedBookingFlow(bookingOperation)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for all non-duration booking operations, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Clinician Info Display Preservation**: Verify all other clinician information (name, specialization, fee, etc.) displays correctly after fix
2. **Booking Flow Preservation**: Verify date/time selection, mode selection, and payment flow continue working exactly as before
3. **Admin Panel Preservation**: Verify admin panel clinician management continues working correctly
4. **API Endpoint Preservation**: Verify other clinician API endpoints return the same data structure

### Unit Tests

- Test database query modifications to ensure `default_consultation_duration_minutes` is properly selected
- Test `transformClinicianResponse()` function with and without the duration field
- Test frontend component rendering with different duration values
- Test edge cases (null duration, invalid duration values)

### Property-Based Tests

- Generate random clinician configurations and verify booking page displays correct duration
- Generate random booking flow interactions and verify preservation of non-duration functionality
- Test that all clinician data transformations preserve existing field mappings

### Integration Tests

- Test full flow from admin panel configuration to booking page display
- Test API endpoint responses include correct duration data
- Test that database migrations properly add the missing field if needed
