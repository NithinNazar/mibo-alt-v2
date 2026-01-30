# Clinician Data Migration Plan

## Current Status Analysis ✅

### Good News: Your Code is Already Set Up for Real Data!

The system is **already designed** to work with real backend data. Here's what's in place:

---

## ✅ What's Already Working

### 1. Frontend Clinician Service

**File:** `mibo_version-2/src/services/clinicianService.ts`

```typescript
// Already fetches from backend API
async getClinicians(params?: GetCliniciansParams): Promise<Clinician[]> {
  const response = await apiClient.get<APIResponse<Clinician[]>>("/clinicians");
  return response.data.data;
}
```

**Status:** ✅ Ready - Just needs to be used instead of static data

### 2. Admin Panel Create Clinician Form

**File:** `mibo-admin/src/modules/staff/pages/CliniciansPage.tsx`

**Current Fields in Form:**

- ✅ Full Name
- ✅ Phone
- ✅ Email
- ✅ Password
- ✅ Primary Centre
- ✅ Specialization
- ✅ Registration Number
- ✅ Years of Experience
- ✅ Consultation Fee
- ✅ Bio
- ✅ Consultation Modes (IN_PERSON, ONLINE)
- ✅ Default Duration Minutes
- ✅ Profile Picture URL
- ✅ Designation

**Status:** ✅ All fields present!

### 3. Backend Database Schema

**Table:** `clinician_profiles`

**Existing Columns:**

- ✅ user_id
- ✅ primary_centre_id
- ✅ specialization
- ✅ registration_number
- ✅ years_of_experience
- ✅ consultation_fee
- ✅ bio
- ✅ consultation_modes (JSON array)
- ✅ default_consultation_duration_minutes
- ✅ is_active

**Status:** ✅ Schema supports all needed fields!

---

## ⚠️ What Needs to Be Added

### Missing Fields in Database/Backend

Comparing static data structure with backend schema:

| Static Data Field | Backend Field                        | Status                   |
| ----------------- | ------------------------------------ | ------------------------ |
| `name`            | `users.full_name`                    | ✅ Exists                |
| `qualification`   | ❌ Missing                           | ⚠️ Need to add           |
| `designation`     | `staff_profiles.designation`         | ✅ Exists                |
| `experience`      | `years_of_experience`                | ✅ Exists                |
| `expertise`       | ❌ Missing                           | ⚠️ Need to add           |
| `image`           | `staff_profiles.profile_picture_url` | ✅ Exists                |
| `location`        | `centres.city`                       | ✅ Exists (via relation) |
| `language`        | ❌ Missing                           | ⚠️ Need to add           |
| `price`           | `consultation_fee`                   | ✅ Exists                |
| `sessionTypes`    | `consultation_modes`                 | ✅ Exists                |

### Fields to Add:

1. **`qualification`** - String (e.g., "MBBS, MD", "M.Phil Clinical Psychology")
2. **`expertise`** - JSON array (e.g., ["Anxiety", "Depression", "Trauma"])
3. **`languages`** - JSON array (e.g., ["English", "Hindi", "Malayalam"])

---

## 🔧 Implementation Plan

### Phase 1: Add Missing Fields to Backend (30 mins)

#### Step 1.1: Add Columns to Database

```sql
-- Add new columns to clinician_profiles table
ALTER TABLE clinician_profiles
ADD COLUMN qualification VARCHAR(500),
ADD COLUMN expertise JSONB DEFAULT '[]'::jsonb,
ADD COLUMN languages JSONB DEFAULT '[]'::jsonb;

-- Update existing records with default values
UPDATE clinician_profiles
SET
  qualification = '',
  expertise = '[]'::jsonb,
  languages = '["English"]'::jsonb
WHERE qualification IS NULL;
```

#### Step 1.2: Update Backend Types

**File:** `backend/src/repositories/staff.repository.ts`

Add to `CreateClinicianData` interface:

```typescript
interface CreateClinicianData {
  // ... existing fields
  qualification?: string;
  expertise?: string[];
  languages?: string[];
}
```

#### Step 1.3: Update Backend Service

**File:** `backend/src/services/staff.service.ts`

Update `createClinician` to accept new fields:

```typescript
async createClinician(body: any) {
  const clinicianDto = validateCreateClinician({
    // ... existing fields
    qualification: body.qualification,
    expertise: body.expertise,
    languages: body.languages,
  });
}
```

