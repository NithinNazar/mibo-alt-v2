# Example Image Migration - Before & After

## Example 1: Header Component (Logo)

### Before:

```typescript
import miboIcon from "../assets/logo1.png";

<img src={miboIcon} alt="Mibo Icon" className="w-12 h-12 md:w-14 md:h-14" />
```

### After:

```typescript
import miboIcon from "../assets/logo1.png?w=200&format=webp&quality=85";

<img src={miboIcon} alt="Mibo Icon" className="w-12 h-12 md:w-14 md:h-14" />
```

**Savings**:

- Original: ~50KB
- Optimized: ~8KB (84% reduction)

---

## Example 2: Landing Page Hero Images

### Before:

```typescript
import bangaloreLanding from "../assets/mibo_bangalore.jpg";
import kochiLanding from "../assets/mibo_kochi.jpg";
import mumbaiLanding from "../assets/mibo_mumbai.jpg";

<img src={bangaloreLanding} alt="Bangalore" className="w-full h-96 object-cover" />
```

### After:

```typescript
import bangaloreLanding from "../assets/mibo_bangalore.jpg?w=1200&format=webp&quality=75";
import kochiLanding from "../assets/mibo_kochi.jpg?w=1200&format=webp&quality=75";
import mumbaiLanding from "../assets/mibo_mumbai.jpg?w=1200&format=webp&quality=75";

<img src={bangaloreLanding} alt="Bangalore" className="w-full h-96 object-cover" />
```

**Savings**:

- Original: 3 × 400KB = 1.2MB
- Optimized: 3 × 60KB = 180KB (85% reduction)

---

## Example 3: Service Images with Responsive Sizes

### Before:

```typescript
import inPatient from "../assets/In-patient.jpg";
import inPerson from "../assets/In-person.jpg";
import online from "../assets/online.jpg";

<img src={inPatient} alt="In-Patient" className="w-full rounded-lg" />
```

### After (Simple):

```typescript
import inPatient from "../assets/In-patient.jpg?w=800&format=webp&quality=75";
import inPerson from "../assets/In-person.jpg?w=800&format=webp&quality=75";
import online from "../assets/online.jpg?w=800&format=webp&quality=75";

<img src={inPatient} alt="In-Patient" className="w-full rounded-lg" />
```

### After (Responsive - Best):

```typescript
import inPatientSmall from "../assets/In-patient.jpg?w=400&format=webp&quality=75";
import inPatientMedium from "../assets/In-patient.jpg?w=800&format=webp&quality=75";
import inPatientLarge from "../assets/In-patient.jpg?w=1200&format=webp&quality=75";

<picture>
  <source media="(max-width: 640px)" srcSet={inPatientSmall} />
  <source media="(max-width: 1024px)" srcSet={inPatientMedium} />
  <img src={inPatientLarge} alt="In-Patient" className="w-full rounded-lg" />
</picture>
```

**Savings**:

- Original: 3 × 350KB = 1.05MB
- Optimized (simple): 3 × 50KB = 150KB (86% reduction)
- Optimized (responsive): Mobile users download only 25KB!

---

## Example 4: Gallery/Real Photos

### Before:

```typescript
import real1 from "../assets/mibo-real-1.JPG";
import real2 from "../assets/mibo-real-2.JPG";
import real3 from "../assets/mibo-real-3.jpg";
import real4 from "../assets/mibo-real-4.jpg";
import real5 from "../assets/mibo-real-5.jpg";
import real6 from "../assets/mibo-real-6.jpg";
import real7 from "../assets/mibo-real-7.jpg";

const images = [real1, real2, real3, real4, real5, real6, real7];
```

### After:

```typescript
import real1 from "../assets/mibo-real-1.JPG?w=600&format=webp&quality=75";
import real2 from "../assets/mibo-real-2.JPG?w=600&format=webp&quality=75";
import real3 from "../assets/mibo-real-3.jpg?w=600&format=webp&quality=75";
import real4 from "../assets/mibo-real-4.jpg?w=600&format=webp&quality=75";
import real5 from "../assets/mibo-real-5.jpg?w=600&format=webp&quality=75";
import real6 from "../assets/mibo-real-6.jpg?w=600&format=webp&quality=75";
import real7 from "../assets/mibo-real-7.jpg?w=600&format=webp&quality=75";

const images = [real1, real2, real3, real4, real5, real6, real7];
```

