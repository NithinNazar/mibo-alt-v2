# Slot Filtering - Quick Reference

## ⚡ **QUICK SUMMARY**

### **What Changed:**

1. ✅ **Booked slots** → Completely hidden (not grayed out)
2. ✅ **Unbooked slots < 30 mins away** → Hidden (today only)
3. ✅ **Timezone** → Fixed to use IST correctly

---

## 🎯 **FILTERING RULES**

```
┌─────────────────────────────────────────────────────────┐
│  SLOT VISIBILITY DECISION TREE                          │
└─────────────────────────────────────────────────────────┘

Is slot BOOKED?
├─ YES → ❌ HIDE (always)
└─ NO → Is today's date?
    ├─ NO (future date) → ✅ SHOW
    └─ YES (today) → Is slot ≥ 30 mins away?
        ├─ YES → ✅ SHOW
        └─ NO → ❌ HIDE
```

---

## 📊 **VISUAL EXAMPLE**

### **Scenario: Current Time = 2:00 PM IST**

```
┌──────────────────────────────────────────────────────────┐
│  MORNING SLOTS                                           │
├──────────────────────────────────────────────────────────┤
│  ❌ 9:00 AM  - Hidden (past)                            │
│  ❌ 10:00 AM - Hidden (past)                            │
│  ❌ 11:00 AM - Hidden (booked)                          │
│  ❌ 12:00 PM - Hidden (past)                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  AFTERNOON SLOTS                                         │
├──────────────────────────────────────────────────────────┤
│  ❌ 1:00 PM  - Hidden (past)                            │
│  ❌ 2:15 PM  - Hidden (15 mins away, < 30)              │
│  ❌ 2:25 PM  - Hidden (25 mins away, < 30)              │
│  ✅ 2:30 PM  - SHOWN (30 mins away, exactly at limit)   │
│  ✅ 2:45 PM  - SHOWN (45 mins away)                     │
│  ✅ 3:00 PM  - SHOWN (60 mins away)                     │
│  ❌ 3:30 PM  - Hidden (booked)                          │
│  ✅ 4:00 PM  - SHOWN (120 mins away)                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  EVENING SLOTS                                           │
├──────────────────────────────────────────────────────────┤
│  ✅ 5:00 PM  - SHOWN (180 mins away)                    │
│  ✅ 6:00 PM  - SHOWN (240 mins away)                    │
│  ❌ 7:00 PM  - Hidden (booked)                          │
└──────────────────────────────────────────────────────────┘

USER SEES ONLY:
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ 2:30 PM │ │ 2:45 PM │ │ 3:00 PM │ │ 4:00 PM │ │ 5:00 PM │ │ 6:00 PM │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## ⏰ **30-MINUTE BUFFER EXAMPLES**

| Current Time | Slot Time | Minutes Away | Visible? |
| ------------ | --------- | ------------ | -------- |
| 2:00 PM      | 2:15 PM   | 15 mins      | ❌ NO    |
| 2:00 PM      | 2:25 PM   | 25 mins      | ❌ NO    |
| 2:00 PM      | 2:29 PM   | 29 mins      | ❌ NO    |
| 2:00 PM      | 2:30 PM   | 30 mins      | ✅ YES   |
| 2:00 PM      | 2:31 PM   | 31 mins      | ✅ YES   |
| 2:00 PM      | 3:00 PM   | 60 mins      | ✅ YES   |

**Rule:** `minutesUntilSlot < 30` → HIDE

---

## 📅 **TODAY vs FUTURE DATES**

### **TODAY (2026-05-25):**

```
Current Time: 2:00 PM

Available Slots:
✅ 2:30 PM (30 mins away)
✅ 3:00 PM (60 mins away)
✅ 4:00 PM (120 mins away)

Hidden Slots:
❌ 9:00 AM (past)
❌ 2:15 PM (< 30 mins)
❌ 11:00 AM (booked)
```

### **TOMORROW (2026-05-26):**

```
Current Time: 2:00 PM (doesn't matter)

Available Slots:
✅ 9:00 AM (future date, all unbooked shown)
✅ 10:00 AM
✅ 11:00 AM
✅ 2:00 PM
✅ 3:00 PM
✅ 4:00 PM

Hidden Slots:
❌ 12:00 PM (booked)
❌ 5:00 PM (booked)
```

---

## 🔍 **TESTING CHECKLIST**

### **Quick Tests:**

- [ ] Book a slot → Verify it disappears from UI
- [ ] At 2:00 PM, verify 2:25 PM slot is hidden
- [ ] At 2:00 PM, verify 2:30 PM slot is visible
- [ ] Select tomorrow → Verify all unbooked slots visible
- [ ] Check slot count matches visible buttons

---

## 🚀 **DEPLOYMENT**

### **Files to Deploy:**

1. ✅ `backend/src/services/appointment.services.ts`
2. ✅ `src/pages/BookAppointment/Step1SessionDetails.tsx`

### **No Changes:**

- ❌ Database
- ❌ API endpoints
- ❌ Admin panel

### **Deploy Order:**

1. Backend first
2. Test API
3. Frontend second
4. Test booking flow

---

## 🎯 **KEY POINTS**

1. **Booked slots are GONE** - Not grayed out, completely removed
2. **30-minute buffer** - Slots disappear 30 mins before time
3. **Today only** - Future dates show all unbooked slots
4. **IST timezone** - Uses Indian Standard Time correctly
5. **Clean UI** - Only bookable slots shown

---

## 📞 **SUPPORT**

**If slots not showing correctly:**

1. Check current IST time
2. Verify slot is unbooked
3. Verify slot is ≥ 30 minutes away
4. Check browser console for errors
5. Refresh page to get latest data

**If booking fails:**

1. Backend validates slot availability
2. Slot may have been booked by someone else
3. Slot may be < 30 minutes away
4. Check error message for details

---

## ✅ **FINAL STATUS**

**Implementation:** ✅ COMPLETE  
**Files Changed:** 2  
**Breaking Changes:** ❌ NONE  
**Ready for Testing:** ✅ YES

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2026-05-25
