# File Cleanup Guide

This document categorizes all test scripts, check scripts, and documentation files across the project, indicating which are safe to delete.

## Legend

- ✅ **SAFE TO DELETE** - Temporary diagnostic/test scripts created during development
- ⚠️ **REVIEW BEFORE DELETE** - May contain useful information but likely outdated
- 🔒 **KEEP** - Important documentation or active files

---

## Backend Directory (`backend/`)

### Test Scripts (test-\*.js) - ✅ SAFE TO DELETE (All)

These are temporary diagnostic scripts created during development and debugging:

1. ✅ `test-actual-creation.js` - Tests clinician creation API
2. ✅ `test-api-endpoints.js` - Tests various API endpoints
3. ✅ `test-appointment-creation.js` - Tests appointment creation
4. ✅ `test-appointments-api.js` - Tests appointments API
5. ✅ `test-aws-db-connection.js` - Tests AWS database connection
6. ✅ `test-clinician-api.js` - Tests clinician API
7. ✅ `test-clinician-creation-enhanced.js` - Enhanced clinician creation tests
8. ✅ `test-clinician-creation.js` - Basic clinician creation tests
9. ✅ `test-clinician-duration-api.js` - Tests clinician duration API
10. ✅ `test-clinician-login-direct.js` - Direct clinician login tests
11. ✅ `test-clinician-login.js` - Clinician login tests
12. ✅ `test-correct-endpoints.js` - Tests correct endpoints
13. ✅ `test-database-verification.js` - Database verification tests
14. ✅ `test-live-repositories.js` - Tests live repositories
15. ✅ `test-password-login.js` - Password login tests
16. ✅ `test-patient-creation.js` - Patient creation tests
17. ✅ `test-payment-link-amount.js` - Payment link amount tests
18. ✅ `test-phone-formatting.js` - Phone formatting tests
19. ✅ `test-public-clinician-endpoints.js` - Public clinician endpoint tests
20. ✅ `test-public-endpoints.js` - Public endpoint tests
21. ✅ `test-slot-blocking-api.js` - Slot blocking API tests
22. ✅ `test-slots-api.js` - Slots API tests
23. ✅ `test-updated-repositories.js` - Updated repositories tests
24. ✅ `test-validation-enhanced.js` - Enhanced validation tests

### Check Scripts (check-\*.js) - ✅ SAFE TO DELETE (All)

These are temporary diagnostic scripts for database and schema verification:

1. ✅ `check-admin-and-create-staff.js` - Checks admin and creates staff
2. ✅ `check-appointment-id-format.js` - Checks appointment ID format
3. ✅ `check-appointment-phones.js` - Checks appointment phone numbers
4. ✅ `check-array-type.js` - Checks array types
5. ✅ `check-clinician-columns.js` - Checks clinician table columns
6. ✅ `check-clinician-data.js` - Checks clinician data
7. ✅ `check-clinician-duration-db.js` - Checks clinician duration in DB
8. ✅ `check-clinician-duration-field.js` - Checks clinician duration field
9. ✅ `check-gallabox-phone-handling.js` - Checks Gallabox phone handling
10. ✅ `check-live-db.js` - Checks live database
11. ✅ `check-missing-tables.js` - Checks for missing tables
12. ✅ `check-payment-amounts.js` - Checks payment amounts
13. ✅ `check-payments-schema.js` - Checks payments schema
14. ✅ `check-phone-format.js` - Checks phone format
15. ✅ `check-phone-formats.js` - Checks phone formats (plural)
16. ✅ `check-staff-profiles-schema.js` - Checks staff profiles schema
17. ✅ `check-staff-schema.js` - Checks staff schema
18. ✅ `check-tables.js` - Checks database tables
19. ✅ `check-user-roles-schema.js` - Checks user roles schema
20. ✅ `check-user-types.js` - Checks user types
21. ✅ `check-users-columns.js` - Checks users table columns
22. ✅ `check-users-pk.js` - Checks users primary key
23. ✅ `check-users-schema.js` - Checks users schema
24. ✅ `check-users-table-structure.js` - Checks users table structure

### Diagnostic Scripts (diagnose-_.js, debug-_.js) - ✅ SAFE TO DELETE (All)

