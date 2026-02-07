# Design Document: Dynamic Clinician Management System

## Overview

This design transforms the clinician management system from a static file-based approach to a fully dynamic database-driven system. The transformation involves three main components:

1. **Admin Panel Enhancement**: Extend the existing CliniciansPage with new fields (specialization dropdown, qualification dropdown, availability schedule, profile picture upload)
2. **Backend API Updates**: Modify existing clinician endpoints to support new fields and validation
3. **Frontend Integration**: Update the ExpertsPage to query the database instead of reading static files

The system maintains backward compatibility during the transition by falling back to static data when the database is empty or unavailable.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Panel (React)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CliniciansPage.tsx                                     │ │
│  │  - Specialization Dropdown                              │ │
│  │  - Qualification Dropdown (MultiSelect)                 │ │
│  │  - Availability Schedule Builder                        │ │
│  │  - Profile Picture Upload                               │ │
│  │  - Credential Display                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Staff Controller                                       │ │
│  │  - createClinician()                                    │ │
│  │  - updateClinician()                                    │ │
│  │  - getClinicians()                                      │ │
│  │  - updateClinicianAvailability()                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Staff Service                                          │ │
│  │  - Validation                                           │ │
│  │  - Business Logic                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Staff Repository                                       │ │
│  │  - Database Queries                                     │ │
│  │  - Data Transformation                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PostgreSQL
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Database                              │
│  - users                                                     │
│  - staff_profiles                                            │
│  - clinician_profiles                                        │
│  - clinician_availability_rules                              │
│  - centres                                                   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Query
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Frontend Website (React)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ExpertsPage.tsx                                        │ │
│  │  - Fetch from API (primary)                             │ │
│  │  - Fallback to static files                             │ │
│  │  - Filter by location, specialization, mode             │ │
│  │  - Display clinician cards                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin Creates Clinician**:
   - Admin fills form in CliniciansPage
   - Form data sent to POST /api/clinicians
   - Backend validates and creates user + clinician profile
   - Returns created clinician with credentials

2. **Patient Views Clinicians**:
   - ExpertsPage loads
   - Calls GET /api/clinicians
   - Backend queries database
   - Frontend displays clinician cards
   - If API fails, fallback to static files

3. **Admin Sets Availability**:
   - Admin uses availability schedule builder
   - Sends PUT /api/clinicians/:id/availability
   - Backend validates time slots
   - Stores in clinician_availability_rules table

## Components and Interfaces

### Admin Panel Components

#### 1. Specialization Dropdown Component

```typescript
interface SpecializationDropdownProps {
  selectedSpecializations: string[];
  onChange: (specializations: string[]) => void;
}

const SPECIALIZATIONS = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Counselling Psychologist",
  "Clinical Hypnotherapist",
  "Consultant Psychiatrist",
  "Consultant Child & Adolescent Psychiatrist",
  "Therapist",
  "Counselor",
];

// Implementation uses MultiSelect component
// Allows selecting multiple specializations
// Displays selected items as chips/badges
```

#### 2. Qualification Dropdown Component

```typescript
interface QualificationDropdownProps {
  selectedQualifications: string[];
  onChange: (qualifications: string[]) => void;
}

const QUALIFICATIONS = [
  "MBBS",
  "MD",
  "DPM",
  "DNB",
  "M.Phil",
  "M.Sc",
  "Ph.D.",
  "MRCPsych",
  "PDF",
  "DM",
  "PGDFM",
];

// Implementation uses MultiSelect component
// Allows selecting multiple qualifications
// Displays selected items as chips/badges
```

#### 3. Availability Schedule Builder Component

```typescript
interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  mode: "IN_PERSON" | "ONLINE";
}

interface AvailabilityScheduleProps {
  clinicianId: string;
  centreId: string;
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}

// UI Structure:
// - Day selector dropdown (Mon-Sun)
// - Time input fields (start, end) with AM/PM
// - Mode selector (In-Person/Online)
// - "Set Slot" button
// - List of created slots with "+" to add more
// - "Remove" button for each slot
```

#### 4. Profile Picture Upload Component

```typescript
interface ProfilePictureUploadProps {
  currentUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onUrlChange: (url: string) => void;
}

// Two modes:
// 1. File upload: <input type="file" accept="image/*" />
// 2. URL input: <input type="text" placeholder="https://..." />
// Preview image when URL or file is provided
```

#### 5. Credential Display Component

