# Landing Pages Documentation - Enhanced Version

## Overview

Two premium landing pages with enhanced content, elegant graphics, and faded background images for Mibo Mental Health centres in Kochi and Bangalore.

## URLs

- **Kochi Landing Page**: `https://mibo.care/kochi` or `http://localhost:5173/kochi`
- **Bangalore Landing Page**: `https://mibo.care/bangalore` or `http://localhost:5173/bangalore`

## New Features Added

### 1. Enhanced Hero Section

- ✅ **Faded background image** (8% opacity) showing centre location
- ✅ **Animated decorative circles** with blur effects and pulse animation
- ✅ **Gradient overlays** for depth and visual appeal
- ✅ Premium look with layered design elements

### 2. More Content Sections

- ✅ **Mental Health Concerns** section (8-12 concern cards)
- ✅ **Who It's For** section (Individuals, Couples, Families)
- ✅ **How to Get Started** section (3-step process)
- ✅ **Enhanced Services** (5 services instead of 3-4)
- ✅ **More Features** (4 feature cards with detailed descriptions)
- ✅ **Testimonials** (Bangalore only - 3 patient reviews)

### 3. Real Contact Details

- ✅ **Phone**: +91 90833 35000 (for calls and WhatsApp)
- ✅ **Email**: reach@mibocare.com
- ✅ **Kochi Address**: 38/1818, Kannanthodath Road, Near Changampuzha Park Metro Station, Edappally P.O., Kochi, Ernakulam, PIN: 682024
- ✅ **Bangalore Address**: 22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041

### 4. Premium Design Elements

- ✅ Full-page design (no header)
- ✅ Mibo color scheme (miboGreen, miboAccent, miboLightGreen)
- ✅ Elegant icons from Lucide React
- ✅ Cards with shadows and hover effects
- ✅ Scrollable service cards
- ✅ Catchy Quicksand font
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile-first)

### 5. Contact Features

- ✅ **Phone Button**: Floating action button (bottom-right)
  - Phone number: 9083335000
  - Clicking opens phone dialer on device
- ✅ **WhatsApp Button**: Floating action button (bottom-right)
  - Phone number: 9083335000
  - Clicking opens WhatsApp chat

### 6. Google Tag Manager

- ✅ GTM tracking enabled (GTM-MMZM7LR2)
- ✅ Tracks page views automatically
- ✅ Same GTM container as main site

## Page Sections

### Kochi Landing Page (9 Sections)

1. **Hero Section**:
   - Faded background image of Kochi centre
   - Animated decorative circles
   - Logo, heading, description
   - CTA buttons (Call & WhatsApp)

2. **Features Section**:
   - 4 feature cards with icons
   - Expert Professionals, Flexible Timings, Prime Location, Proven Results

3. **Services Section**:
   - 5 scrollable service cards
   - Individual Therapy, Group Sessions, Family Therapy, Online Counseling, In-Person Sessions

4. **Mental Health Concerns**:
   - 8 concern cards
   - Anxiety, Depression, Relationship Issues, Work-Life Balance, Trauma, Self-Esteem, Addiction, Sleep Disorders

5. **Who It's For**:
   - 3 cards with images
   - Individuals, Couples, Families

6. **Location Section**:
   - Kochi centre image
   - Full contact details (address, phone, email)

7. **How to Get Started**:
   - 3-step process
   - Call/WhatsApp → Book Appointment → Start Journey

8. **CTA Section**:
   - Call-to-action with phone and WhatsApp buttons

9. **Footer**:
   - Logo, contact info, address, copyright

### Bangalore Landing Page (10 Sections)

1. **Hero Section**:
   - Faded background image of Bangalore centre
   - Animated decorative circles
   - Logo, heading, description
   - CTA buttons (Call & WhatsApp)

2. **Features Section**:
   - 4 feature cards with icons
   - Certified Experts, 24/7 Support, Central Location, Proven Results

3. **Services Section**:
   - 5 scrollable service cards
   - Individual Counseling, Group Therapy, Family Counseling, Online Sessions, In-Person Therapy

