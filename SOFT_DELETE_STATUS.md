# Soft Delete Implementation Status

## ✅ COMPLETED

### 1. Clinicians

- Frontend: Toggle switch implemented in `CliniciansPage.tsx`
- Backend: Full implementation (route, controller, service, repository)
- Status: **WORKING**

### 2. Centres

- Frontend: Toggle switch implemented in `CentresPage.tsx`
- Backend: Controller method added, needs service + repository
- Status: **90% COMPLETE** - Need to add service/repository methods

## ⏳ REMAINING (Same Pattern)

### 3. Managers

- File: `mibo-admin/src/modules/staff/pages/ManagersPage.tsx`
- Service: Use `/users/:id/toggle-active` endpoint
- Pattern: Same as clinicians

### 4. Centre Managers

- File: `mibo-admin/src/modules/staff/pages/CentreManagersPage.tsx`
- Service: Use `/users/:id/toggle-active` endpoint
- Pattern: Same as clinicians

### 5. Care Coordinators

- File: `mibo-admin/src/modules/staff/pages/CareCoordinatorsPage.tsx`
- Service: Use `/users/:id/toggle-active` endpoint
- Pattern: Same as clinicians

### 6. Front Desk

- File: `mibo-admin/src/modules/staff/pages/FrontDeskPage.tsx`
- Service: Use `/users/:id/toggle-active` endpoint
- Pattern: Same as clinicians

## Implementation Pattern

All staff pages (Managers, Centre Managers, Care Coordinators, Front Desk) follow the same pattern:

### Frontend Changes:

1. Replace `handleDelete` with `handleToggleActive`
2. Replace delete button with toggle checkbox in table columns
3. Add `toggleActive` method to service

### Backend Changes:

1. Add route: `PATCH /api/users/:id/toggle-active`
2. Add controller method: `toggleStaffActive`
3. Add service method: `toggleStaffActive`
4. Add repository method: `toggleStaffActive`

## Quick Implementation

Since all staff pages use the same backend endpoint (`/users`), we only need:

1. One backend implementation for all staff
2. Update each frontend page with toggle UI

## Next Priority: Part B - Payment Links

Moving to implement payment link feature with Gallabox WhatsApp integration as this is more critical for business operations.

The remaining soft delete implementations can be completed quickly using the same pattern once payment links are working.
