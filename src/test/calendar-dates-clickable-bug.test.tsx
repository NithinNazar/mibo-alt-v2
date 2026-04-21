/**
 * Bug Condition Exploration Test: Calendar Dates Clickability Bug
 *
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * **GOAL**: Surface counterexamples that demonstrate the bug exists
 *
 * **Validates: Requirements 1.2, 1.3, 1.4**
 *
 * Property 1: Bug Condition - Calendar Date Selection Failure
 * For any calendar date with available slots that is clicked in the calendar modal,
 * the system SHALL trigger handleChooseCalendarDay function, select that date, and close the modal,
 * ensuring users can successfully book appointments through the calendar interface.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Step1SessionDetails from "../pages/BookAppointment/Step1SessionDetails";

// Mock the API
const mockFetch = vi.fn();

// Mock doctor data for testing
const mockDoctor = {
  id: "123",
  name: "Dr. Sarah Johnson",
  designation: "Clinical Psychologist",
  experience: "8 years",
  location: "Bangalore",
  rating: 4.8,
  reviews: 156,
  image: "/doctor-placeholder.jpg",
  languages: ["English", "Hindi"],
  expertise: ["Anxiety", "Depression"],
  about: "Experienced clinical psychologist",
};

// Mock booking data
const mockBookingData = {
  mode: "In-person",
  date: null,
  time: "",
  duration: 50,
};

// Mock functions
const mockSetBookingData = vi.fn();
const mockOnContinue = vi.fn();
const mockOnBack = vi.fn();

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Bug Condition Exploration: Calendar Dates Clickability Bug", () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = mockFetch;
    vi.clearAllMocks();

    // Mock successful API responses for clinician and centre data
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              id: 123,
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
              bio: "Experienced clinical psychologist",
              qualification: ["M.Phil Clinical Psychology"],
              expertise: ["Anxiety", "Depression"],
              languages: ["English", "Hindi"],
              isActive: true,
              defaultDurationMinutes: 50,
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              id: 1,
              name: "Mibo Bangalore",
              city: "bangalore",
              address_line_1: "Bangalore Centre",
              address_line_2: null,
              pincode: "560001",
              contact_phone: "+919876543210",
              is_active: true,
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                date: "2024-12-20",
                slotCount: 3,
              },
              {
                date: "2024-12-21",
                slotCount: 2,
              },
              {
                date: "2024-12-22",
                slotCount: 4,
              },
            ],
          }),
      })
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("PROPERTY 1: Bug Condition - Calendar date clicks should trigger handleChooseCalendarDay and close modal", async () => {
    // **SCOPED PBT APPROACH**: Testing concrete failing case - calendar dates with available slots

    // Render the component
    render(
      <TestWrapper>
        <Step1SessionDetails
          doctor={mockDoctor}
          bookingData={mockBookingData}
          setBookingData={mockSetBookingData}
          onContinue={mockOnContinue}
          onBack={mockOnBack}
        />
      </TestWrapper>,
    );

    // Wait for component to load and API calls to complete
    await waitFor(() => {
      expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
    });

    // **STEP 1**: Open the calendar modal by clicking the calendar button
    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    expect(calendarButton).toBeInTheDocument();

    fireEvent.click(calendarButton);

    // **STEP 2**: Verify calendar modal is open
    await waitFor(() => {
      expect(screen.getByText(/select date/i)).toBeInTheDocument();
    });

    // **STEP 3**: Find a calendar date button with available slots (should have a dot indicator)
    // Look for date buttons that are not disabled and have the slot indicator
    const dateButtons = screen.getAllByRole("button").filter((button) => {
      const buttonText = button.textContent;
      // Look for numeric date buttons (1-31) that are not disabled
      return /^\d+$/.test(buttonText || "") && !button.disabled;
    });

    expect(dateButtons.length).toBeGreaterThan(0);

    // Find a date button with available slots (should have the slot indicator dot)
    const availableDateButton = dateButtons.find((button) => {
      // Check if button has the slot indicator (span with rounded-full class)
      const slotIndicator = button.querySelector("span.rounded-full");
      return slotIndicator !== null;
    });

    expect(availableDateButton).toBeTruthy();

    // **STEP 4**: Click on the available date button
    // **CRITICAL**: This is where the bug manifests - the click should work but doesn't
    fireEvent.click(availableDateButton!);

    // **STEP 5**: Verify the expected behavior after clicking
    // **EXPECTED BEHAVIOR**:
    // 1. handleChooseCalendarDay should be called
    // 2. Selected date should be updated
    // 3. Calendar modal should close
    // 4. setBookingData should be called with the new date

    await waitFor(
      () => {
        // **ASSERTION 1**: Calendar modal should close after date selection
        // **BUG**: Modal remains open because click handler doesn't work
        expect(screen.queryByText(/select date/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // **ASSERTION 2**: setBookingData should be called with the selected date
    // **BUG**: Function is not called because click handler doesn't trigger
    expect(mockSetBookingData).toHaveBeenCalled();

    // **COUNTEREXAMPLE DOCUMENTATION**:
    console.log("🐛 BUG CONDITION TEST RESULTS:");
    console.log(
      "Expected: Calendar date click triggers selection and closes modal",
    );
    console.log("Actual: Calendar date click does nothing - THIS IS THE BUG");
    console.log("Root Cause Analysis:");
    console.log(
      "1. Calendar date buttons appear clickable but onClick handler may not be properly wired",
    );
    console.log(
      "2. handleChooseCalendarDay function exists but may not be called on button click",
    );
    console.log(
      "3. Modal remains open instead of closing after date selection",
    );
    console.log(
      "4. Date selection state is not updated, preventing appointment booking",
    );
  });

  it("PROPERTY 1: Bug Condition - Verify handleChooseCalendarDay function behavior", async () => {
    // **DIRECT FUNCTION TESTING**: Test the handleChooseCalendarDay function directly

    render(
      <TestWrapper>
        <Step1SessionDetails
          doctor={mockDoctor}
          bookingData={mockBookingData}
          setBookingData={mockSetBookingData}
          onContinue={mockOnContinue}
          onBack={mockOnBack}
        />
      </TestWrapper>,
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
    });

    // Open calendar modal
    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    fireEvent.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByText(/select date/i)).toBeInTheDocument();
    });

    // **VERIFICATION**: Check if calendar dates are properly rendered with click handlers
    const calendarGrid =
      screen.getByRole("grid") || screen.querySelector(".grid-cols-7");
    expect(calendarGrid).toBeInTheDocument();

    // Find date buttons within the calendar grid
    const dateButtonsInGrid = calendarGrid?.querySelectorAll("button") || [];

    console.log("🔍 CALENDAR GRID ANALYSIS:");
    console.log("Total date buttons found:", dateButtonsInGrid.length);

    // Check if buttons have proper onClick handlers
    let buttonsWithHandlers = 0;
    let enabledButtons = 0;

    dateButtonsInGrid.forEach((button, index) => {
      const isDisabled = button.disabled;
      const hasClickHandler =
        button.onclick !== null || button.getAttribute("onclick") !== null;

      if (!isDisabled) enabledButtons++;
      if (hasClickHandler) buttonsWithHandlers++;

      console.log(
        `Button ${index}: text="${button.textContent}", disabled=${isDisabled}, hasHandler=${hasClickHandler}`,
      );
    });

    console.log("Enabled buttons:", enabledButtons);
    console.log("Buttons with click handlers:", buttonsWithHandlers);

    // **BUG VERIFICATION**: In unfixed code, buttons may not have proper click handlers
    // or the handlers may not be working correctly
    expect(enabledButtons).toBeGreaterThan(0);

    // **CRITICAL ASSERTION**: This will likely fail in unfixed code
    // because the click handlers are not properly connected or working
    if (enabledButtons > 0) {
      const firstEnabledButton = Array.from(dateButtonsInGrid).find(
        (btn) => !btn.disabled,
      );
      if (firstEnabledButton) {
        // Simulate click and verify it triggers the expected behavior
        const initialModalState = screen.queryByText(/select date/i);
        expect(initialModalState).toBeInTheDocument();

        fireEvent.click(firstEnabledButton);

        // **BUG**: Modal should close but doesn't in unfixed code
        await waitFor(
          () => {
            expect(screen.queryByText(/select date/i)).not.toBeInTheDocument();
          },
          { timeout: 1000 },
        );
      }
    }
  });

  it("PROPERTY 1: Bug Condition - Calendar date interaction with available slots", async () => {
    // **SLOT-SPECIFIC TESTING**: Focus on dates that have available slots

    render(
      <TestWrapper>
        <Step1SessionDetails
          doctor={mockDoctor}
          bookingData={mockBookingData}
          setBookingData={mockSetBookingData}
          onContinue={mockOnContinue}
          onBack={mockOnBack}
        />
      </TestWrapper>,
    );

    // Wait for component and API data to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
    });

    // Open calendar modal
    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    fireEvent.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByText(/select date/i)).toBeInTheDocument();
    });

    // **FOCUS ON DATES WITH SLOTS**: Look for buttons with slot indicators
    const buttonsWithSlots = screen.getAllByRole("button").filter((button) => {
      // Check for the slot indicator dot (span with specific styling)
      const slotDot = button.querySelector("span.rounded-full");
      return slotDot && !button.disabled;
    });

    console.log("🎯 SLOT AVAILABILITY ANALYSIS:");
    console.log("Buttons with slot indicators found:", buttonsWithSlots.length);

    if (buttonsWithSlots.length > 0) {
      const buttonWithSlots = buttonsWithSlots[0];
      const dateText = buttonWithSlots.textContent?.match(/\d+/)?.[0];

      console.log("Testing date button:", dateText);
      console.log("Button disabled:", buttonWithSlots.disabled);
      console.log(
        "Has slot indicator:",
        !!buttonWithSlots.querySelector("span.rounded-full"),
      );

      // **CRITICAL TEST**: Click on date with available slots
      fireEvent.click(buttonWithSlots);

      // **EXPECTED OUTCOMES**:
      // 1. Modal should close
      // 2. Date should be selected
      // 3. Time selection should be enabled
      // 4. Booking data should be updated

      await waitFor(
        () => {
          // **BUG ASSERTION**: Modal should close but doesn't in unfixed code
          expect(screen.queryByText(/select date/i)).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // **ADDITIONAL VERIFICATION**: Check if date selection triggered other UI updates
      expect(mockSetBookingData).toHaveBeenCalled();

      console.log("✅ Expected: Date selection closes modal and updates state");
      console.log(
        "❌ Actual (Bug): Date click has no effect - modal stays open",
      );
    } else {
      console.log(
        "⚠️  No buttons with slot indicators found - may indicate data loading issue",
      );
      // This could also be part of the bug - slots not being properly displayed
    }
  });
});