```typescript
interface CredentialDisplayProps {
  username: string;
  password: string; // Plain text for admin viewing
  onCopy: () => void;
}

// Displays in modal or expandable section
// Shows username and password
// Provides "Copy" button for clipboard
```

### Backend API Interfaces

#### Clinician Creation Request

```typescript
interface CreateClinicianRequest {
  // User fields (for new user creation)
  full_name: string;
  phone: string;
  email?: string;
  username?: string;
  password: string;
  role_ids: number[]; // [4] for CLINICIAN role
  centre_ids: number[]; // Primary centre

  // Clinician fields
  primary_centre_id: number;
  specialization: string[]; // Changed to array
  qualification: string[]; // Changed to array
  years_of_experience: number;
  consultation_fee: number;
  bio?: string;
  consultation_modes: ("IN_PERSON" | "ONLINE")[];
  default_duration_minutes: number;
  profile_picture_url?: string;
  expertise?: string[];
  languages?: string[];
}
```

#### Clinician Response

```typescript
interface ClinicianResponse {
  id: string;
  userId: string;
  name: string;
  username: string; // Added for credential display
  specialization: string[];
  qualification: string[];
  yearsOfExperience: number;
  primaryCentreId: string;
  primaryCentreName: string;
  consultationFee: number;
  bio?: string;
  consultationModes: string[];
  defaultDurationMinutes: number;
  profilePictureUrl?: string;
  expertise?: string[];
  languages?: string[];
  isActive: boolean;
  availabilityRules?: AvailabilityRule[];
}
```

#### Availability Rule

```typescript
interface AvailabilityRule {
  id?: string;
  clinicianId: string;
  centreId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  slotDurationMinutes: number;
  mode: "IN_PERSON" | "ONLINE";
  isActive: boolean;
}
```

### Frontend Website Interfaces

#### Doctor Interface (Frontend)

```typescript
interface Doctor {
  id: number;
  name: string;
  qualification: string; // Joined array
  designation: string; // Primary specialization
  experience: string; // "X+ years"
  expertise: string[];
  image: string;
  location: "Bangalore" | "Kochi" | "Mumbai";
  language: string[];
  price: string; // "₹X/session"
  sessionTypes: string; // "In-person & Online sessions"
}
```

## Data Models

### Database Schema Updates

#### clinician_profiles Table

```sql
ALTER TABLE clinician_profiles
ADD COLUMN specialization JSONB DEFAULT '[]'::jsonb,
ADD COLUMN qualification JSONB DEFAULT '[]'::jsonb;

-- Migration: Convert existing string specialization to array
UPDATE clinician_profiles
SET specialization = jsonb_build_array(specialization::text)
WHERE specialization IS NOT NULL;
```

#### clinician_availability_rules Table

```sql
CREATE TABLE IF NOT EXISTS clinician_availability_rules (
  id SERIAL PRIMARY KEY,
  clinician_id INTEGER NOT NULL REFERENCES clinician_profiles(id) ON DELETE CASCADE,
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('IN_PERSON', 'ONLINE')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_clinician_availability_clinician ON clinician_availability_rules(clinician_id);
CREATE INDEX idx_clinician_availability_day ON clinician_availability_rules(day_of_week);
```

### Data Transformation

#### Static File to Database Migration