#### Step 1.4: Update Backend Repository

**File:** `backend/src/repositories/staff.repository.ts`

Update `createClinician` query:

```typescript
const query = `
  INSERT INTO clinician_profiles (
    user_id, primary_centre_id, specialization, registration_number,
    years_of_experience, consultation_fee, bio, consultation_modes,
    default_consultation_duration_minutes, qualification, expertise, languages,
    is_active
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
  RETURNING *;
`;

const clinician = await db.one(query, [
  // ... existing params
  data.qualification || null,
  data.expertise ? JSON.stringify(data.expertise) : "[]",
  data.languages ? JSON.stringify(data.languages) : "[]",
]);
```

### Phase 2: Update Admin Panel Form (15 mins)

#### Step 2.1: Add New Fields to Form

**File:** `mibo-admin/src/modules/staff/pages/CliniciansPage.tsx`

Add to form state:

```typescript
const [formData, setFormData] = useState({
  // ... existing fields
  qualification: "",
  expertise: [] as string[],
  languages: [] as string[],
});
```

Add form inputs:

```tsx
<Input
  label="Qualification"
  type="text"
  placeholder="e.g., MBBS, MD (Psychiatry)"
  value={formData.qualification}
  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
/>

<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Expertise (comma-separated)
  </label>
  <Input
    type="text"
    placeholder="e.g., Anxiety, Depression, Trauma"
    value={formData.expertise.join(", ")}
    onChange={(e) => setFormData({
      ...formData,
      expertise: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
    })}
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Languages (comma-separated)
  </label>
  <Input
    type="text"
    placeholder="e.g., English, Hindi, Malayalam"
    value={formData.languages.join(", ")}
    onChange={(e) => setFormData({
      ...formData,
      languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
    })}
  />
</div>
```

### Phase 3: Update Frontend to Use Backend Data (20 mins)

#### Step 3.1: Modify ExpertsPage to Fetch from API

**File:** `mibo_version-2/src/pages/Experts/ExpertsPage.tsx`

Replace static import with API call:

```typescript
// REMOVE THIS:
// import { doctors } from "./data/doctors";

// ADD THIS:
import clinicianService from "../../services/clinicianService";

export default function ExpertsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinicians();
  }, []);

  const fetchClinicians = async () => {
    try {
      setLoading(true);
      const clinicians = await clinicianService.getClinicians();

      // Transform backend data to match Doctor interface
      const transformedDoctors = clinicians.map((c) => ({
        id: parseInt(c.id),
        name: c.fullName,
        qualification: c.qualification || "",
        designation: c.designation || c.specialization,
        experience: `${c.yearsOfExperience}+ years`,
        expertise: c.expertise || [],
        image: c.profilePictureUrl || "/default-avatar.png",
        location: c.centreName as "Bangalore" | "Kochi" | "Mumbai",
        language: c.languages || ["English"],
        price: `₹${c.consultationFee}/session`,
        sessionTypes:
          c.consultationModes.includes("ONLINE") &&
          c.consultationModes.includes("IN_PERSON")
            ? "In-person & Online sessions"
            : c.consultationModes.includes("ONLINE")
              ? "Online sessions"
              : "In-person sessions",
      }));

      setDoctors(transformedDoctors);
    } catch (error) {
      console.error("Failed to fetch clinicians:", error);
      toast.error("Failed to load clinicians");
    } finally {
      setLoading(false);
    }
  };

  // Rest of component remains the same
}
```

#### Step 3.2: Add Loading State

```tsx
if (loading) {
  return (
    <div className="w-full h-screen bg-[#e9f6f4] flex items-center justify-center">
      <div className="text-[#034B44] text-xl">Loading experts...</div>
    </div>
  );
}
```

### Phase 4: Keep Both Systems Working (Dual Mode)

#### Option A: Environment Variable Toggle

**File:** `mibo_version-2/.env`

```env
VITE_USE_STATIC_CLINICIANS=true  # Set to false to use backend data
```

**File:** `mibo_version-2/src/pages/Experts/ExpertsPage.tsx`

```typescript
const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_CLINICIANS === "true";

useEffect(() => {
  if (USE_STATIC_DATA) {
    // Use static data
    setDoctors(staticDoctors);
    setLoading(false);
  } else {
    // Fetch from backend
    fetchClinicians();
  }
}, []);
```

#### Option B: Fallback System (Recommended)

```typescript
const fetchClinicians = async () => {
  try {
    setLoading(true);
    const clinicians = await clinicianService.getClinicians();

    if (clinicians.length === 0) {
      // Fallback to static data if no clinicians in database
      console.log("No clinicians in database, using static data");
      setDoctors(staticDoctors);
    } else {
      // Use backend data
      const transformedDoctors = transformClinicians(clinicians);
      setDoctors(transformedDoctors);
    }
  } catch (error) {
    console.error("Failed to fetch clinicians, using static data:", error);
    // Fallback to static data on error
    setDoctors(staticDoctors);
  } finally {
    setLoading(false);
  }
};
```

---

## 📋 Migration Checklist

### Backend Changes:

- [ ] Add SQL migration for new columns (qualification, expertise, languages)
- [ ] Update `CreateClinicianData` interface
- [ ] Update `createClinician` service method
- [ ] Update `createClinician` repository method
- [ ] Update `findClinicianById` to return new fields
- [ ] Test API endpoint with Postman/Thunder Client

### Admin Panel Changes:

- [ ] Add qualification input field
- [ ] Add expertise input field (comma-separated)
- [ ] Add languages input field (comma-separated)
- [ ] Update form submission to include new fields
- [ ] Test creating a clinician with all fields

### Frontend Changes:

- [ ] Add API fetch in ExpertsPage
- [ ] Add data transformation function
- [ ] Add loading state
- [ ] Implement fallback to static data
- [ ] Test with empty database
- [ ] Test with real clinicians

### Testing:

- [ ] Create test clinician from admin panel
- [ ] Verify clinician appears on frontend
- [ ] Verify all fields display correctly
- [ ] Test filtering by location
- [ ] Test filtering by expertise
- [ ] Test filtering by language
- [ ] Test with static data (fallback)
- [ ] Test with real data

---

## 🎯 Timeline

| Phase                | Time         | Status     |
| -------------------- | ------------ | ---------- |
| Phase 1: Backend     | 30 mins      | ⏳ Pending |
| Phase 2: Admin Panel | 15 mins      | ⏳ Pending |
| Phase 3: Frontend    | 20 mins      | ⏳ Pending |
| Phase 4: Dual Mode   | 10 mins      | ⏳ Pending |
| Testing              | 30 mins      | ⏳ Pending |
| **Total**            | **~2 hours** | ⏳ Pending |

---

## ✅ Benefits of This Approach

1. **No Breaking Changes** - Static data remains as fallback
2. **Gradual Migration** - Can test with real data while keeping static
3. **Production Ready** - Fallback ensures site never breaks
4. **Easy Rollback** - Just toggle environment variable
5. **Future Proof** - Once tested, remove static data completely

---

## 🚀 Deployment Strategy

### Stage 1: Development (Keep Both)

- Deploy with fallback system
- Static data as backup
- Test real data creation

### Stage 2: Staging (Prefer Real Data)

- Add real clinicians via admin panel
- Verify frontend displays correctly
- Keep static data as fallback

### Stage 3: Production (Real Data Only)

- Migrate all clinicians to database
- Remove static data files
- Remove fallback code
- Pure backend-driven system

---

## 📝 Answer to Your Question

**Q: Is this possible with current code?**
**A: YES! ✅**

Your code is **already designed** for this. You just need to:

1. Add 3 missing fields to database (qualification, expertise, languages)
2. Add those fields to admin panel form
3. Switch frontend from static import to API call

**Q: Will it work without breaking?**
**A: YES! ✅**

With the fallback system, it will:

- Use backend data when available
- Fall back to static data if backend is empty or fails
- Never break the user experience

**Q: Can we keep both for testing?**
**A: YES! ✅**

The dual-mode approach lets you:

- Test real data without removing static data
- Switch between modes with environment variable
- Remove static data only after company review

---

## 🎉 Conclusion

Your system is **95% ready** for real clinician data! Just need to:

1. Add 3 database columns (15 mins)
2. Update admin form (15 mins)
3. Switch frontend to API (20 mins)

**Total work: ~1 hour** to have a fully functional real-data system with static fallback! 🚀
