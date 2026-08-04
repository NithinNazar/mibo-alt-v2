/**
 * Small set of helpers for working with YouTube URLs on the Expert card.
 * Supports watch?v=, youtu.be/, and embed/ style links.
 */

export function getYouTubeId(url?: string): string | null {
  if (!url) return null;

  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url?: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  // maxresdefault isn't guaranteed to exist for every video; hqdefault always does.
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(url?: string, autoplay = true): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}