```typescript
interface StaticClinicianData {
  name: string;
  lines: string[]; // Raw lines from text file
  location: "bangalore" | "kochi" | "mumbai";
}

function parseStaticClinician(
  data: StaticClinicianData,
): CreateClinicianRequest {
  // Parse qualification line (e.g., "MBBS, MD (Psychiatry)")
  const qualifications = extractQualifications(data.lines);

  // Parse designation line (e.g., "Clinical Psychologist")
  const specialization = extractSpecialization(data.lines);

  // Parse experience (e.g., "10+ Years of Experience")
  const experience = extractExperience(data.lines);

  // Parse consultation modes (e.g., "In-person & Online sessions")
  const modes = extractConsultationModes(data.lines);

  return {
    full_name: data.name,
    phone: generatePlaceholderPhone(), // Needs manual update
    password: generateRandomPassword(),
    role_ids: [4],
    centre_ids: [getCentreIdByLocation(data.location)],
    primary_centre_id: getCentreIdByLocation(data.location),
    specialization: [specialization],
    qualification: qualifications,
    years_of_experience: experience,
    consultation_fee: 0, // Needs manual update
    consultation_modes: modes,
    default_duration_minutes: 30,
  };
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, I've identified the following consolidations:

**Redundancy Analysis:**

1. **Multi-select properties (2.4, 2.5, 3.3, 3.4)**: These test the same multi-select functionality for different fields. Can be combined into one comprehensive property about array field storage.

2. **Fallback properties (8.3, 8.4, 11.2, 11.3)**: These all test the same fallback mechanism. Can be combined into one property about fallback behavior.

3. **Filtering properties (9.1, 9.2, 9.3, 9.4)**: These test the same filtering logic with different parameters. Can be combined into one property about filter application.

4. **Validation properties (12.2, 12.3, 12.4, 12.5)**: These test field-specific validation but follow the same pattern. Can be combined into one property about input validation.

5. **Time slot validation (15.1, 15.2, 15.3)**: These test different aspects of time slot validation. Can be combined into one comprehensive property.

6. **Image upload properties (14.1, 14.2, 14.3, 14.4, 14.5)**: These test the complete upload flow. Can be combined into one property about image upload round-trip.

**Properties to Keep Separate:**

- Credential generation and security (7.1, 7.2) - different concerns
- Data persistence (1.3, 1.4) - different database operations
- Migration logic (10.2, 10.3, 10.4) - different parsing steps
- UI rendering examples - kept as examples, not properties

### Correctness Properties

Property 1: Required Field Validation
_For any_ clinician creation request with missing required fields (full_name, phone, password, primary_centre_id, specialization, qualification, years_of_experience, consultation_fee, consultation_modes), the system should reject the request and return a validation error.
**Validates: Requirements 1.2, 12.1**

Property 2: Clinician Creation Round-Trip
_For any_ valid clinician creation request, creating a clinician should result in both a user record and a clinician profile record being stored in the database, and querying the clinician by ID should return all submitted fields.
**Validates: Requirements 1.3, 1.4**

Property 3: Duplicate Phone Rejection
_For any_ phone number that already exists in the users table, attempting to create a new clinician with that phone number should be rejected with a conflict error.
**Validates: Requirements 1.5**

Property 4: Array Field Storage
_For any_ clinician with multiple specializations or qualifications, storing the clinician should preserve all array elements, and retrieving the clinician should return the arrays in the same order.
**Validates: Requirements 2.5, 3.4**

Property 5: Legacy Data Display
_For any_ existing clinician record with a registration_number field, querying and displaying that clinician should include the registration_number value even though the field is removed from the creation form.
**Validates: Requirements 4.3**

Property 6: Profile Picture Default
_For any_ clinician created without a profile_picture_url, the system should assign a default placeholder image URL.
**Validates: Requirements 5.5**

Property 7: Image Upload Round-Trip
_For any_ valid image file (JPEG, PNG, WebP) under 5MB, uploading the file should return a unique URL, and that URL should be accessible and return the uploaded image.
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

Property 8: URL Format Validation
_For any_ string provided as a profile picture URL, the system should validate it matches URL format (starts with http:// or https://) before storing.
**Validates: Requirements 5.4**

Property 9: Availability Slot Persistence
_For any_ set of availability slots with valid day_of_week, start_time, end_time, and consultation_mode, saving the availability should store all slots in the database, and retrieving availability should return all slots.
**Validates: Requirements 6.7**

Property 10: Credential Generation
_For any_ clinician creation request, the system should generate a username (if not provided) and securely hash the password before storage, and the response should include the plain-text password for admin viewing.
**Validates: Requirements 7.1, 7.5**

Property 11: Password Hashing Security
_For any_ clinician with a password, the stored password_hash in the database should not equal the plain-text password, and authentication with the plain-text password should succeed.
**Validates: Requirements 7.2, 7.3**

Property 12: Role-Based Access
_For any_ clinician user, authenticating and accessing the admin panel should grant permissions appropriate to the CLINICIAN role (role_id 4), and should not grant ADMIN-level permissions.
**Validates: Requirements 7.4**

Property 13: Frontend Database Query
_For any_ request to the experts page, the system should first attempt to query the database for clinicians, and only if the database is empty or the query fails should it fall back to static files.
**Validates: Requirements 8.1, 11.1, 11.2, 11.3**

Property 14: Clinician Card Display
_For any_ clinician retrieved from the database, the frontend should display a card containing name, qualification, specialization, experience, location, consultation modes, profile picture, and availability.
**Validates: Requirements 8.2, 8.5**

Property 15: Filter Application
_For any_ combination of filters (location, specialization, consultation_mode), the system should return only clinicians matching all selected criteria, and clearing filters should return all active clinicians.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

Property 16: Static Data Parsing
_For any_ clinician entry in static text files (bangalore/, kochi/, mumbai/), the migration script should extract name, qualification, designation, experience, and consultation modes, and create a complete database record.
**Validates: Requirements 10.2, 10.3**

Property 17: Centre Mapping
_For any_ clinician parsed from a static file, the system should assign primary_centre_id based on the folder location (bangalore → 1, kochi → 2, mumbai → 3).
**Validates: Requirements 10.4**

Property 18: Migration Logging
_For any_ migration run, the system should log the total number of clinicians processed, the number successfully migrated, and any errors encountered.
**Validates: Requirements 10.5**

Property 19: Data Source Consistency
_For any_ clinician data source (database or static files), the frontend should render clinician cards using the same component and display format.
**Validates: Requirements 11.4**

Property 20: Data Source Logging
_For any_ clinician data retrieval, the system should log whether data was served from the database or static files.
**Validates: Requirements 11.5**

Property 21: Input Format Validation
_For any_ clinician creation request, the system should validate phone numbers match 10-digit format, email addresses match standard email patterns, consultation fees are positive numbers, and years of experience are non-negative integers.
**Validates: Requirements 12.2, 12.3, 12.4, 12.5**

Property 22: Validation Error Messages
_For any_ validation failure, the system should return an error message that specifically identifies which field failed validation and why.
**Validates: Requirements 12.6, 15.4**

Property 23: Credential Access Audit
_For any_ admin viewing clinician credentials, the system should log the event with admin ID, clinician ID, and timestamp.
**Validates: Requirements 13.4**

Property 24: Password Change Display
_For any_ clinician password update, the system should return the new plain-text password in the response for admin viewing.
**Validates: Requirements 13.5**

Property 25: Time Slot Validation
_For any_ availability slot, the system should validate that start_time is before end_time, the time format is valid (HH:MM), and the slot does not overlap with existing slots for the same day and clinician.
**Validates: Requirements 15.1, 15.2, 15.3**

Property 26: Availability Slot Display
_For any_ successfully created availability slot, the system should immediately display it in the availability schedule list in the UI.
**Validates: Requirements 15.5**

## Error Handling

### Validation Errors

**Phone Number Validation**:

- Format: Must be 10 digits starting with 6-9
- Uniqueness: Must not exist in users table
- Error: "Invalid phone number format" or "Phone number already exists"

**Email Validation**:

- Format: Must match standard email pattern (x@y.z)
- Error: "Invalid email format"

**Username Validation**:

- Format: 3-50 alphanumeric characters and underscores
- Uniqueness: Must not exist in users table
- Error: "Invalid username format" or "Username already taken"

**Password Validation**:

- Length: Minimum 8 characters
- Error: "Password must be at least 8 characters"

**Consultation Fee Validation**:

- Type: Must be a positive number
- Error: "Consultation fee must be a positive number"

**Years of Experience Validation**:

- Type: Must be a non-negative integer
- Error: "Years of experience must be a non-negative integer"

**Consultation Modes Validation**:

- Values: Must be array containing only "IN_PERSON" or "ONLINE"
- Error: "Invalid consultation mode"

### Database Errors

**Duplicate User**:

- Scenario: Phone number or username already exists
- Response: 409 Conflict
- Message: "A staff user with this phone number already exists" or "Username already taken"

**User Not Found**:

- Scenario: Attempting to link clinician to non-existent user
- Response: 404 Not Found
- Message: "User not found"

**Clinician Already Exists**:

- Scenario: User is already registered as a clinician
- Response: 409 Conflict
- Message: "This user is already registered as a clinician"

**Centre Not Found**:

- Scenario: Invalid primary_centre_id
- Response: 404 Not Found
- Message: "Centre not found"

### File Upload Errors

**Invalid File Type**:

- Scenario: Uploaded file is not JPEG, PNG, or WebP
- Response: 400 Bad Request
- Message: "Invalid file type. Only JPEG, PNG, and WebP are allowed"

**File Too Large**:

- Scenario: Uploaded file exceeds 5MB
- Response: 400 Bad Request
- Message: "File size exceeds 5MB limit"

**Upload Failed**:

- Scenario: Storage service error
- Response: 500 Internal Server Error
- Message: "Failed to upload image. Please try again"

### Availability Validation Errors

**Invalid Time Range**:

- Scenario: start_time >= end_time
- Response: 400 Bad Request
- Message: "Start time must be before end time"

**Overlapping Slots**:

- Scenario: New slot overlaps with existing slot for same day
- Response: 400 Bad Request
- Message: "Time slot overlaps with existing availability"

**Invalid Time Format**:

- Scenario: Time not in HH:MM format
- Response: 400 Bad Request
- Message: "Invalid time format. Use HH:MM"

**Invalid Day of Week**:

- Scenario: day_of_week not between 0-6
- Response: 400 Bad Request
- Message: "Invalid day of week. Must be 0-6 (Sunday-Saturday)"

### Frontend Fallback Handling

**Database Query Failure**:

- Scenario: API returns 500 or network error
- Behavior: Log error, fall back to static files
- User Message: None (seamless fallback)

**Empty Database**:

- Scenario: API returns empty array
- Behavior: Fall back to static files
- User Message: None (seamless fallback)

**Authentication Failure**:

- Scenario: No auth token or expired token
- Behavior: Fall back to static files (experts page is public)
- User Message: None (seamless fallback)

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points

- Test specific validation scenarios (empty phone, invalid email format)
- Test UI component rendering (form displays correct fields)
- Test error message content
- Test database transaction rollback on failure
- Test file upload with specific file types
- Test availability slot overlap detection with specific times

**Property-Based Tests**: Verify universal properties across all inputs

- Test required field validation with randomly generated incomplete data
- Test round-trip data persistence with random clinician data
- Test duplicate phone rejection with random phone numbers
- Test array field storage with random arrays of varying lengths
- Test input format validation with random invalid inputs
- Test filter combinations with random filter selections
- Test time slot validation with random time ranges

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Test Configuration**:

- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `// Feature: dynamic-clinician-management, Property X: [property text]`

