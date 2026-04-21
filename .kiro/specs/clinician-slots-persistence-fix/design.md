# Clinician Slots Persistence Fix - Bugfix Design

## Overview

The admin panel's clinician edit modal allows administrators to create time slots using a calendar picker and time slider interface. However, when clicking "Update Clinician", these slots are not persisted to the database. The root cause is that the `updateClinician` API endpoint does not accept or process `availability_slots` data - it only handles clinician profile fields. The slots created in the modal are converted to an `AvailabilitySlot[]` format but never sent to the backend, and even if sent, the backend's `validateUpdateClinician` function would reject them as the `UpdateClinicianDto` interface doesn't include availability slots.

The fix requires either:

1. Adding availability slots support to the update endpoint, OR
2. Making a separate API call to the existing `/clinicians/:id/availability` endpoint after updating the clinician profile

Option 2 is preferred as it follows the existing separation of concerns where availability rules are managed through a dedicated endpoint.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when an admin creates time slots in the edit modal and clicks "Update Clinician"
- **Property (P)**: The desired behavior - slots should be persisted to the database via the availability API
- **Preservation**: Existing clinician profile update functionality that must remain unchanged
- **handleSubmit**: The function in `CliniciansPage.tsx` (line ~750) that handles form submission for creating/updating clinicians
- **convertSlotsToAPIFormat**: The function in `CliniciansPage.tsx` (line ~700) that converts calendar-based slots to `AvailabilitySlot[]` format
- **timeSlotsByDate**: State variable in `CliniciansPage.tsx` that stores the slots created via the calendar interface
- **updateClinician**: API method in `clinicianService.ts` that calls `PUT /users/clinicians/:id` - only updates profile fields
- **updateAvailability**: API method in `clinicianService.ts` that calls `PUT /users/clinicians/:id/availability` - updates availability rules
- **AvailabilitySlot**: Frontend type with fields: `id`, `dayOfWeek`, `startTime`, `endTime`, `consultationMode`
- **AvailabilityRule**: Backend type with fields: `centreId`, `dayOfWeek`, `startTime`, `endTime`, `slotDurationMinutes`, `mode`

## Bug Details

### Bug Condition

The bug manifests when an admin edits an existing clinician, creates time slots using the calendar picker and time slider, and clicks "Update Clinician". The `handleSubmit` function converts the slots to API format using `convertSlotsToAPIFormat()` but never sends them to the backend. The `updateClinician` service method only accepts profile fields defined in `UpdateClinicianRequest` interface, which excludes availability slots.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type { editingClinician: Clinician, timeSlotsByDate: Map<string, string[]>, action: "submit" }
  OUTPUT: boolean

  RETURN input.editingClinician !== null
         AND input.timeSlotsByDate.size > 0
         AND input.action === "submit"
         AND NOT availabilityAPICalledAfterUpdate(input)
END FUNCTION
```

### Examples

- **Example 1**: Admin opens edit modal for Dr. Smith, adds 3 time slots for Monday using calendar picker, clicks "Update Clinician" → Slots are not saved, modal closes, reopening shows no slots
- **Example 2**: Admin opens edit modal for Dr. Jones, adds slots for multiple dates (Mon, Wed, Fri), clicks "Update Clinician" → All slots disappear, database has no record of them
- **Example 3**: Admin creates new clinician with slots → Slots ARE saved (because `createClinician` handles `availability_slots` in the request body)
- **Edge Case**: Admin edits clinician without adding any slots → Update works correctly (no regression)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Updating clinician profile fields (name, specialization, fee, etc.) must continue to work exactly as before
- Creating new clinicians with availability slots must continue to work (already functional)
- The separate "Availability Schedule" management via `AvailabilityManager` component must continue to work
- All other admin panel clinician management features must remain unchanged

**Scope:**
All inputs that do NOT involve editing a clinician with time slots created via the calendar picker should be completely unaffected by this fix. This includes:

- Creating new clinicians (already works)
- Updating clinician profile without modifying slots
- Using the separate AvailabilityManager component for recurring availability rules
- Viewing clinician details and slot information

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Missing API Call**: The `handleSubmit` function in `CliniciansPage.tsx` (line ~750) converts calendar slots to API format using `convertSlotsToAPIFormat()` but never calls `clinicianService.updateAvailability()` to persist them

2. **Interface Mismatch**: The `UpdateClinicianRequest` interface in `clinicianService.ts` does not include an `availabilitySlots` field, and the backend's `UpdateClinicianDto` also excludes it

3. **Separate Endpoints**: The backend has two separate endpoints:
   - `PUT /users/clinicians/:id` - updates profile only (handled by `updateClinician`)
   - `PUT /users/clinicians/:id/availability` - updates availability rules (handled by `updateClinicianAvailability`)

4. **Create vs Update Discrepancy**: The `createClinician` function handles `availability_slots` in the request body and calls `updateClinicianAvailability` after creating the clinician, but the edit flow doesn't replicate this logic

## Correctness Properties

Property 1: Bug Condition - Slots Persist on Update

_For any_ clinician update where time slots are created via the calendar picker (timeSlotsByDate.size > 0), the fixed handleSubmit function SHALL convert the slots to availability rules format and call the updateAvailability API, causing the slots to be persisted to the database and visible upon modal reopening.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Profile Update Behavior

_For any_ clinician update that does NOT involve time slot modifications (timeSlotsByDate.size === 0), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing profile update functionality without making unnecessary availability API calls.

**Validates: Requirements 3.1, 3.2**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `mibo-admin/src/modules/staff/pages/CliniciansPage.tsx`

**Function**: `handleSubmit` (approximately line 750)

**Specific Changes**:

1. **Add Availability API Call After Profile Update**: After successfully calling `clinicianService.updateClinician()` for editing mode, check if `timeSlotsByDate.size > 0`, and if so, call `clinicianService.updateAvailability()` with the converted slots

2. **Convert Slots to Availability Rules Format**: The existing `convertSlotsToAPIFormat()` function returns `AvailabilitySlot[]` but the backend expects `AvailabilityRule[]` format. Need to transform:
   - `AvailabilitySlot.consultationMode` → `AvailabilityRule.mode`
   - Add `centreId` from `formData.primaryCentreId`
   - Add `slotDurationMinutes` from `sessionLength` state variable
   - Remove `id` field (not needed for backend)

3. **Error Handling**: Wrap the availability update call in try-catch to handle failures gracefully without breaking the profile update

4. **Success Message**: Update the success toast to indicate both profile and availability were updated when slots are present

5. **Loading State**: Ensure the `isCreating` loading state covers both API calls

**Pseudocode for Fix**:

```typescript
// In handleSubmit function, after updateClinician call:
if (editingClinician) {
  // Update existing clinician profile
  await clinicianService.updateClinician(editingClinician.id, {
    // ... existing profile fields
  });

  // NEW: Update availability if slots were added
  if (timeSlotsByDate.size > 0) {
    const availabilitySlots = convertSlotsToAPIFormat();
    const availabilityRules = availabilitySlots.map((slot) => ({
      centreId: formData.primaryCentreId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotDurationMinutes: sessionLength,
      mode: slot.consultationMode,
    }));

    await clinicianService.updateAvailability(
      editingClinician.id,
      availabilityRules,
    );
  }

  toast.success(
    timeSlotsByDate.size > 0
      ? "Clinician profile and availability updated successfully"
      : "Clinician updated successfully",
  );
}
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Manually test the admin panel edit flow on UNFIXED code to observe the bug, then inspect network requests to confirm no availability API call is made.

