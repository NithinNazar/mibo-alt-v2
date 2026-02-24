# Video Optimization Guide

## Current Videos

Based on your assets, you have:

- `home_video.mp4`
- `mental-wellness.mp4`
- `therapy and psychatry.mp4`

These videos can consume significant bandwidth!

---

## Video Optimization Strategies

### Strategy 1: Compress Videos (Recommended)

Use FFmpeg to compress videos before adding to project:

```bash
# Install FFmpeg (if not installed)
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Compress video (reduce size by 70-80%)
ffmpeg -i input.mp4 -vcodec h264 -crf 28 -preset slow output.mp4

# For web-optimized video
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -vf scale=1280:-2 \
  output.mp4
```

**Parameters**:

- `-crf 28`: Quality (18-28 recommended, higher = smaller file)
- `-preset slow`: Better compression (takes longer)
- `-movflags +faststart`: Optimize for web streaming
- `-vf scale=1280:-2`: Resize to 1280px width

---

### Strategy 2: Use Poster Images

Show a static image until user clicks play:

```typescript
import homeVideo from "../assets/home_video.mp4";
import videoPoster from "../assets/home_video_poster.jpg?w=1200&format=webp&quality=75";

<video
  poster={videoPoster}  // Show image until play
  preload="none"        // Don't download until needed
  controls
>
  <source src={homeVideo} type="video/mp4" />
</video>
```

**Benefits**:

- Video only downloads when user clicks play
- Saves bandwidth for users who don't watch
- Faster initial page load

---

### Strategy 3: Lazy Load Videos

Only load videos when they come into view:

```typescript
import { useEffect, useRef, useState } from "react";

function LazyVideo({ src, poster }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoaded) {
          setIsLoaded(true);
        }
      },
      { threshold: 0.25 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      preload="none"
      controls
    >
      {isLoaded && <source src={src} type="video/mp4" />}
    </video>
  );
}
```

---

### Strategy 4: Use YouTube/Vimeo Embedding

Instead of hosting videos, embed from YouTube:

```typescript
function VideoEmbed({ videoId }) {
  return (
    <div className="aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
```

**Benefits**:

- No bandwidth cost for you
- YouTube handles optimization
- Better streaming performance
- CDN delivery worldwide

---

### Strategy 5: Adaptive Streaming (Advanced)

For large videos, use HLS or DASH:

```bash
# Convert to HLS format
ffmpeg -i input.mp4 \
  -codec: copy \
  -start_number 0 \
  -hls_time 10 \
  -hls_list_size 0 \
  -f hls \
  output.m3u8
```

Then use a player like Video.js:

```typescript
import videojs from 'video.js';

<video
  id="my-video"
  className="video-js"
  controls
  preload="auto"
  data-setup='{}'
>
  <source src="video.m3u8" type="application/x-mpegURL" />
</video>
```

---

## Recommended Approach for Your Project

### For `home_video.mp4` (Header/Hero):

**Option A: Compress + Poster** (Recommended)

```typescript
import homeVideo from "../assets/home_video.mp4";
import videoPoster from "../assets/home_video_poster.jpg?w=1200&format=webp&quality=75";

<video
  poster={videoPoster}
  preload="none"
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
>
  <source src={homeVideo} type="video/mp4" />
</video>
```

**Option B: Replace with Animated Image**

```typescript
// Use a high-quality animated WebP or GIF instead
import heroAnimation from "../assets/hero_animation.webp";

<img src={heroAnimation} alt="Hero" className="w-full" />
```

---

### For `mental-wellness.mp4` and `therapy and psychatry.mp4`:

**Option A: YouTube Embed** (Best)

```typescript
<VideoEmbed videoId="YOUR_YOUTUBE_ID" />
```

**Option B: Lazy Load + Compress**

```typescript
<LazyVideo
  src={mentalWellnessVideo}
  poster={mentalWellnessPoster}
/>
```

---

## Video Compression Commands

### Compress for Web (High Quality):

```bash
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -crf 23 \
  -preset slow \
  -movflags +faststart \
  -vf scale=1280:-2 \
  output.mp4
```

### Compress for Web (Balanced):

```bash
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -vf scale=1280:-2 \
  output.mp4
```

### Compress for Web (Small Size):

```bash
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -crf 32 \
  -preset slow \
  -movflags +faststart \
  -vf scale=854:-2 \
  output.mp4
```

### Create Poster Image:

```bash
# Extract frame at 5 seconds
ffmpeg -i input.mp4 -ss 00:00:05 -vframes 1 poster.jpg
```

---

## Expected Savings

### Before Optimization:

- 3 videos × 10MB = 30MB
- 1000 page views = 30GB bandwidth
- Cost: 30GB × $0.09 = $2.70/day = $81/month

### After Optimization (Compressed):

- 3 videos × 2MB = 6MB (80% reduction)
- 1000 page views = 6GB bandwidth
- Cost: 6GB × $0.09 = $0.54/day = $16.20/month
- **Savings: $64.80/month = $777.60/year**

### After Optimization (YouTube):

- 0MB (hosted on YouTube)
- Cost: $0
- **Savings: $81/month = $972/year**

---

## Implementation Checklist

### Videos:

- [ ] Compress `home_video.mp4` (or replace with image)
- [ ] Upload `mental-wellness.mp4` to YouTube
- [ ] Upload `therapy and psychatry.mp4` to YouTube
- [ ] Create poster images for all videos
- [ ] Implement lazy loading
- [ ] Add `preload="none"` to all videos
- [ ] Test video playback
- [ ] Monitor bandwidth usage

---

## Best Practices

### 1. Always Use Poster Images

```typescript
<video poster={posterImage} preload="none">
```

### 2. Don't Autoplay with Sound

```typescript
<video muted autoplay loop playsInline>
```

### 3. Provide Multiple Formats

```typescript
<video>
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

### 4. Use Appropriate Dimensions

- Mobile: 640px width
- Tablet: 1024px width
- Desktop: 1280px width

### 5. Optimize for Streaming

```bash
-movflags +faststart
```

---

## Tools

### Compression:

- [FFmpeg](https://ffmpeg.org/) - Command line tool
- [HandBrake](https://handbrake.fr/) - GUI tool
- [CloudConvert](https://cloudconvert.com/) - Online tool

### Hosting:

- [YouTube](https://youtube.com/) - Free, unlimited
- [Vimeo](https://vimeo.com/) - Professional
- [AWS S3](https://aws.amazon.com/s3/) - Self-hosted

### Testing:

- [WebPageTest](https://www.webpagetest.org/) - Test load times
- [GTmetrix](https://gtmetrix.com/) - Performance analysis

---

## Summary

### Recommended Actions:

1. **Compress all videos** using FFmpeg (80% size reduction)
2. **Create poster images** for all videos
3. **Add `preload="none"`** to prevent auto-download
4. **Consider YouTube** for long videos
5. **Implement lazy loading** for below-fold videos

### Expected Results:

- **80-90% video bandwidth reduction**
- **$777-972/year savings** (depending on approach)
- **Faster page loads**
- **Better user experience**

---

**Combined Savings (Images + Videos)**:

- Images: $459/year
- Videos: $777/year
- **Total: $1,236/year savings!**

Plus significantly faster page loads and better user experience!