**Example Property Test**:

```typescript
import fc from "fast-check";

// Feature: dynamic-clinician-management, Property 1: Required Field Validation
test("clinician creation rejects requests with missing required fields", () => {
  fc.assert(
    fc.property(
      fc.record({
        full_name: fc.option(fc.string(), { nil: undefined }),
        phone: fc.option(fc.string(), { nil: undefined }),
        password: fc.option(fc.string(), { nil: undefined }),
        // ... other fields
      }),
      async (incompleteData) => {
        const requiredFields = [
          "full_name",
          "phone",
          "password",
          "primary_centre_id",
          "specialization",
          "qualification",
          "years_of_experience",
          "consultation_fee",
          "consultation_modes",
        ];

        const missingFields = requiredFields.filter(
          (field) => !incompleteData[field],
        );

        if (missingFields.length > 0) {
          await expect(
            clinicianService.createClinician(incompleteData),
          ).rejects.toThrow();
        }
      },
    ),
    { numRuns: 100 },
  );
});
```

### Test Coverage Requirements

**Backend Tests**:

- Controller tests: Verify request/response handling
- Service tests: Verify business logic and validation
- Repository tests: Verify database queries
- Integration tests: Verify end-to-end flows

**Frontend Tests**:

- Component tests: Verify UI rendering
- Integration tests: Verify API calls and data display
- E2E tests: Verify user workflows

