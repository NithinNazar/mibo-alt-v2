# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Default Session Duration Display Bug
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that for clinicians with configured default session durations, the booking page displays the hardcoded fallback (50 minutes) instead of the configured duration
  - Test implementation: Configure clinician with 45-minute default duration in admin panel, then verify booking page API response shows hardcoded 50 minutes instead of 45
  - The test assertions should match the Expected Behavior Properties from design: booking page SHALL display the exact configured duration
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "API response missing defaultDurationMinutes field", "booking page shows 50 instead of configured 45")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Duration Booking Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (all booking operations that don't involve default duration display)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test cases: clinician info display (name, specialization, fee), booking flow (date/time selection, payment), admin panel operations
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix for default session duration fetching bug
  - [x] 3.1 Verify database schema and add missing field if needed
    - Check if `default_consultation_duration_minutes` field exists in `clinician_profiles` table
    - Create migration to add field if missing
    - Ensure proper default value handling (50 minutes for unconfigured clinicians)
    - _Bug_Condition: isBugCondition(input) where input.bookingPageLoad = true AND clinicianHasConfiguredDuration(input.clinicianId) = true AND displayedDuration != configuredDuration(input.clinicianId)_
    - _Expected_Behavior: booking page SHALL display exact configured duration from admin panel_
    - _Preservation: All other clinician information display and booking flow functionality must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Update backend repository queries
    - Modify `StaffRepository.findClinicians()` and `StaffRepository.findClinicianById()` methods
    - Ensure SQL queries explicitly select `default_consultation_duration_minutes` field
    - Verify `transformClinicianResponse()` function properly maps database field to `defaultDurationMinutes`
    - Add proper null/default value handling for clinicians without configured duration
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: API endpoints SHALL return defaultDurationMinutes field with correct configured value_
    - _Preservation: All other API endpoint functionality and data structure must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.3 Update frontend to use API-provided duration
    - Modify `Step1SessionDetails` component to use `defaultDurationMinutes` from API response
    - Remove hardcoded fallback logic and rely on backend-provided value
    - Ensure proper error handling if field is missing
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: booking page SHALL display the correct default session duration as configured for that specific clinician_
    - _Preservation: All other booking page functionality (mode selection, date/time picking, pricing display) must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Default Session Duration Display Bug
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties from design_

  - [ ] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Duration Booking Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