1. ✅ `diagnose-clinician-login.js` - Diagnoses clinician login issues
2. ✅ `debug-filter-issue.js` - Debugs filter issues
3. ✅ `debug-slots-issue.js` - Debugs slots issues

### Utility Scripts - ✅ SAFE TO DELETE (Most)

1. ✅ `compare-table-schemas.js` - Compares table schemas
2. ✅ `create-admin-user.js` - Creates admin user (one-time script)
3. ✅ `create-all-staff-test-data.js` - Creates test staff data
4. ✅ `create-dummy-clinician.js` - Creates dummy clinician
5. ✅ `create-test-staff-direct.js` - Creates test staff directly
6. ✅ `create-test-user-aws.js` - Creates test user on AWS
7. ✅ `create-test-user-with-password.js` - Creates test user with password
8. ✅ `delete-all-clinicians.js` - Deletes all clinicians (dangerous!)
9. ✅ `delete-clinicians.js` - Deletes clinicians
10. ✅ `fix-phone-format.js` - Fixes phone format (one-time script)
11. ✅ `generate-password-hash.js` - Generates password hash (utility)
12. ✅ `list-all-clinicians.js` - Lists all clinicians
13. ✅ `run-migration.js` - Runs migrations (may be useful, but check if used)
14. ✅ `update-phone.js` - Updates phone numbers (one-time script)
15. ✅ `verify-admin.js` - Verifies admin user
16. ✅ `verify-fixes.js` - Verifies fixes

### Backend Documentation Files

#### 🔒 KEEP - Important Documentation

1. 🔒 `README.md` - Main backend README
2. 🔒 `API_DOCUMENTATION.md` - API documentation
3. 🔒 `BACKEND_OVERVIEW.md` - Backend overview
4. 🔒 `ENVIRONMENT_VARIABLES_GUIDE.md` - Environment variables guide

#### ⚠️ REVIEW BEFORE DELETE - Deployment & Migration Guides

These may be useful for future deployments, but check if information is current:

1. ⚠️ `AWS_DATABASE_MIGRATION_GUIDE.md` - AWS database migration guide
2. ⚠️ `AWS_DEPLOYMENT_CHECKLIST_USERNAME_LOGIN.md` - Deployment checklist
3. ⚠️ `AWS_DEPLOYMENT_GUIDE.md` - AWS deployment guide
4. ⚠️ `AWS_MIGRATION_CHECKLIST.md` - AWS migration checklist
5. ⚠️ `AWS_MIGRATION_GUIDE.md` - AWS migration guide
6. ⚠️ `DATABASE_RESET_GUIDE.md` - Database reset guide

#### ✅ SAFE TO DELETE - Completed Feature Documentation

These document completed features and fixes:

1. ✅ `BOOKING_AND_NOTIFICATIONS_VERIFICATION.md` - Verification complete
2. ✅ `BUILD_ERROR_FIX.md` - Build error fixed
3. ✅ `CLINICIAN_LOGIN_IMPLEMENTATION.md` - Implementation complete
4. ✅ `FIXES_APPLIED_SUMMARY.md` - Fixes applied
5. ✅ `GALLABOX_BOOKING_AUDIT_COMPLETE.md` - Audit complete
6. ✅ `ISNEWUSER_FLAG_FIX.md` - Fix complete
7. ✅ `PAYMENT_AMOUNT_VERIFICATION.md` - Verification complete
8. ✅ `PAYMENT_LINK_INTEGRATION_COMPLETE.md` - Integration complete
9. ✅ `PAYMENT_LINK_TEMPLATE_ANALYSIS.md` - Analysis complete
10. ✅ `PAYMENT_LINK_TEMPLATE_FIX_COMPLETE.md` - Fix complete
11. ✅ `PHONE_NUMBER_FIX_SUMMARY.md` - Fix summary
12. ✅ `RAZORPAY_LIVE_MODE_UPDATE.md` - Update complete
13. ✅ `REPOSITORY_UPDATE_SUMMARY.md` - Update summary
14. ✅ `SCHEMA_COMPATIBILITY_REPORT.md` - Compatibility report
15. ✅ `SECURITY_AND_UX_FIXES_COMPLETE.md` - Fixes complete
16. ✅ `SERVER_CONFIG_COMPLETE.txt` - Config complete
17. ✅ `TEST_USER_SETUP.md` - Setup complete
18. ✅ `USERNAME_PASSWORD_LOGIN_GUIDE.md` - Guide (feature complete)
19. ✅ `VERIFICATION_COMPLETE.md` - Verification complete