**Minimum Coverage**: 80% code coverage for all new code

### Testing Checklist

- [ ] Unit test: Form displays all required fields
- [ ] Unit test: Form validates phone number format
- [ ] Unit test: Form validates email format
- [ ] Unit test: Specialization dropdown contains expected values
- [ ] Unit test: Qualification dropdown contains expected values
- [ ] Unit test: Profile picture upload accepts valid file types
- [ ] Unit test: Profile picture upload rejects invalid file types
- [ ] Unit test: Availability schedule builder adds slots
- [ ] Unit test: Availability schedule builder removes slots
- [ ] Unit test: Credential display modal shows username and password
- [ ] Property test: Required field validation (Property 1)
- [ ] Property test: Clinician creation round-trip (Property 2)
- [ ] Property test: Duplicate phone rejection (Property 3)
- [ ] Property test: Array field storage (Property 4)
- [ ] Property test: Image upload round-trip (Property 7)
- [ ] Property test: Availability slot persistence (Property 9)
- [ ] Property test: Password hashing security (Property 11)
- [ ] Property test: Frontend database query (Property 13)
- [ ] Property test: Filter application (Property 15)
- [ ] Property test: Input format validation (Property 21)
- [ ] Property test: Time slot validation (Property 25)
- [ ] Integration test: Create clinician end-to-end
- [ ] Integration test: Update clinician availability
- [ ] Integration test: Frontend displays database clinicians
- [ ] Integration test: Frontend falls back to static files
- [ ] Integration test: Frontend filters work correctly