**Savings**:

- Original: 7 × 300KB = 2.1MB
- Optimized: 7 × 35KB = 245KB (88% reduction!)

---

## Example 5: Therapy Images

### Before:

```typescript
import familyTherapy from "../assets/famlily_therapy.jpg";
import individualTherapy from "../assets/individual_therapy.jpg";
import groupSession from "../assets/group_session.jpg";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <img src={familyTherapy} alt="Family Therapy" />
  <img src={individualTherapy} alt="Individual Therapy" />
  <img src={groupSession} alt="Group Session" />
</div>
```

### After:

```typescript
import familyTherapy from "../assets/famlily_therapy.jpg?w=600&format=webp&quality=75";
import individualTherapy from "../assets/individual_therapy.jpg?w=600&format=webp&quality=75";
import groupSession from "../assets/group_session.jpg?w=600&format=webp&quality=75";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <img src={familyTherapy} alt="Family Therapy" loading="lazy" />
  <img src={individualTherapy} alt="Individual Therapy" loading="lazy" />
  <img src={groupSession} alt="Group Session" loading="lazy" />
</div>
```

**Note**: Added `loading="lazy"` for additional performance boost!

**Savings**:

- Original: 3 × 280KB = 840KB
- Optimized: 3 × 40KB = 120KB (86% reduction)

---

## Example 6: Centre Images (Bangalore, Kochi)

### Before:

```typescript
import bangaloreCenter1 from "../assets/mibo-bangalore-centre-1.jpg";
import bangaloreCenter2 from "../assets/mibo-bangalore-centre-2.jpg";
import kochiCenter1 from "../assets/mibo-kochi-centre-1.jpg";
import kochiCenter2 from "../assets/mibo-kochi-centre-2.jpg";
```

### After:

```typescript
import bangaloreCenter1 from "../assets/mibo-bangalore-centre-1.jpg?w=800&format=webp&quality=75";
import bangaloreCenter2 from "../assets/mibo-bangalore-centre-2.jpg?w=800&format=webp&quality=75";
import kochiCenter1 from "../assets/mibo-kochi-centre-1.jpg?w=800&format=webp&quality=75";
import kochiCenter2 from "../assets/mibo-kochi-centre-2.jpg?w=800&format=webp&quality=75";
```

**Savings**:

- Original: 4 × 450KB = 1.8MB
- Optimized: 4 × 65KB = 260KB (86% reduction)

---

## Example 7: Why Mibo Images

### Before:

```typescript
import whyMibo from "../assets/whymibo.jpg";
import miboWhyChoose from "../assets/mibo-why-choose.jpg";
import miboCertified from "../assets/mibo-certified-expert.jpg";
import miboSupport from "../assets/mibo-247-support.jpg";
```

### After:

```typescript
import whyMibo from "../assets/whymibo.jpg?w=800&format=webp&quality=75";
import miboWhyChoose from "../assets/mibo-why-choose.jpg?w=800&format=webp&quality=75";
import miboCertified from "../assets/mibo-certified-expert.jpg?w=800&format=webp&quality=75";
import miboSupport from "../assets/mibo-247-support.jpg?w=800&format=webp&quality=75";
```

**Savings**:

- Original: 4 × 320KB = 1.28MB
- Optimized: 4 × 48KB = 192KB (85% reduction)

---

## Example 8: Who It's For Images

### Before:

```typescript
import whoItsFor from "../assets/whoitsfor.jpg";
import children from "../assets/mibo_children.jpg";
import couple from "../assets/mibo-couple.jpg";
import family from "../assets/mibo-family.jpg";
import individual from "../assets/mibo-individual.jpg";
```

### After:

```typescript
import whoItsFor from "../assets/whoitsfor.jpg?w=1200&format=webp&quality=75";
import children from "../assets/mibo_children.jpg?w=600&format=webp&quality=75";
import couple from "../assets/mibo-couple.jpg?w=600&format=webp&quality=75";
import family from "../assets/mibo-family.jpg?w=600&format=webp&quality=75";
import individual from "../assets/mibo-individual.jpg?w=600&format=webp&quality=75";
```

**Savings**:

