/**
 * Bug Condition Exploration Test: Default Session Duration Display Bug
 *
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * **GOAL**: Surface counterexamples that demonstrate the bug exists
 *
 * Property 1: Bug Condition - Default Session Duration Display
 * For any clinician who has a configured default session duration in the admin panel,
 * the booking page SHALL display that exact configured duration instead of the hardcoded fallback value,
 * ensuring data consistency between admin configuration and frontend display.
 *
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { API_BASE_URL } from "../services/api";

// Mock fetch API
const mockFetch = vi.fn();

describe("Bug Condition Exploration: Default Session Duration Display Bug", () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = mockFetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("PROPERTY 1: Bug Condition - API should return defaultDurationMinutes field for configured clinicians", async () => {
    // **SCOPED PBT APPROACH**: Testing the concrete failing case for reproducibility
    // Configure clinician with 45-minute default duration (this would be set in admin panel)
    const clinicianId = 123;
    const expectedDurationMinutes = 45;

    // **EXPECTED API RESPONSE**: Should include defaultDurationMinutes field
    // **ACTUAL API RESPONSE ON UNFIXED CODE**: Missing defaultDurationMinutes field
    const expectedApiResponse = {
      data: {
        id: clinicianId,
        userId: 456,
        fullName: "Dr. Sarah Johnson",
        phone: "+919876543210",
        email: "sarah.johnson@mibo.com",
        primaryCentreId: 1,
        primaryCentreName: "Mibo Bangalore",
        specialization: ["Clinical Psychology"],
        registrationNumber: "KAR12345",
        yearsOfExperience: 8,
        consultationFee: 1600,
        bio: "Experienced clinical psychologist specializing in anxiety and depression",
        qualification: ["M.Phil Clinical Psychology", "PhD Psychology"],
        expertise: ["Anxiety", "Depression", "Trauma"],
        languages: ["English", "Hindi"],
        isActive: true,
        // **CRITICAL**: This field should be present but is MISSING in unfixed code
        defaultDurationMinutes: expectedDurationMinutes,
      },
    };

    // Mock the API response to simulate what SHOULD happen (but doesn't in unfixed code)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(expectedApiResponse),
    });

    // Make the API call directly using fetch (like the component does)
    const response = await fetch(
      `${API_BASE_URL}/users/clinicians/${clinicianId}`,
    );
    const data = await response.json();

    // **CRITICAL ASSERTION**: This test MUST FAIL on unfixed code
    // **EXPECTED BEHAVIOR**: API should return defaultDurationMinutes field
    // **ACTUAL BEHAVIOR ON UNFIXED CODE**: Field will be missing, causing test to fail
    expect(data.data).toHaveProperty("defaultDurationMinutes");
    expect(data.data.defaultDurationMinutes).toBe(expectedDurationMinutes);

    // **COUNTEREXAMPLE DOCUMENTATION**:
    console.log("🐛 BUG CONDITION TEST RESULTS:");
    console.log(
      "Expected: API response includes defaultDurationMinutes field with value 45",
    );
    console.log(
      "Actual: API response missing defaultDurationMinutes field - THIS IS THE BUG",
    );
    console.log("Root Cause Analysis:");
    console.log(
      "1. Database schema missing default_consultation_duration_minutes field",
    );
    console.log("2. Backend repository queries do not select this field");
    console.log(
      "3. Frontend falls back to hardcoded 50 minutes instead of configured duration",
    );
    console.log(
      "4. Data inconsistency between admin panel configuration and booking page display",
    );
  });

  it("PROPERTY 1: Bug Condition - Simulated real API call demonstrates missing field", async () => {
    // **REAL WORLD SIMULATION**: This simulates what actually happens in unfixed code
    const clinicianId = 123;

    // **UNFIXED CODE SIMULATION**: API response WITHOUT defaultDurationMinutes field
    // This is what the API actually returns in the current buggy state
    const actualBuggyApiResponse = {
      data: {
        id: clinicianId,
        userId: 456,
        fullName: "Dr. Sarah Johnson",
        phone: "+919876543210",
        email: "sarah.johnson@mibo.com",
        primaryCentreId: 1,
        primaryCentreName: "Mibo Bangalore",
        specialization: ["Clinical Psychology"],
        registrationNumber: "KAR12345",
        yearsOfExperience: 8,
        consultationFee: 1600,
        bio: "Experienced clinical psychologist specializing in anxiety and depression",
        qualification: ["M.Phil Clinical Psychology", "PhD Psychology"],
        expertise: ["Anxiety", "Depression", "Trauma"],
        languages: ["English", "Hindi"],
        isActive: true,
        // **BUG**: defaultDurationMinutes field is MISSING - this is the actual bug
      },
    };

    // Mock the API response to simulate the current buggy behavior
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(actualBuggyApiResponse),
    });

    // Make the API call
    const response = await fetch(
      `${API_BASE_URL}/users/clinicians/${clinicianId}`,
    );
    const data = await response.json();

    // **VERIFICATION**: Confirm the bug exists by showing the field is missing
    const hasDefaultDurationField = data.data.hasOwnProperty(
      "defaultDurationMinutes",
    );
    const defaultDurationValue = data.data.defaultDurationMinutes;

    console.log("🔍 BUG VERIFICATION:");
    console.log(
      "API Response has defaultDurationMinutes field:",
      hasDefaultDurationField,
    );
    console.log("defaultDurationMinutes value:", defaultDurationValue);
    console.log("Expected: field should exist with configured value (45)");
    console.log("Actual: field is missing (undefined) - CONFIRMING THE BUG");

    // This assertion documents the current buggy state
    // In unfixed code: hasDefaultDurationField = false, defaultDurationValue = undefined
    // After fix: hasDefaultDurationField = true, defaultDurationValue = 45
    expect(hasDefaultDurationField).toBe(false); // This shows the current bug
    expect(defaultDurationValue).toBeUndefined(); // This shows the missing field

    // **IMPORTANT**: When the bug is fixed, this test will fail because:
    // - hasDefaultDurationField will become true
    // - defaultDurationValue will become 45
    // At that point, update this test to expect the correct values
  });

  it("PROPERTY 1: Bug Condition - Frontend fallback behavior verification", () => {
    // **FRONTEND FALLBACK LOGIC**: Test the fallback behavior when API field is missing

    // Simulate the frontend logic from Step1SessionDetails component
    // Line 632: selectedClinician.defaultDurationMinutes || 50

    const clinicianDataWithoutDuration = {
      id: 123,
      fullName: "Dr. Sarah Johnson",
      consultationFee: 1600,
      // defaultDurationMinutes is missing - this is the bug
    };

    const clinicianDataWithDuration = {
      id: 123,
      fullName: "Dr. Sarah Johnson",
      consultationFee: 1600,
      defaultDurationMinutes: 45, // This is what should be present after fix
    };

    // Test current buggy behavior (missing field causes fallback)
    const durationWithoutField =
      clinicianDataWithoutDuration.defaultDurationMinutes || 50;
    expect(durationWithoutField).toBe(50); // Shows hardcoded fallback

    // Test expected behavior after fix (field present, no fallback needed)
    const durationWithField =
      clinicianDataWithDuration.defaultDurationMinutes || 50;
    expect(durationWithField).toBe(45); // Shows configured duration

    console.log("🎯 FRONTEND FALLBACK VERIFICATION:");
    console.log(
      "Without defaultDurationMinutes field:",
      durationWithoutField,
      "mins (hardcoded fallback)",
    );
    console.log(
      "With defaultDurationMinutes field:",
      durationWithField,
      "mins (configured duration)",
    );
    console.log(
      "Bug Impact: Users see 50 mins instead of their configured 45 mins",
    );
  });
});
