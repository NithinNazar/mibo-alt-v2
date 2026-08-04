# Experts Dropdown - Visual Guide

## Desktop View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                      │
│  ┌────┐  BOOK APPOINTMENT  LOCATIONS ▾  SERVICES ▾  ABOUT US  WHO IT'S FOR │
│  │LOGO│  WHY MIBO  EXPERTS ▾  BLOG                         📞  💬  SIGN IN  │
│  └────┘               ↓                                                      │
│              ┌──────────────────────────────────────────────────────┐       │
│              │                                                      │       │
│              │  🧠  Clinical Psychologists                         │       │
│              │     Find safe, compassionate care for your          │       │
│              │     mental health journey.                          │       │
│              │                                                      │       │
│              │  ────────────────────────────────────────────       │       │
│              │                                                      │       │
│              │  💊  Psychiatrists                                  │       │
│              │     Expert medical care for advanced mental         │       │
│              │     health conditions.                              │       │
│              │                                                      │       │
│              └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hover State (Desktop)

```
When hovering over an option:
┌──────────────────────────────────────────────────────┐
│  🧠 ✨ Clinical Psychologists                       │  ← Light green background
│     Find safe, compassionate care for your          │  ← Icon scales up
│     mental health journey.                          │  ← Text changes to teal
└──────────────────────────────────────────────────────┘
```

---

## Mobile View (Hamburger Menu)

```
┌───────────────────────────────────┐
│  ☰  MENU                          │
│                                   │
│  [BOOK APPOINTMENT]               │
│                                   │
│  LOCATIONS ▾                      │
│                                   │
│  SERVICES ▾                       │
│                                   │
│  ABOUT US                         │
│                                   │
│  WHO IT'S FOR                     │
│                                   │
│  WHY MIBO                         │
│                                   │
│  EXPERTS ▾  ← Tap to expand       │
│                                   │
│  BLOG                             │
└───────────────────────────────────┘
```

### Expanded State (Mobile)

```
┌───────────────────────────────────────────────────────┐
│  EXPERTS ▾  ← Expanded                                │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🧠  Clinical Psychologists                     │ │
│  │     Find safe, compassionate care for your      │ │
│  │     mental health journey.                      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  💊  Psychiatrists                              │ │
│  │     Expert medical care for advanced mental     │ │
│  │     health conditions.                          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  BLOG                                                 │
└───────────────────────────────────────────────────────┘
```

---

## Color Scheme

### Desktop Dropdown

- **Background**: White (`#FFFFFF`)
- **Border**: Light gray (`#E5E7EB`)
- **Shadow**: Extra large (`shadow-xl`)
- **Icon color**: Teal (`#34b9a5`)
- **Title text**: Dark gray (`#1F2937`)
- **Subtitle text**: Medium gray (`#4B5563`)

### Hover State

- **Background**: Light green (`#F0FDF4`)
- **Icon**: Scales to 110% with transition
- **Title text**: Teal (`#34b9a5`)

### Mobile Dropdown

- **Background**: Semi-transparent white (`rgba(255, 255, 255, 0.5)`)
- **Hover/Active**: More opaque white (`rgba(255, 255, 255, 0.7)`)
- **Rounded corners**: 8px (`rounded-lg`)

---

## Icons Used

### Brain Icon 🧠

- **Used for**: Clinical Psychologists
- **Size**: 20px (desktop), 16px (mobile)
- **Color**: Teal (`#34b9a5`)
- **Source**: lucide-react library

### Pill Icon 💊

- **Used for**: Psychiatrists
- **Size**: 20px (desktop), 16px (mobile)
- **Color**: Teal (`#34b9a5`)
- **Source**: lucide-react library

---

## Text Content

### Option 1: Clinical Psychologists

```
Title: Clinical Psychologists
Subtitle: Find safe, compassionate care for your mental health journey.
```

### Option 2: Psychiatrists

```
Title: Psychiatrists
Subtitle: Expert medical care for advanced mental health conditions.
```

---

## Dimensions

### Desktop Dropdown

- **Width**: 320px (20rem)
- **Padding**: 12px vertical, 16px horizontal
- **Item padding**: 12px vertical, 16px horizontal
- **Icon size**: 20px × 20px
- **Gap between icon and text**: 12px

### Mobile Dropdown

- **Width**: Full width of menu
- **Padding**: 8px vertical, 12px horizontal
- **Item padding**: 8px vertical, 12px horizontal
- **Icon size**: 16px × 16px
- **Gap between icon and text**: 8px
- **Gap between items**: 8px

---

## Animation Details

### Desktop

1. **Dropdown appearance**: Instant (no fade-in delay)
2. **Hover transition**: 200ms ease
3. **Icon scale**: From 1.0 to 1.1 on hover
4. **Text color change**: 200ms transition
5. **Background color**: 200ms transition

### Mobile

1. **Dropdown expand/collapse**: Smooth accordion animation
2. **Background color change**: Instant on tap
3. **Touch feedback**: Background opacity change

---

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between header items
- **Enter/Space**: Open dropdown (desktop)
- **Escape**: Close dropdown (desktop)
- **Tab**: Move through dropdown options
- **Enter**: Select option

### Screen Readers

- Dropdown announces as "EXPERTS, menu"
- Options announce with full text including subtitles
- Icon decorative only (aria-hidden)

### Focus States

- Clear focus outline on dropdown trigger
- Focus visible on each option
- Focus returns to trigger after closing

---

## Responsive Breakpoints

### Desktop (lg: 1024px and up)

- Dropdown shows on hover
- Positioned absolutely below the nav item
- Shows all content side by side

### Mobile (below 1024px)

- Dropdown shows in hamburger menu
- Toggle on click/tap
- Stacked layout with full-width items

---

## User Experience Notes

1. **Quick Access**: Users can access specialized clinician lists in 1 click
2. **Clear Differentiation**: Icons and subtitles help users understand the difference
3. **Consistent Pattern**: Follows the same dropdown pattern as LOCATIONS and SERVICES
4. **Mobile-Friendly**: Easy to tap on mobile devices with sufficient touch target size
5. **Visual Feedback**: Hover and active states provide clear interaction feedback

---

## Technical Implementation

### State Management

```typescript
const [expertsOpen, setExpertsOpen] = useState(false); // Desktop
const [mobileExpertsOpen, setMobileExpertsOpen] = useState(false); // Mobile
```

### Filter Storage

```typescript
sessionStorage.setItem("expertsFilter", "Clinical Psychologist");
// or
sessionStorage.setItem("expertsFilter", "Psychiatrist");
```

### Filter Application

```typescript
const savedFilter = sessionStorage.getItem("expertsFilter");
if (savedFilter === "Clinical Psychologist") {
  setSelectedCategory("Clinical Psychologists");
} else if (savedFilter === "Psychiatrist") {
  setSelectedCategory("Psychiatrists");
}
sessionStorage.removeItem("expertsFilter");
```

---

## Preview URLs (After Deployment)

To test the feature:

1. Visit: `https://your-domain.com`
2. Desktop: Hover over "EXPERTS ▾" in header
3. Mobile: Tap hamburger menu, then tap "EXPERTS ▾"
4. Click either option
5. Verify you're redirected to `/experts` with appropriate filter applied
