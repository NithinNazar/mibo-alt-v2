# Calendar Dates Clickability Bugfix Design

## Overview

The calendar dates in the booking page modal are not clickable, preventing users from selecting appointment dates. Analysis reveals the issue is likely in the date availability detection logic within the `CalendarMonthGrid` component. The calendar buttons are properly rendered but may be incorrectly marked as disabled due to faulty slot availability checking or date status calculation. This fix will ensure dates with available slots are properly clickable while preserving all existing functionality for non-calendar interactions.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when calendar dates with available slots are not clickable
- **Property (P)**: The desired behavior when calendar dates are clicked - dates should be selected and modal should close
- **Preservation**: Existing horizontal date strip behavior and time slot selection that must remain unchanged by the fix
- **CalendarMonthGrid**: The component in `Step1SessionDetails.tsx` that renders the calendar grid with clickable date buttons
- **datesWithSlots**: The API response data containing dates that have available appointment slots
- **handleChooseCalendarDay**: The function that handles date selection when calendar dates are clicked

## Bug Details

### Bug Condition

The bug manifests when a user clicks on calendar dates that should have available slots. The `CalendarMonthGrid` component is either incorrectly calculating the `disabled` state for date buttons, not properly detecting slot availability from the `datesWithSlots` data, or the `hasSlots` boolean is being set incorrectly.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type { date: Date, datesWithSlots: Array, userClick: MouseEvent }
  OUTPUT: boolean

  RETURN input.date IS_VALID_FUTURE_DATE
         AND input.date EXISTS_IN datesWithSlots
         AND input.userClick.target IS calendar_date_button
         AND NOT dateSelectionTriggered(input.date)
END FUNCTION
```

### Examples

- **Calendar Modal Date Click**: User opens calendar modal, sees dates with green dots (indicating slots), clicks on a date → nothing happens, date not selected
- **Available Date Not Clickable**: User clicks on tomorrow's date which shows a green availability dot → click event doesn't register, modal stays open
- **Slot Availability Mismatch**: API returns dates with slots, but calendar marks them as disabled → buttons appear clickable but are functionally disabled
- **Edge Case - Today's Date**: User clicks on today's date when it has available slots → expected behavior is date selection and modal closure

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Horizontal date strip selection must continue to work exactly as before
- Time slot selection after choosing a date must remain unchanged
- Calendar month navigation (previous/next buttons) must remain unchanged
- Calendar modal opening and closing behavior must remain unchanged

**Scope:**
All inputs that do NOT involve clicking calendar date buttons should be completely unaffected by this fix. This includes:

- Clicking dates in the horizontal date strip
- Selecting time slots from the dropdown/list
- Calendar modal backdrop clicks to close
- Month navigation arrows in calendar header

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Incorrect Slot Detection Logic**: The `hasSlots` calculation may be using wrong date format or key matching
   - `slotsMap.has(key)` might be failing due to date format mismatch between API response and `toISODateKey(date)`
   - API returns dates in one format but calendar expects another format

2. **Disabled State Calculation Error**: The `disabled` boolean logic may be incorrectly marking available dates as disabled
   - `const disabled = !hasSlots || isPast;` might be evaluating to true when it should be false
   - Past date detection logic might be incorrectly flagging future dates as past

3. **Event Handler Binding Issues**: The `onClick={() => onPick(date, status)}` may not be properly bound or called
   - Arrow function might not be preserving correct context
   - `onPick` prop might not be receiving correct parameters

4. **API Data Format Issues**: The `datesWithSlots` array structure might not match expected format
   - Date strings in API response might include timezone information causing key mismatch
   - Slot count might be zero even when dates are returned, causing `hasSlots` to be false

## Correctness Properties

Property 1: Bug Condition - Calendar Date Selection

_For any_ calendar date click where the date has available slots (exists in datesWithSlots) and is not in the past, the fixed CalendarMonthGrid component SHALL select that date, update the selectedDate state, and close the calendar modal.

**Validates: Requirements 2.1, 2.2, 2.4**

Property 2: Preservation - Non-Calendar Date Selection

_For any_ date selection that does NOT use the calendar modal (horizontal date strip clicks, direct date input), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing date selection functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx`

**Function**: `CalendarMonthGrid`

**Specific Changes**:

1. **Fix Date Key Matching**: Ensure `toISODateKey(date)` format matches the date format in `datesWithSlots` array
   - Add logging to compare key formats between API response and calendar generation
   - Normalize date formats to ensure consistent key matching

2. **Fix Slot Detection Logic**: Correct the `hasSlots` boolean calculation
   - Verify `slotsMap.has(key)` is working correctly with proper date keys
   - Add fallback logic to handle edge cases in date format conversion

3. **Fix Disabled State Logic**: Ensure available dates are not incorrectly marked as disabled
   - Review `const disabled = !hasSlots || isPast;` calculation
   - Improve past date detection to handle timezone and date boundary issues

4. **Add Debug Logging**: Include console logging to help identify the exact failure point
   - Log `datesWithSlots` data structure and format
   - Log calculated `hasSlots` and `disabled` values for each date

5. **Improve Error Handling**: Add safeguards for malformed API data
   - Handle cases where `datesWithSlots` is empty or malformed
   - Provide fallback behavior when slot data is unavailable

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate calendar date clicks with mock `datesWithSlots` data and assert that the `handleChooseCalendarDay` function is invoked. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:

1. **Available Date Click Test**: Simulate clicking on a date that exists in `datesWithSlots` (will fail on unfixed code)
2. **Future Date with Slots Test**: Simulate clicking on tomorrow's date with available slots (will fail on unfixed code)
3. **Multiple Dates Test**: Simulate clicking on various dates across different months (will fail on unfixed code)
4. **Edge Case - Today Test**: Simulate clicking on today's date when it has slots (may fail on unfixed code)

**Expected Counterexamples**:

- Calendar date buttons do not trigger `handleChooseCalendarDay` when clicked
- Possible causes: incorrect disabled state, wrong date key format, broken event binding

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**

```
FOR ALL input WHERE isBugCondition(input) DO
  result := CalendarMonthGrid_fixed(input)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT CalendarMonthGrid_original(input) = CalendarMonthGrid_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-calendar interactions

**Test Plan**: Observe behavior on UNFIXED code first for horizontal date strip and time slot selection, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Horizontal Date Strip Preservation**: Observe that clicking dates in the horizontal strip works correctly on unfixed code, then write test to verify this continues after fix
2. **Time Slot Selection Preservation**: Observe that time slot selection works correctly on unfixed code, then write test to verify this continues after fix
3. **Calendar Navigation Preservation**: Observe that month navigation works correctly on unfixed code, then write test to verify this continues after fix
4. **Modal Behavior Preservation**: Observe that modal open/close behavior works correctly on unfixed code, then write test to verify this continues after fix

### Unit Tests

- Test calendar date button rendering with various `datesWithSlots` configurations
- Test disabled state calculation for past dates, future dates, and dates without slots
- Test that `handleChooseCalendarDay` is called with correct parameters when dates are clicked

### Property-Based Tests

- Generate random `datesWithSlots` arrays and verify calendar dates are clickable when they should be
- Generate random date configurations and verify preservation of horizontal date strip behavior
- Test that all non-calendar date selection methods continue to work across many scenarios

### Integration Tests

- Test full booking flow with calendar date selection in various months
- Test switching between calendar and horizontal date strip selection methods
- Test that visual feedback (date highlighting, modal closure) occurs when calendar dates are clicked
