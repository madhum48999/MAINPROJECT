# TODO: Remove Backend Code from Frontend and Merge Backend Functions

## Overview
Remove mock data, API client, and config switching from frontend. Translate Java backend services to TypeScript services and integrate directly into frontend.

## Tasks

### Phase 1: Create TypeScript Services from Java Backend
- [ ] Create `frontend/src/services/AuthService.ts` from `backend/src/main/java/com/healthcare/app/service/AuthService.java`
- [ ] Create `frontend/src/services/PatientService.ts` from `backend/src/main/java/com/healthcare/app/service/PatientService.java`
- [ ] Create `frontend/src/services/DoctorService.ts` from `backend/src/main/java/com/healthcare/app/service/DoctorService.java`
- [ ] Create `frontend/src/services/HospitalService.ts` from `backend/src/main/java/com/healthcare/app/service/HospitalService.java`
- [ ] Create `frontend/src/services/AppointmentService.ts` from `backend/src/main/java/com/healthcare/app/service/AppointmentService.java`
- [ ] Create `frontend/src/services/AdminService.ts` from `backend/src/main/java/com/healthcare/app/service/AdminService.java`
- [ ] Create `frontend/src/services/NotificationService.ts` from `backend/src/main/java/com/healthcare/app/service/NotificationService.java`
- [ ] Create `frontend/src/services/ReminderService.ts` from `backend/src/main/java/com/healthcare/app/service/ReminderService.java`
- [ ] Create `frontend/src/services/ReviewService.ts` from `backend/src/main/java/com/healthcare/app/service/ReviewService.java`
- [ ] Create `frontend/src/services/SearchService.ts` from `backend/src/main/java/com/healthcare/app/service/SearchService.java`
- [ ] Create `frontend/src/services/EmailService.ts` from `backend/src/main/java/com/healthcare/app/service/EmailService.java`
- [ ] Create `frontend/src/services/SmsService.ts` from `backend/src/main/java/com/healthcare/app/service/SmsService.java`

### Phase 2: Create In-Memory Data Storage
- [ ] Create `frontend/src/lib/data-store.ts` for in-memory data storage
- [ ] Implement repositories pattern for data access
- [ ] Add initial data seeding

### Phase 3: Remove Backend-Related Files
- [ ] Delete `frontend/src/lib/mock-data.ts`
- [ ] Delete `frontend/src/lib/api-client.ts`
- [ ] Delete `frontend/src/lib/config.ts`
- [ ] Delete `frontend/src/public/config.js`
- [ ] Remove config.js script tag from `frontend/index.html`

### Phase 4: Update App Store
- [ ] Update `frontend/src/lib/app-store.tsx` to use new services directly
- [ ] Remove USE_BACKEND checks and config dependencies
- [ ] Update all CRUD operations to use services

### Phase 5: Update Auth Context
- [ ] Update `frontend/src/lib/auth-context.tsx` to use AuthService directly
- [ ] Remove API calls and use service methods

### Phase 6: Update Components and Hooks
- [ ] Update all hooks in `frontend/src/hooks/` to use services directly
- [ ] Update components that use API calls
- [ ] Test all functionality works with new services

### Phase 7: Testing and Cleanup
- [ ] Test authentication flow
- [ ] Test CRUD operations for all entities
- [ ] Test appointment booking and management
- [ ] Clean up any unused imports or files
- [ ] Update documentation

## Notes
- All services will use in-memory data storage instead of database
- Password encoding will be simplified for frontend
- Email/SMS services will be mocked
- JWT tokens will be simplified
