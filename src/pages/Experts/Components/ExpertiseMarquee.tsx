interface ExpertiseMarqueeProps {
  expertise: string[];
  chipClassName?: string;
  dotClassName?: string;
  className?: string;
}

export default function ExpertiseMarquee({
  expertise,
  chipClassName = "bg-gradient-to-b from-white/80 to-[#a7c4f2]/30 border border-[#a7c4f2]/50 text-[#034B44] shadow-[0_1px_2px_rgba(3,75,68,0.06)]",
  dotClassName = "bg-[#034B44]/40",
  className = "",
}: ExpertiseMarqueeProps) {
  if (expertise.length === 0) return <div className={`mb-3 min-h-[32px] ${className}`} />;

  // Repeat the list enough times so each half of the loop is wide enough to
  // overflow the container (otherwise short expertise lists leave a visible
  // blank gap before the loop restarts). Duplicate the resulting half so the
  // CSS loop (-50%) is seamless.
  const repeatFactor = Math.max(1, Math.ceil(6 / expertise.length));
  const half = Array.from({ length: repeatFactor }, () => expertise).flat();
  const loopItems = [...half, ...half];

  return (
    <div
      className={`relative mb-3 min-h-[32px] w-full min-w-0 max-w-full overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${className}`}
    >
      <div className="flex gap-2.5 w-max max-w-none animate-expertise-marquee group-hover:[animation-play-state:paused]">
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