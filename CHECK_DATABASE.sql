-- ============================================
-- DATABASE COMPATIBILITY CHECK
-- ============================================
-- Run these queries to check if your database is compatible with the updated code

-- 1. Check clinician_profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'clinician_profiles'
ORDER BY ordinal_position;

-- Expected columns:
-- - id
-- - user_id
-- - primary_centre_id
-- - specialization
-- - registration_number
-- - years_of_experience (NOT experience_years)
-- - bio
-- - consultation_modes (JSONB)
-- - default_consultation_duration_minutes (INTEGER)
-- - is_active
-- - created_at
-- - updated_at

-- 2. Check clinician_availability_rules table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'clinician_availability_rules'
ORDER BY ordinal_position;

-- Expected columns:
-- - id
-- - clinician_id
-- - centre_id (REQUIRED - must be NOT NULL)
-- - day_of_week
-- - start_time
-- - end_time
-- - slot_duration_minutes
-- - mode (NOT consultation_mode)
-- - is_active
-- - created_at
-- - updated_at

-- 3. Check staff_profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'staff_profiles'
ORDER BY ordinal_position;

-- Expected columns:
-- - id
-- - user_id
-- - designation
-- - profile_picture_url (TEXT)
-- - is_active
-- - created_at
-- - updated_at
