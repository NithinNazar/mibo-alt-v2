# Token Refresh Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER MAKES API CALL                         │
│              (e.g., Create Booking, Get Profile)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ API Interceptor │
                    │ Adds Auth Token │
                    └────────┬────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Send Request  │
                    │   to Backend   │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │   SUCCESS    │          │  401 ERROR   │
        │   (200 OK)   │          │ Token Expired│
        └──────┬───────┘          └──────┬───────┘
               │                         │
               │                         ▼
               │              ┌──────────────────────┐
               │              │ Check _retry flag    │
               │              │ (prevent infinite    │
               │              │      loops)          │
               │              └──────────┬───────────┘
               │                         │
               │              ┌──────────┴──────────┐
               │              │                     │
               │              ▼                     ▼
               │    ┌──────────────────┐   ┌──────────────┐
               │    │ _retry = false   │   │ _retry = true│
               │    │ (First attempt)  │   │ (Already     │
               │    └────────┬─────────┘   │  retried)    │
               │             │              └──────┬───────┘
               │             ▼                     │
               │    ┌──────────────────┐          │
               │    │ Get Refresh Token│          │
               │    │ from localStorage│          │
               │    └────────┬─────────┘          │
               │             │                     │
               │  ┌──────────┴──────────┐         │
               │  │                     │         │
               │  ▼                     ▼         │
               │ ┌────────┐      ┌──────────┐    │
               │ │ Token  │      │ No Token │    │
               │ │ Exists │      │  Found   │    │
               │ └───┬────┘      └────┬─────┘    │
               │     │                │          │
               │     ▼                │          │
               │ ┌──────────────┐    │          │
               │ │ Call Refresh │    │          │
               │ │   Endpoint   │    │          │
               │ │ POST /patient│    │          │
               │ │ -auth/refresh│    │          │
               │ │    -token    │    │          │
               │ └──────┬───────┘    │          │
               │        │            │          │
               │ ┌──────┴──────┐    │          │
               │ │             │    │          │
               │ ▼             ▼    ▼          ▼
               │┌────────┐  ┌──────────────────┐
               ││SUCCESS │  │  REFRESH FAILED  │
               ││New Token  │  (Invalid/Expired)│
               │└───┬────┘  └────────┬─────────┘
               │    │                │
               │    ▼                ▼
               │┌──────────────┐  ┌──────────────────┐
               ││ Store New    │  │ Clear All Tokens │
               ││ Access Token │  │ - access_token   │
               ││ in localStorage  │ - refresh_token  │
               │└──────┬───────┘  │ - user           │
               │       │          └────────┬─────────┘
               │       ▼                   │
               │┌──────────────┐          ▼
               ││ Set _retry   │  ┌──────────────────┐
               ││ flag = true  │  │ Dispatch         │
               │└──────┬───────┘  │ 'authChange'     │
               │       │          │ Event            │
               │       ▼          └────────┬─────────┘
               │┌──────────────┐          │
               ││ Update Auth  │          ▼
               ││ Header with  │  ┌──────────────────┐
               ││ New Token    │  │ Redirect to      │
               │└──────┬───────┘  │ /patientAuth     │
               │       │          │ (if not already  │
               │       ▼          │  there)          │
               │┌──────────────┐  └──────────────────┘
               ││ RETRY        │
               ││ Original     │
               ││ Request      │
               │└──────┬───────┘
               │       │
               │       ▼
               └──────►┌──────────────┐
                       │   SUCCESS    │
                       │ Return Data  │
                       │   to User    │
                       └──────────────┘
```

## Sequence Diagram

```
User          Frontend        API Client      Backend         localStorage
 │                │               │              │                  │
 │  Click Book   │               │              │                  │
 ├──────────────►│               │              │                  │
 │                │  API Call    │              │                  │
 │                ├──────────────►│              │                  │
 │                │               │ Get Token    │                  │
 │                │               ├─────────────────────────────────►│
 │                │               │◄─────────────────────────────────┤
 │                │               │ expired_token                    │
 │                │               │              │                  │
 │                │               │  Request     │                  │
 │                │               ├─────────────►│                  │
 │                │               │              │                  │
 │                │               │  401 Error   │                  │
 │                │               │◄─────────────┤                  │
 │                │               │              │                  │
 │                │               │ Get Refresh  │                  │
 │                │               ├─────────────────────────────────►│
 │                │               │◄─────────────────────────────────┤
 │                │               │ refresh_token                    │
 │                │               │              │                  │
 │                │               │ Refresh Token│                  │
 │                │               ├─────────────►│                  │
 │                │               │              │                  │
 │                │               │ New Token    │                  │
 │                │               │◄─────────────┤                  │
 │                │               │              │                  │
 │                │               │ Store Token  │                  │
 │                │               ├─────────────────────────────────►│
 │                │               │              │                  │
 │                │               │ Retry Request│                  │
 │                │               ├─────────────►│                  │
 │                │               │              │                  │
 │                │               │  Success     │                  │
 │                │               │◄─────────────┤                  │
 │                │  Success     │              │                  │
 │                │◄──────────────┤              │                  │
 │  Booking Done │               │              │                  │
 │◄───────────────┤               │              │                  │
 │                │               │              │                  │
```

## Timeline Example

### Scenario: User Books Appointment

```
Time: 10:00 AM
├─ User logs in
├─ Access token expires at 10:15 AM
└─ Refresh token expires at 10:00 AM + 7 days

Time: 10:05 AM
├─ User browses clinicians
└─ Token still valid ✅

Time: 10:10 AM
├─ User selects session details
└─ Token still valid ✅

Time: 10:16 AM (Token expired!)
├─ User clicks "Confirm Booking"
├─ API call fails with 401
├─ 🔄 Auto-refresh triggered
├─ New token received
├─ Request retried automatically
└─ ✅ Booking succeeds!

User Experience: Seamless, no error shown! 🎉
```

## Key Points

### ✅ What Happens Automatically:

1. Token expires after 15 minutes
2. Next API call gets 401 error
3. System automatically refreshes token
4. Original request retries with new token
5. User never sees an error

### ❌ What Doesn't Happen:

1. User is NOT logged out
2. User does NOT see "token expired" error
3. User does NOT need to re-login
4. Booking flow is NOT interrupted

### 🔒 Security Features:

1. Short-lived access tokens (15 min)
2. Long-lived refresh tokens (7 days)
3. Single retry per request (no loops)
4. Server-side session validation
5. Automatic cleanup on failure

### 📊 Session Duration:

- **Before**: 15 minutes (then logout)
- **After**: 7 days (seamless refresh)

## Code Locations

### Main Implementation:

- **Token Refresh Logic**: `src/services/api.ts` (lines 75-150)
- **Manual Refresh Method**: `src/services/authService.ts` (lines 280-320)
- **Test Coverage**: `src/services/__tests__/api.test.ts` (lines 120-250)

### Console Logs to Watch:

```javascript
// When token expires:
"🔄 Access token expired, attempting to refresh...";

// When refresh succeeds:
"✅ Token refreshed successfully, retrying original request";

// When refresh fails:
"Token refresh failed - clearing tokens and redirecting to login";
```

## Testing the Implementation

### Quick Test:

1. Login to patient website
2. Open DevTools → Console
3. Delete access token: `localStorage.removeItem('mibo_access_token')`
4. Make any API call (e.g., view profile)
5. Watch console for refresh logs
6. Verify request succeeds

### Expected Console Output:

```
🔄 Access token expired, attempting to refresh...
✅ Token refreshed successfully, retrying original request
```

---

**This implementation ensures patients stay logged in for 7 days without interruption!** 🎉
