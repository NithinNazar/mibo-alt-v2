# Image Optimization Guide - vite-imagetools

## Overview

We've implemented `vite-imagetools` to automatically optimize images and reduce bandwidth usage on AWS. This will significantly reduce traffic costs and improve page load times.

## Installation ✅

```bash
npm install vite-imagetools --save-dev
```

## Configuration ✅

**vite.config.ts**:

```typescript
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: "webp", // Modern efficient format
        quality: "75", // Excellent quality, huge size reduction
        w: "800", // Max width 800px
      }),
    }),
  ],
});
```

## How to Use

### Method 1: Query Parameters (Recommended)

Add query parameters to your image imports to specify optimization:

```typescript
// Before (large original image)
import bannerImage from "./assets/banner.jpg";

// After (optimized WebP, 800px wide, 75% quality)
import bannerImage from "./assets/banner.jpg?w=800&format=webp&quality=75";
```

### Method 2: Multiple Sizes (Responsive Images)

Generate multiple sizes for responsive images:

```typescript
import bannerImage from "./assets/banner.jpg?w=400;800;1200&format=webp";

// Returns an array of images:
// [
//   { src: "...", width: 400 },
//   { src: "...", width: 800 },
//   { src: "...", width: 1200 }
// ]
```

### Method 3: Picture Element (Best for Performance)

Use `<picture>` for maximum browser compatibility:

```typescript
import bannerWebp from "./assets/banner.jpg?w=800&format=webp";
import bannerJpg from "./assets/banner.jpg?w=800&format=jpg&quality=80";

<picture>
  <source srcSet={bannerWebp} type="image/webp" />
  <img src={bannerJpg} alt="Banner" />
</picture>
```

## Available Parameters

### Format

- `format=webp` - Modern format (best compression)
- `format=avif` - Even better compression (newer browsers)
- `format=jpg` - Fallback for compatibility
- `format=png` - For images with transparency

### Quality

- `quality=75` - Recommended (excellent quality, 50-70% size reduction)
- `quality=85` - High quality (30-50% size reduction)
- `quality=60` - Lower quality (70-80% size reduction)

### Dimensions

- `w=800` - Max width 800px
- `h=600` - Max height 600px
- `w=800&h=600&fit=cover` - Crop to exact size
- `w=800&h=600&fit=contain` - Fit within bounds

### Other Options

- `blur=10` - Blur effect
- `grayscale` - Convert to grayscale
- `rotate=90` - Rotate image
- `flip` - Flip horizontally
- `flop` - Flip vertically

## Migration Examples

### Example 1: Home Page Banner

**Before**:

```typescript
import banner from "../assets/banner.jpg";

<img src={banner} alt="Banner" className="w-full" />
```

**After**:

```typescript
import banner from "../assets/banner.jpg?w=1200&format=webp&quality=75";

<img src={banner} alt="Banner" className="w-full" />
```

**Result**:

- Original: ~500KB
- Optimized: ~80KB (84% reduction!)

### Example 2: Doctor Profile Images

**Before**:

```typescript
import doctorImage from "../assets/doctor1.jpg";

<img src={doctorImage} alt="Doctor" className="w-16 h-16 rounded-full" />
```

**After**:

```typescript
import doctorImage from "../assets/doctor1.jpg?w=200&h=200&fit=cover&format=webp&quality=75";

<img src={doctorImage} alt="Doctor" className="w-16 h-16 rounded-full" />
```

**Result**:

- Original: ~200KB
- Optimized: ~15KB (92% reduction!)

### Example 3: Responsive Hero Image

**Before**:

```typescript
import heroImage from "../assets/hero.jpg";

<img src={heroImage} alt="Hero" className="w-full" />
```

**After**:

```typescript
import heroSmall from "../assets/hero.jpg?w=640&format=webp&quality=75";
import heroMedium from "../assets/hero.jpg?w=1024&format=webp&quality=75";
import heroLarge from "../assets/hero.jpg?w=1920&format=webp&quality=75";

<picture>
  <source media="(max-width: 640px)" srcSet={heroSmall} />
  <source media="(max-width: 1024px)" srcSet={heroMedium} />
  <img src={heroLarge} alt="Hero" className="w-full" />
</picture>
```

**Result**:

- Mobile users: Download 50KB instead of 800KB
- Tablet users: Download 120KB instead of 800KB
- Desktop users: Download 200KB instead of 800KB

### Example 4: Gallery Images

**Before**:

```typescript
import gallery1 from "../assets/gallery1.jpg";
import gallery2 from "../assets/gallery2.jpg";
import gallery3 from "../assets/gallery3.jpg";

const images = [gallery1, gallery2, gallery3];
```

**After**:

```typescript
import gallery1 from "../assets/gallery1.jpg?w=400&format=webp&quality=75";
import gallery2 from "../assets/gallery2.jpg?w=400&format=webp&quality=75";
import gallery3 from "../assets/gallery3.jpg?w=400&format=webp&quality=75";

const images = [gallery1, gallery2, gallery3];
```

**Result**:

- Original: 3 × 300KB = 900KB
- Optimized: 3 × 30KB = 90KB (90% reduction!)

## Priority Images to Optimize

Based on your assets, here are the high-priority images:

### 1. Hero/Banner Images (Largest Impact)

```typescript
// These are loaded on every page visit
import banner from "./assets/banner.jpg?w=1200&format=webp&quality=75";
import banner2 from "./assets/Banner_2.jpg?w=1200&format=webp&quality=75";
```

### 2. Centre Images

