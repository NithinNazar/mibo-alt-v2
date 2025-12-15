# Mibo Care Admin Panel - Quick Reference

## Essential Information

### API Base URL

```
http://localhost:5000/api
```

### Authentication

```typescript
// Three methods supported:
1. Phone + OTP
2. Phone + Password
3. Username + Password

// Tokens stored in localStorage:
- accessToken (15 min)
- refreshToken (7 days)
```

### Key Data Types

```typescript
// Cities (lowercase only)
"bangalore" | "kochi" | "mumbai";

// User Types
"PATIENT" | "STAFF";

// Roles
"ADMIN" |
  "MANAGER" |
  "CENTRE_MANAGER" |
  "CLINICIAN" |
  "CARE_COORDINATOR" |
  "FRONT_DESK";

// Appointment Types
"IN_PERSON" | "ONLINE" | "INPATIENT_ASSESSMENT" | "FOLLOW_UP";

// Appointment Statuses
"BOOKED" | "CONFIRMED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
```

### Important Database Column Names

```typescript
// Clinician
years_of_experience; // NOT experience_years
consultation_fee; // NOT fee

// Availability
day_of_week; // 0-6 (Sunday-Saturday)
start_time; // "HH:MM" format
end_time; // "HH:MM" format
slot_duration; // in minutes
mode; // "IN_PERSON" | "ONLINE"

// Appointments
scheduled_start_at;
scheduled_end_at;
appointment_type;
cancellation_reason;
```

### Service Layer Quick Access

```typescript
import centreService from "./services/centreService";
import clinicianService from "./services/clinicianService";
import patientService from "./services/patientService";
import appointmentService from "./services/appointmentService";
import analyticsService from "./services/analyticsService";
import authService from "./services/authService";

// All services return Promises
const centres = await centreService.getCentres();
const patients = await patientService.getPatients({ search: "John" });
const appointments = await appointmentService.getAppointments();
```

### Common Patterns

```typescript
// 1. Fetch data with loading state
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getData();
      setData(result);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// 2. Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await service.create(formData);
    toast.success("Created successfully");
    onClose();
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed");
  }
};

// 3. Table with proper types
<Table
  columns={[{ key: "name", header: "Name", render: (item) => item.name }]}
  data={items}
  keyExtractor={(item) => item.id}
/>;
```

### File Locations

```
Services:           src/services/
Types:              src/types/index.ts
Components:         src/components/ui/
Calendar:           src/components/calendar/
Charts:             src/components/charts/
Layouts:            src/layouts/AdminLayout/
Routes:             src/router/index.tsx
Auth Context:       src/contexts/AuthContext.tsx
```

### Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Tailwind Colors

```typescript
bg - miboBg; // #0f172a (dark background)
text - miboTeal; // #2CA5A9 (primary teal)
bg - miboDeepBlue; // #1e3a8a (deep blue)
```

### Error Handling Template

```typescript
try {
  // Add timeout protection
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 5000)
  );

  const dataPromise = service.getData();
  const result = await Promise.race([dataPromise, timeoutPromise]);

  // Success
  toast.success("Success!");
} catch (error: any) {
  console.error("Error:", error);
  toast.error(error.response?.data?.message || "Operation failed");
}
```

### Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to route
navigate("/patients");

// Navigate with params
navigate(`/patients/${id}`);

// Navigate with state
navigate("/book-appointment", { state: { centreId } });

// Go back
navigate(-1);
```

### Key Routes

```
/dashboard                          - Analytics dashboard
/patients                           - Patient list
/patients/:id                       - Patient details
/book-appointment                   - Appointment booking
/centres                            - Centre management
/centres/:centreId/appointments     - Centre appointments
/staff/clinicians                   - Clinician management
/clinicians/:id/appointments        - Clinician appointments
/settings                           - Settings
```

### Environment Setup

```env
# .env file
VITE_API_BASE_URL=http://localhost:5000/api
```

### Type Import Pattern

```typescript
// ❌ Wrong
import service, { Type } from "./service";

// ✅ Correct
import service from "./service";
import type { Type } from "./service";
```

### Checklist for New Features

- [ ] Create TypeScript types
- [ ] Add service methods
- [ ] Create UI components
- [ ] Add route to router
- [ ] Add navigation link to sidebar
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test with backend API
- [ ] Add to documentation