4. **Mental Health Concerns**:
   - 12 concern cards
   - Anxiety, Depression, Relationship Counseling, Work Stress, Trauma, Self-Esteem, Addiction, Sleep Disorders, OCD, Grief, Anger Management, Life Transitions

5. **Testimonials Section**:
   - 3 patient testimonials with 5-star ratings
   - Real patient feedback

6. **Who It's For**:
   - 3 cards with images
   - Individuals, Couples, Families

7. **Location Section**:
   - Bangalore centre image
   - Full contact details (address, phone, email)

8. **How to Get Started**:
   - 3-step process
   - Call/WhatsApp → Book Appointment → Start Journey

9. **CTA Section**:
   - Call-to-action with phone and WhatsApp buttons

10. **Footer**:
    - Logo, contact info, address, copyright

## Color Scheme

- **Primary Green**: `#1B4332` (miboGreen)
- **Accent Green**: `#52B788` (miboAccent)
- **Light Green**: `#D8F3DC` (miboLightGreen)
- **Dark**: `#081C15` (miboDark)
- **Text**: `#2D2D2D` (miboText)

## Assets Used

- Logo: `logo1.png`
- Kochi Centre: `mibo_kochi.jpg`
- Bangalore Centre: `mibo_bangalore.jpg`
- Individual Therapy: `individual_therapy.jpg`
- Group Session: `group_session.jpg`
- Family Therapy: `famlily_therapy.jpg`
- Online Session: `online.jpg`
- In-Person: `In-person.jpg`
- Who It's For: `whoitsfor1.png`, `whoitsfor2.png`, `whoitsfor3.png`

## Technical Details

### File Locations

- Kochi: `src/pages/Landing/KochiLanding.tsx`
- Bangalore: `src/pages/Landing/BangaloreLanding.tsx`

### Routes Added

```typescript
<Route path="/kochi" element={<KochiLanding />} />
<Route path="/bangalore" element={<BangaloreLanding />} />
```

### Phone Functionality

```typescript
const handlePhoneClick = () => {
  window.location.href = `tel:9083335000`;
};
```

### WhatsApp Functionality

```typescript
const handleWhatsAppClick = () => {
  window.open(`https://wa.me/919083335000`, "_blank");
};
```

## Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop optimized
- ✅ Touch-friendly buttons
- ✅ Smooth scrolling

## Animations

- ✅ Fade-in animations on hero section
- ✅ Hover effects on cards
- ✅ Scale transitions on buttons
- ✅ Smooth scroll for service cards
- ✅ Pulse animation on floating buttons
- ✅ Animated decorative circles in hero

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

- [ ] Test phone button on mobile device
- [ ] Test WhatsApp button on mobile device
- [ ] Test phone button on desktop
- [ ] Test WhatsApp button on desktop
- [ ] Verify GTM tracking in Google Analytics
- [ ] Test responsive design on different screen sizes
- [ ] Test all animations and transitions
- [ ] Verify all images load correctly
- [ ] Test scrollable service cards
- [ ] Verify faded background images in hero section
- [ ] Test all contact details (phone, email, address)

## Deployment

1. Build the project: `npm run build`
2. Deploy to Vercel or your hosting platform
3. Verify URLs work: `mibo.care/kochi` and `mibo.care/bangalore`
4. Test phone and WhatsApp buttons on live site
5. Verify GTM tracking in Google Analytics
6. Test all sections and content

## Content Highlights

### Kochi Page

- Emphasizes Kerala's serene environment
- Focus on personalized care
- Highlights metro accessibility
- 8 mental health concerns covered

### Bangalore Page

- Emphasizes Silicon Valley location
- Focus on 24/7 support
- Highlights Jayanagar location
- 12 mental health concerns covered
- Includes patient testimonials

## Notes

- No header/navigation on these pages (as requested)
- Full-page premium design
- Floating action buttons always visible
- Optimized for conversions (multiple CTAs)
- Fast loading with optimized images
- Real contact details from Mibo frontend
- Faded background images for elegant look
- More content sections for better engagement

---

**Created**: March 15, 2024  
**Updated**: March 15, 2024 (Enhanced Version)  
**Version**: 2.0.0