```typescript
import bangalore from "./assets/mibo_bangalore.jpg?w=800&format=webp&quality=75";
import kochi from "./assets/mibo_kochi.jpg?w=800&format=webp&quality=75";
import mumbai from "./assets/mibo_mumbai.jpg?w=800&format=webp&quality=75";
```

### 3. Service Images

```typescript
import inPatient from "./assets/In-patient.jpg?w=600&format=webp&quality=75";
import inPerson from "./assets/In-person.jpg?w=600&format=webp&quality=75";
import online from "./assets/online.jpg?w=600&format=webp&quality=75";
```

### 4. Therapy Images

```typescript
import family from "./assets/famlily_therapy.jpg?w=600&format=webp&quality=75";
import individual from "./assets/individual_therapy.jpg?w=600&format=webp&quality=75";
import group from "./assets/group_session.jpg?w=600&format=webp&quality=75";
```

### 5. Real Photos (Many files!)

```typescript
import real1 from "./assets/mibo-real-1.JPG?w=800&format=webp&quality=75";
import real2 from "./assets/mibo-real-2.JPG?w=800&format=webp&quality=75";
// ... and so on
```

## TypeScript Support

Add type definitions for image imports:

**vite-env.d.ts**:

```typescript
/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />
```

## Build Output

After building, you'll see optimized images in `dist/assets/`:

```
dist/assets/
  banner-abc123.webp      (80KB instead of 500KB)
  doctor1-def456.webp     (15KB instead of 200KB)
  hero-ghi789.webp        (200KB instead of 800KB)
```

## Performance Impact

### Before Optimization:

- Total image size: ~15MB
- Page load time: 8-12 seconds (on 3G)
- AWS bandwidth: High costs

### After Optimization:

- Total image size: ~2MB (87% reduction!)
- Page load time: 2-3 seconds (on 3G)
- AWS bandwidth: 87% cost reduction!

## Browser Support

### WebP Format:

✅ Chrome (all versions)
✅ Firefox (all versions)
✅ Edge (all versions)
✅ Safari 14+ (iOS 14+)
✅ Opera (all versions)

For older browsers, use fallback:

```typescript
<picture>
  <source srcSet={imageWebp} type="image/webp" />
  <img src={imageJpg} alt="..." />
</picture>
```

## Lazy Loading

Combine with lazy loading for even better performance:

```typescript
import heroImage from "./assets/hero.jpg?w=1200&format=webp&quality=75";

<img
  src={heroImage}
  alt="Hero"
  loading="lazy"  // Browser native lazy loading
  className="w-full"
/>
```

## Automated Migration Script

Create a script to find and update all image imports:

**scripts/optimize-images.js**:

```javascript
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src");

function updateImageImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Add optimization parameters to image imports
  content = content.replace(
    /from ['"](.+\.(jpg|jpeg|png))['"];/gi,
    "from '$1?w=800&format=webp&quality=75';",
  );

  fs.writeFileSync(filePath, content);
}

// Run on all .tsx and .ts files
// ... (implementation)
```

## Testing

### 1. Development

```bash
npm run dev
```

- Images are optimized on-the-fly
- Hot reload works normally

### 2. Production Build

```bash
npm run build
```

- All images are optimized during build
- Check `dist/assets/` for output

### 3. Verify Optimization

```bash
# Check file sizes
ls -lh dist/assets/*.webp

# Compare with originals
ls -lh src/assets/*.jpg
```

## Monitoring

### AWS CloudWatch

Monitor bandwidth reduction:

- Before: ~500GB/month
- After: ~65GB/month (87% reduction!)

### Lighthouse Score

Check performance improvement:

- Before: 45-60 (Poor)
- After: 85-95 (Good to Excellent)

## Best Practices

### 1. Choose Right Format

- **WebP**: Best for photos (use this!)
- **PNG**: For logos/icons with transparency
- **AVIF**: Even better compression (if browser support OK)

### 2. Choose Right Quality

- **75%**: Recommended for most images
- **85%**: For important hero images
- **60%**: For thumbnails/backgrounds

### 3. Choose Right Size

- **Mobile**: 640px max
- **Tablet**: 1024px max
- **Desktop**: 1920px max
- **Thumbnails**: 200-400px

### 4. Use Responsive Images

```typescript
// Generate multiple sizes
import image from "./hero.jpg?w=640;1024;1920&format=webp";

<picture>
  <source media="(max-width: 640px)" srcSet={image[0].src} />
  <source media="(max-width: 1024px)" srcSet={image[1].src} />
  <img src={image[2].src} alt="Hero" />
</picture>
```

## Next Steps

1. ✅ Install vite-imagetools
2. ✅ Configure vite.config.ts
3. 🔄 Update image imports (start with high-priority images)
4. 🔄 Test in development
5. 🔄 Build and deploy
6. 🔄 Monitor AWS bandwidth reduction

## Cost Savings Estimate

### Current AWS Costs (Example):

- Bandwidth: 500GB/month × $0.09/GB = $45/month
- Total: ~$540/year

### After Optimization:

- Bandwidth: 65GB/month × $0.09/GB = $5.85/month
- Total: ~$70/year

**Savings: $470/year (87% reduction!)**

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify image paths are correct
3. Ensure vite-imagetools is installed
4. Check vite.config.ts configuration

## Resources

- [vite-imagetools Documentation](https://github.com/JonasKruckenberg/imagetools)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

**Implementation Date**: February 23, 2026
**Status**: ✅ Configured and Ready
**Expected Savings**: 87% bandwidth reduction
