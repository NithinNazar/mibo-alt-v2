import { useEffect, useRef, useState } from "react";

interface ExpertiseMarqueeProps {
  expertise: string[];
  chipClassName?: string;
  dotClassName?: string;
  className?: string;
}

// Constant scroll speed (px/second) every card should share. The animation's
// *duration* is derived per-card from this so a card with more/longer tags
// (and therefore a wider track) doesn't just move for the same time — it
// moves for longer, at the same visual speed as every other card.
const PIXELS_PER_SECOND = 32;

export default function ExpertiseMarquee({
  expertise,
  chipClassName = "bg-gradient-to-b from-white/80 to-[#a7c4f2]/30 border border-[#a7c4f2]/50 text-[#034B44] shadow-[0_1px_2px_rgba(3,75,68,0.06)]",
  dotClassName = "bg-[#034B44]/40",
  className = "",
}: ExpertiseMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Repeat the list enough times so each half of the loop is wide enough to
  // overflow the container (otherwise short expertise lists leave a visible
  // blank gap before the loop restarts). Duplicate the resulting half so the
  // CSS loop (-50%) is seamless.
  const repeatFactor = Math.max(1, Math.ceil(6 / Math.max(expertise.length, 1)));
  const half = Array.from({ length: repeatFactor }, () => expertise).flat();
  const loopItems = [...half, ...half];

  // Measure the actual rendered width of one "half" of the track (the
  // distance the -50% translateX has to cover) and convert that into a
  // duration that yields a constant px/s speed, regardless of how many tags
  // or how long the tag text is on any given card.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || expertise.length === 0) return;

    const measure = () => {
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0) {
        setDuration(halfWidth / PIXELS_PER_SECOND);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [expertise, repeatFactor]);

  if (expertise.length === 0) return <div className={`mb-3 min-h-[32px] ${className}`} />;

  return (
    <div
      className={`relative mb-3 min-h-[32px] w-full min-w-0 max-w-full overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${className}`}
    >
      <div
        ref={trackRef}
        className="flex gap-2.5 w-max max-w-none animate-expertise-marquee group-hover:[animation-play-state:paused]"
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {loopItems.map((ex, i) => (
          <span
            key={`${ex}-${i}`}
            className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0 ${chipClassName}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClassName}`} />
            {ex}
          </span>
        ))}
      </div>
    </div>
  );
}