### SQL Files - ⚠️ REVIEW BEFORE DELETE

1. ⚠️ `CHECK_DATABASE.sql` - Database check queries (may be useful)
2. ⚠️ `clear-database.sql` - Clears database (dangerous, but may be useful)
3. ⚠️ `create-test-user-aws.sql` - Creates test user SQL
4. ⚠️ `SOFT_DELETE_IMPLEMENTATION.sql` - Soft delete implementation
5. ⚠️ `update-admin-phone.sql` - Updates admin phone
6. ⚠️ `VERIFY_DATABASE_SCHEMA.sql` - Verifies database schema

### HTTP Test Files - ✅ SAFE TO DELETE (if not actively used)

1. ✅ `api-requests-production.http` - Production API requests (keep if used for testing)
2. ✅ `api-requests.http` - API requests (keep if used for testing)
3. ✅ `slot-blocking-api-tests.http` - Slot blocking API tests

### Batch Files - ⚠️ REVIEW BEFORE DELETE

1. ⚠️ `activate-new-files.bat` - Activates new files (Windows)
2. ⚠️ `activate-new-files.sh` - Activates new files (Unix)
3. ⚠️ `cleanup-project.bat` - Cleanup script
4. ⚠️ `switch-to-aws.bat` - Switches to AWS environment
5. ⚠️ `switch-to-local.bat` - Switches to local environment
6. ⚠️ `test-aws-connection.bat` - Tests AWS connection
7. ⚠️ `test-docker.bat` - Tests Docker

### Text Files - ✅ SAFE TO DELETE (Most)

1. ✅ `AWS_ENV_COPY_PASTE.txt` - AWS environment variables copy-paste
2. ✅ `AWS_ENVIRONMENT_VARIABLES.txt` - AWS environment variables
3. ✅ `aws-local-testing-task.txt` - AWS local testing task
4. ✅ `current_db_schema.txt` - Current database schema snapshot

### JSON Files - ⚠️ REVIEW BEFORE DELETE

1. ⚠️ `AWS_ENVIRONMENT_VARIABLES_KEY_VALUE.json` - AWS env vars (may be useful)
2. 🔒 `clinic-booking-system-483212-31e92efb492d.json` - Google service account (KEEP!)

---

## Frontend Directory (`mibo_version-2/`)

### Documentation Files

#### 🔒 KEEP - Important Documentation

1. 🔒 `README.md` - Main frontend README
2. 🔒 `FRONTEND_OVERVIEW.md` - Frontend overview
3. 🔒 `PROJECT_DOCUMENTATION.md` - Project documentation
4. 🔒 `FILE_INVENTORY.md` - File inventory (recently created)
5. 🔒 `SLOT_APIS_REFERENCE.md` - Slot APIs reference (recently created)

#### ✅ SAFE TO DELETE - Completed Feature Documentation

