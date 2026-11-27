import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Phone } from "lucide-react";
import room01 from "../../../assets/rooms-banglore/room-01.jpg?w=1600&format=webp&quality=75";
// import room02 from "../../../assets/rooms-banglore/room-02.jpg?w=1600&format=webp&quality=75";
// import room03 from "../../../assets/rooms-banglore/room-03.jpg?w=1600&format=webp&quality=75";
// import room04 from "../../../assets/rooms-banglore/room-04.jpg?w=1600&format=webp&quality=75";
// import room05 from "../../../assets/rooms-banglore/room-05.jpg?w=1600&format=webp&quality=75";
// import room06 from "../../../assets/rooms-banglore/room-06.jpg?w=1600&format=webp&quality=75";
// import room07 from "../../../assets/rooms-banglore/room-07.jpg?w=1600&format=webp&quality=75";
// import room08 from "../../../assets/rooms-banglore/room-08.jpg?w=1600&format=webp&quality=75";
// import room09 from "../../../assets/rooms-banglore/room-09.jpg?w=1600&format=webp&quality=75";
// import room10 from "../../../assets/rooms-banglore/room-10.jpg?w=1600&format=webp&quality=75";

const ROOM_IMAGES: string[] = [
  room01,
  //  room02, room03, room04, room05, room06, room07, room08, room09, room10
  ];
const INTERVAL_MS = 4500;
const RESUME_DELAY_MS = 4000;

interface Props {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  /** Optional number: switches the hero CTA to a "Call Now: <number>" pill (tap-to-call via ctaHref). */
  phoneDisplay?: string;
  /** Optional WhatsApp link shown as a "Chat With Us" button. */
  whatsappHref?: string;
}

const InPatientHeroCarousel = ({ title, subtitle, cta, ctaHref, phoneDisplay, whatsappHref }: Props) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = ROOM_IMAGES.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  // Auto-rotation, paused while the user interacts.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next, active]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  // Pause now; resume shortly after the last interaction (used for clicks/touch).
  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
  };

  const holdPause = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  };
  const release = () => setPaused(false);

  const go = (fn: () => void) => () => {
    pauseTemporarily();
    fn();
  };

  const touchX = useRef<number | null>(null);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="In-patient room photos"
      className="relative w-full h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden bg-[#0b1180]/10"
      onMouseEnter={holdPause}
      onMouseLeave={release}
      onFocus={holdPause}
      onBlur={release}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(prev)();
        if (e.key === "ArrowRight") go(next)();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        holdPause();
      }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
        }
        touchX.current = null;
        pauseTemporarily();
      }}
    >
      {ROOM_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== active}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-14 sm:px-20 lg:px-24 text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg max-w-xl">
            {title}
          </h1>
          <div className="mt-4 h-1 w-16 rounded bg-white" />
          <p className="mt-4 text-base sm:text-lg max-w-xl drop-shadow-md">{subtitle}</p>
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            {phoneDisplay ? (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#E3F7F1]"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Call Now: {phoneDisplay}
              </a>
            ) : (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#0b1180] shadow-md hover:bg-[#E3F7F1] transition"
              >
                {cta} <span aria-hidden="true">→</span>
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#1fa855]"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Chat With Us
              </a>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous image"
        onClick={go(prev)}
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 grid place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={go(next)}
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 grid place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2" role="tablist" aria-label="Choose image">
        {ROOM_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show image ${i + 1} of ${total}`}
            onClick={go(() => setActive(i))}
            className="p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
          >
            {/* <span
              className={`block h-2.5 w-2.5 rounded-full transition ${
                i === active ? "bg-[#1fa37a] ring-2 ring-white scale-110" : "bg-white/80"
              }`}
            /> */}
          </button>
        ))}
      </div>
    </section>
  );
};

export default InPatientHeroCarousel;