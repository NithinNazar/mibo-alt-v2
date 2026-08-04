/**
 * Design goals:
 * - Single `scroll` listener, rAF-throttled to at most one read/write per frame.
 * - Decision is based ONLY on scroll direction + a small delta threshold (to
 *   ignore momentum/bounce micro-scrolls) — no `getBoundingClientRect()` or
 *   other layout-triggering reads inside the scroll handler, so there's no
 *   per-frame layout thrashing.
 * - Near the very top of the page the bar is always shown, so the "at the top
 *   of the page it's fully visible" requirement holds without needing to know
 *   whether the element has actually docked to its `position: sticky` offset.
 * - `disabled` lets a consumer force the bar visible (e.g. while a dropdown
 *   anchored to it is open) without adding a second listener.
 *
 * @example
 * ```tsx
 * const visible = useScrollDirection({ disabled: isDropdownOpen });
 * <StickySearchBar visible={visible} ... />
 * ```
 */

import { useEffect, useRef, useState } from "react";

interface UseScrollDirectionOptions {
  /** Minimum scroll delta (px) required to register a direction change. */
  threshold?: number;
  /** Scroll distance (px) from the top within which the bar always stays visible. */
  topRevealOffset?: number;
  /** When true, forces `visible` to stay true regardless of scroll (e.g. dropdown open). */
  disabled?: boolean;
}

const DEFAULT_THRESHOLD = 6;
const DEFAULT_TOP_REVEAL_OFFSET = 120;

export function useScrollDirection({
  threshold = DEFAULT_THRESHOLD,
  topRevealOffset = DEFAULT_TOP_REVEAL_OFFSET,
  disabled = false,
}: UseScrollDirectionOptions = {}): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    if (disabled) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollYRef.current;

        if (currentY <= topRevealOffset) {
          // Near the top of the page — always fully visible.
          setVisible(true);
        } else if (Math.abs(diff) > threshold) {
          setVisible(diff < 0); // scrolling up (diff < 0) => reveal, down => hide
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, topRevealOffset, disabled]);

  return visible;
}

export default useScrollDirection;