1. ✅ `ALL_FIXES_COMPLETE.md` - All fixes complete
2. ✅ `API_DIAGNOSTICS_REPORT.md` - Diagnostics report
3. ✅ `AUTHENTICATION_SKIP_FEATURE.md` - Feature complete
4. ✅ `BOOKING_FLOW_DIAGRAM.md` - Flow diagram
5. ✅ `BOOKING_SLOTS_DYNAMIC_FIX.md` - Fix complete
6. ✅ `BOOKING_SLOTS_FIX_COMPLETE.md` - Fix complete
7. ✅ `BOOKING_SLOTS_ISSUE_AND_FIX.md` - Issue fixed
8. ✅ `COMPLETE_API_DOCUMENTATION.md` - Documentation complete
9. ✅ `COMPLETE_BUILD_AND_VERIFICATION_REPORT.md` - Verification complete
10. ✅ `COMPREHENSIVE_FIXES_NEEDED.md` - Fixes applied
11. ✅ `CONFIGURATION_STATUS_REPORT.md` - Status report
12. ✅ `CONFIGURATION_VERIFICATION_COMPLETE.md` - Verification complete
13. ✅ `DEPLOY_PRODUCTION_FIXES.md` - Deployment complete
14. ✅ `DOCUMENTATION_CLEANUP_SUMMARY.md` - Cleanup summary
15. ✅ `EXAMPLE_IMAGE_MIGRATION.md` - Example migration
16. ✅ `FINAL_DEPLOYMENT_CHECKLIST.md` - Deployment checklist
17. ✅ `FINAL_DEPLOYMENT_REPORT.md` - Deployment report
18. ✅ `IMAGE_OPTIMIZATION_COMPLETE.md` - Optimization complete
19. ✅ `IMAGE_OPTIMIZATION_GUIDE.md` - Optimization guide
20. ✅ `IMAGE_OPTIMIZATION_IMPLEMENTATION_SUMMARY.md` - Implementation summary
21. ✅ `IMAGE_OPTIMIZATION_SUMMARY.md` - Summary
22. ✅ `INTEGRATION_COMPLETE.md` - Integration complete
23. ✅ `LANDING_PAGES_README.md` - Landing pages README
24. ✅ `MOBILE_RESPONSIVENESS_TEST.md` - Test complete
25. ✅ `PATIENT_DASHBOARD_ANALYSIS.md` - Analysis complete
26. ✅ `PATIENT_LIST_FEATURE_COMPLETE.md` - Feature complete
27. ✅ `PRODUCTION_BUGS_FIX.md` - Bugs fixed
28. ✅ `SLOT_BLOCKING_IMPLEMENTATION_COMPLETE.md` - Implementation complete
29. ✅ `SYSTEM_VERIFICATION_COMPLETE.md` - Verification complete
30. ✅ `TEST_RESULTS.md` - Test results
31. ✅ `URL_AUDIT_AND_FIX_COMPLETE.md` - Audit complete
32. ✅ `USERNAME_PASSWORD_LOGIN_COMPLETE.md` - Login complete
33. ✅ `VIDEO_OPTIMIZATION_COMPLETE.md` - Optimization complete
34. ✅ `VIDEO_OPTIMIZATION_GUIDE.md` - Optimization guide

### SQL Files - ⚠️ REVIEW BEFORE DELETE

1. ⚠️ `CHECK_DATABASE.sql` - Database check queries

### HTML Test Files - ✅ SAFE TO DELETE

1. ✅ `test-auth-skip-feature.html` - Auth skip feature test

### HTTP Test Files - ✅ SAFE TO DELETE (if not actively used)

1. ✅ `api-requests.http` - API requests (keep if used for testing)

### Text Files - ✅ SAFE TO DELETE

1. ✅ `AWS_ENV_VARIABLES.txt` - AWS environment variables

---

## Admin Panel Directory (`mibo-admin/`)

### Documentation Files

#### 🔒 KEEP - Important Documentation

1. 🔒 `README.md` - Main admin panel README
2. 🔒 `ADMIN_PANEL_OVERVIEW.md` - Admin panel overview

#### ✅ SAFE TO DELETE - Completed Feature Documentation

1. ✅ `DEPLOY_NOW.md` - Deployment instructions (if already deployed)
2. ✅ `PROTECTED_ROUTE_IMPLEMENTATION.md` - Implementation complete

### SQL Files - ⚠️ REVIEW BEFORE DELETE

1. ⚠️ `CHECK_DATABASE.sql` - Database check queries

---

## Summary Statistics

### Backend

- **Test Scripts**: 24 files - ✅ ALL SAFE TO DELETE
- **Check Scripts**: 24 files - ✅ ALL SAFE TO DELETE
- **Diagnostic Scripts**: 3 files - ✅ ALL SAFE TO DELETE
- **Utility Scripts**: 16 files - ✅ ALL SAFE TO DELETE
- **Documentation**: 19 files safe to delete, 6 to review, 4 to keep

### Frontend (mibo_version-2)

- **Documentation**: 34 files safe to delete, 5 to keep

### Admin Panel (mibo-admin)

- **Documentation**: 2 files safe to delete, 2 to keep

### Total Files Safe to Delete: ~125 files

---

## Recommended Deletion Commands

### Backend - Delete All Test/Check/Diagnostic Scripts

```bash
cd backend
rm test-*.js check-*.js diagnose-*.js debug-*.js
rm create-*.js delete-*.js fix-*.js generate-*.js list-*.js update-*.js verify-*.js compare-*.js run-migration.js
```

