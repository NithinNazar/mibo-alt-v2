import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Stable id of the expert listing section (set in PsychiatristExpertListing). */
export const EXPERT_LISTING_SECTION_ID = "expert-listing";

/** Router state sent by the "Explore our other centre" cards. */
export const SCROLL_TO_EXPERTS_STATE = { scrollToExperts: true } as const;

const MAX_WAIT_MS = 5000;
// Re-checks after images above the listing finish loading and shift layout.
const SETTLE_CHECKS_MS = [500, 1200, 2200];
const SETTLE_TOLERANCE_PX = 8;
const USER_INTERACTION_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"];

/**
 * On a landing page, scrolls smoothly to the expert listing when the visitor
 * arrived via an "Explore our other centre" card. The sticky navbar offset is
 * handled by `scroll-mt-*` on the section. Nothing happens on normal visits.
 */
export function useScrollToExpertListing(): void {
  const location = useLocation();
  const shouldScroll = Boolean(
    (location.state as { scrollToExperts?: boolean } | null)?.scrollToExperts,
  );

  useEffect(() => {
    if (!shouldScroll) return;

    let cancelled = false;
    let rafId = 0;
    const timers: number[] = [];
    const start = performance.now();

    const getTarget = () => document.getElementById(EXPERT_LISTING_SECTION_ID);
    const scrollSmooth = (el: HTMLElement) =>
      el.scrollIntoView({ behavior: "smooth", block: "start" });

    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      timers.forEach(window.clearTimeout);
      USER_INTERACTION_EVENTS.forEach((e) =>
        window.removeEventListener(e, stop),
      );
    };
    // If the visitor scrolls themselves, never fight them.
    USER_INTERACTION_EVENTS.forEach((e) =>
      window.addEventListener(e, stop, { passive: true }),
    );

    const run = () => {
      if (cancelled) return;
      const el = getTarget();
      if (!el) {
        if (performance.now() - start < MAX_WAIT_MS) {
          rafId = requestAnimationFrame(run);
        }
        return;
      }

      // Wait one more tick so the global ScrollToTop (scroll to 0 on route
      // change) has fired and cannot override this scroll.
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          scrollSmooth(el);

          // Correct drift if layout above the listing changed afterwards.
          SETTLE_CHECKS_MS.forEach((ms) =>
            timers.push(
              window.setTimeout(() => {
                const target = getTarget();
                if (cancelled || !target) return;
                const scrollMt = parseFloat(
                  getComputedStyle(target).scrollMarginTop,
                ) || 0;
                const drift = target.getBoundingClientRect().top - scrollMt;
                if (Math.abs(drift) > SETTLE_TOLERANCE_PX) scrollSmooth(target);
              }, ms),
            ),
          );
          // Stop listening for interaction once the checks are done.
          timers.push(
            window.setTimeout(
              stop,
              SETTLE_CHECKS_MS[SETTLE_CHECKS_MS.length - 1] + 100,
            ),
          );
        }, 150),
      );
    };
    rafId = requestAnimationFrame(run);

    // Clear the flag in the history entry (without a router re-render, which
    // would cancel this effect) so a refresh doesn't re-trigger the scroll.
    try {
      const h = window.history.state;
      if (h && typeof h === "object" && "usr" in h) {
        window.history.replaceState({ ...h, usr: null }, "");
      }
    } catch {
      /* non-critical */
    }

    return stop;
    // location.key changes on every navigation, incl. same-page clicks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, shouldScroll]);
}