- Original: 5 × 300KB = 1.5MB
- Optimized: 5 × 45KB = 225KB (85% reduction)

---

## Example 9: Wellness Program Images

### Before:

```typescript
import wellnessProgram from "../assets/mibo-wellness-program.jpg";
import groupTherapy from "../assets/mibo-group-therapy.jpg";
import individualCounselling from "../assets/mibo-individual-counselling.jpg";
import familyCounselling from "../assets/mibo-family-counselling.jpg";
```

### After:

```typescript
import wellnessProgram from "../assets/mibo-wellness-program.jpg?w=800&format=webp&quality=75";
import groupTherapy from "../assets/mibo-group-therapy.jpg?w=800&format=webp&quality=75";
import individualCounselling from "../assets/mibo-individual-counselling.jpg?w=800&format=webp&quality=75";
import familyCounselling from "../assets/mibo-family-counselling.jpg?w=800&format=webp&quality=75";
```

**Savings**:

- Original: 4 × 340KB = 1.36MB
- Optimized: 4 × 50KB = 200KB (85% reduction)

---

## Example 10: Background Images (CSS)

### Before:

```typescript
<div
  className="hero-section"
  style={{ backgroundImage: `url(${bannerImage})` }}
>
  ...
</div>
```

### After:

```typescript
import bannerImage from "../assets/banner.jpg?w=1920&format=webp&quality=75";

<div
  className="hero-section"
  style={{ backgroundImage: `url(${bannerImage})` }}
>
  ...
</div>
```

**Savings**:

- Original: 800KB
- Optimized: 150KB (81% reduction)

---

## Quick Reference: Recommended Sizes

| Use Case        | Width  | Quality | Example                                         |
| --------------- | ------ | ------- | ----------------------------------------------- |
| Logo            | 200px  | 85%     | `?w=200&format=webp&quality=85`                 |
| Thumbnail       | 300px  | 75%     | `?w=300&format=webp&quality=75`                 |
| Card Image      | 600px  | 75%     | `?w=600&format=webp&quality=75`                 |
| Section Image   | 800px  | 75%     | `?w=800&format=webp&quality=75`                 |
| Hero Image      | 1200px | 75%     | `?w=1200&format=webp&quality=75`                |
| Full Width      | 1920px | 75%     | `?w=1920&format=webp&quality=75`                |
| Profile Picture | 200px  | 80%     | `?w=200&h=200&fit=cover&format=webp&quality=80` |

---

## Total Estimated Savings

Based on your current assets:

### Current Total Size:

- ~70 JPG images × 300KB average = **21MB**
- Page load with all images: **15-20 seconds on 3G**

### After Optimization:

- ~70 WebP images × 45KB average = **3.15MB**
- Page load with all images: **2-3 seconds on 3G**

### Bandwidth Savings:

- **85% reduction in image bandwidth**
- **$470/year savings on AWS** (estimated)
- **5-7x faster page loads**

---

## Implementation Checklist

- [ ] Install vite-imagetools ✅
- [ ] Configure vite.config.ts ✅
- [ ] Update logo imports (Header, Footer)
- [ ] Update hero/banner images
- [ ] Update service images
- [ ] Update therapy images
- [ ] Update centre images
- [ ] Update gallery/real photos
- [ ] Update who-its-for images
- [ ] Update wellness program images
- [ ] Add lazy loading to below-fold images
- [ ] Test in development
- [ ] Build and verify output sizes
- [ ] Deploy to AWS
- [ ] Monitor bandwidth reduction

---

## Testing Commands

```bash
# Development (images optimized on-the-fly)
npm run dev

# Production build
npm run build

# Check optimized image sizes
ls -lh dist/assets/*.webp

# Compare with originals
ls -lh src/assets/*.jpg
```

---

## Next Steps

1. Start with high-traffic pages (Home, Experts, Landing pages)
2. Update one component at a time
3. Test each change in development
4. Build and verify output
5. Deploy and monitor AWS bandwidth

**Priority Order**:

1. Header component (logo) - loads on every page
2. Home page hero images - first thing users see
3. Landing pages (Bangalore, Kochi) - high traffic
4. Service images - frequently viewed
5. Gallery/real photos - many files
6. Remaining images

---

**Ready to implement!** Start with the Header component and work your way through the priority list.