### Backend - Delete Completed Documentation

```bash
cd backend
rm BOOKING_AND_NOTIFICATIONS_VERIFICATION.md BUILD_ERROR_FIX.md CLINICIAN_LOGIN_IMPLEMENTATION.md
rm FIXES_APPLIED_SUMMARY.md GALLABOX_BOOKING_AUDIT_COMPLETE.md ISNEWUSER_FLAG_FIX.md
rm PAYMENT_AMOUNT_VERIFICATION.md PAYMENT_LINK_INTEGRATION_COMPLETE.md PAYMENT_LINK_TEMPLATE_ANALYSIS.md
rm PAYMENT_LINK_TEMPLATE_FIX_COMPLETE.md PHONE_NUMBER_FIX_SUMMARY.md RAZORPAY_LIVE_MODE_UPDATE.md
rm REPOSITORY_UPDATE_SUMMARY.md SCHEMA_COMPATIBILITY_REPORT.md SECURITY_AND_UX_FIXES_COMPLETE.md
rm SERVER_CONFIG_COMPLETE.txt TEST_USER_SETUP.md USERNAME_PASSWORD_LOGIN_GUIDE.md VERIFICATION_COMPLETE.md
```

### Frontend - Delete Completed Documentation

```bash
cd mibo_version-2
rm ALL_FIXES_COMPLETE.md API_DIAGNOSTICS_REPORT.md AUTHENTICATION_SKIP_FEATURE.md
rm BOOKING_FLOW_DIAGRAM.md BOOKING_SLOTS_DYNAMIC_FIX.md BOOKING_SLOTS_FIX_COMPLETE.md
rm BOOKING_SLOTS_ISSUE_AND_FIX.md COMPLETE_API_DOCUMENTATION.md COMPLETE_BUILD_AND_VERIFICATION_REPORT.md
rm COMPREHENSIVE_FIXES_NEEDED.md CONFIGURATION_STATUS_REPORT.md CONFIGURATION_VERIFICATION_COMPLETE.md
rm DEPLOY_PRODUCTION_FIXES.md DOCUMENTATION_CLEANUP_SUMMARY.md EXAMPLE_IMAGE_MIGRATION.md
rm FINAL_DEPLOYMENT_CHECKLIST.md FINAL_DEPLOYMENT_REPORT.md IMAGE_OPTIMIZATION_COMPLETE.md
rm IMAGE_OPTIMIZATION_GUIDE.md IMAGE_OPTIMIZATION_IMPLEMENTATION_SUMMARY.md IMAGE_OPTIMIZATION_SUMMARY.md
rm INTEGRATION_COMPLETE.md LANDING_PAGES_README.md MOBILE_RESPONSIVENESS_TEST.md
rm PATIENT_DASHBOARD_ANALYSIS.md PATIENT_LIST_FEATURE_COMPLETE.md PRODUCTION_BUGS_FIX.md
rm SLOT_BLOCKING_IMPLEMENTATION_COMPLETE.md SYSTEM_VERIFICATION_COMPLETE.md TEST_RESULTS.md
rm URL_AUDIT_AND_FIX_COMPLETE.md USERNAME_PASSWORD_LOGIN_COMPLETE.md VIDEO_OPTIMIZATION_COMPLETE.md
rm VIDEO_OPTIMIZATION_GUIDE.md test-auth-skip-feature.html AWS_ENV_VARIABLES.txt
```

### Admin Panel - Delete Completed Documentation

```bash
cd mibo-admin
rm DEPLOY_NOW.md PROTECTED_ROUTE_IMPLEMENTATION.md
```

---

## Notes

1. **Before deleting**, make sure you have a backup or the files are committed to git
2. **HTTP files** (`*.http`) - Keep if you actively use them for API testing with REST Client extension
3. **SQL files** - Review before deleting, they may contain useful queries
4. **Batch files** - Keep if you use them for environment switching
5. **Google service account JSON** - NEVER DELETE! This is critical for Google Meet integration

## Safe Deletion Strategy

1. **Phase 1**: Delete all test-_.js and check-_.js files (safest)
2. **Phase 2**: Delete diagnostic and utility scripts
3. **Phase 3**: Delete completed documentation files
4. **Phase 4**: Review and delete SQL/HTTP/batch files if not needed