**Test Cases**:

1. **Edit with Single Slot**: Edit existing clinician, add 1 slot for Monday 9:00 AM, click Update → Observe network tab shows only profile update call, no availability call (will fail on unfixed code)
2. **Edit with Multiple Slots**: Edit existing clinician, add 5 slots across different dates, click Update → Observe slots disappear on modal reopen (will fail on unfixed code)
3. **Edit with Multiple Days**: Edit existing clinician, add slots for Mon/Wed/Fri, click Update → Observe database has no new availability rules (will fail on unfixed code)
4. **Create with Slots**: Create NEW clinician with slots → Observe this works correctly (should pass on unfixed code, confirming create flow is different)

**Expected Counterexamples**:

- Network tab shows only `PUT /users/clinicians/:id` call, no `PUT /users/clinicians/:id/availability` call
- Database query shows no new records in `clinician_availability_rules` table after update
- Possible causes: missing API call, incorrect data format, validation rejection

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**

```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleSubmit_fixed(input)
  ASSERT slotsPersistedToDatabase(result)
  ASSERT slotsVisibleOnModalReopen(result)
  ASSERT availabilityAPIWasCalled(result)
END FOR
```

**Test Plan**: After implementing the fix, test the same scenarios and verify:

1. Network tab shows both profile update AND availability update calls
2. Database contains the new availability rules
3. Reopening the modal shows the slots (via the existing slot retrieval logic)
4. Frontend booking page displays the slots for the clinician

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleSubmit_original(input) = handleSubmit_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Test various update scenarios WITHOUT slot modifications to ensure no regression.

**Test Cases**:

1. **Profile Update Only**: Edit clinician, change name/fee/specialization without touching slots → Verify update works exactly as before, no availability API call made
2. **Create New Clinician**: Create new clinician with slots → Verify this continues to work (already functional)
3. **Edit Without Slots**: Edit clinician without adding any slots → Verify profile updates correctly, no unnecessary API calls
4. **Toggle Active Status**: Toggle clinician active/inactive → Verify this continues to work independently

### Unit Tests

- Test `convertSlotsToAPIFormat()` function to ensure correct transformation from calendar slots to availability rules
- Test the new availability update logic in isolation with mock API calls
- Test error handling when availability update fails but profile update succeeds
- Test that no availability call is made when `timeSlotsByDate` is empty

### Property-Based Tests

- Generate random clinician profiles and verify updates work correctly with and without slots
- Generate random slot configurations (different dates, times, durations) and verify all are persisted
- Test that profile updates without slots never trigger availability API calls across many scenarios

### Integration Tests

- Test full edit flow: open modal → add slots → update → reopen modal → verify slots visible
- Test mixed updates: change profile fields AND add slots → verify both are saved
- Test error scenarios: network failure on availability update → verify appropriate error message
- Test that frontend booking page shows the newly created slots after update
