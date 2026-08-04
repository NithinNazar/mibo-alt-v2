/**
 * Behavior:
 * - Desktop (`md:` and up): unchanged, plain `position: sticky` bar, always
 *   visible. This overrides below always win over the mobile hide
 *   state, so desktop layout/behavior is untouched.
 * - Mobile: the whole container is one `position: sticky` element. Visibility
 *   is driven entirely by the `visible` prop (see `useScrollDirection`) and
 *   is applied with a single `transform: translateY()` + `opacity` pair —
 *   both GPU-accelerated, no layout-affecting properties — so hiding it never
 *   causes reflow, layout shift, or a duplicate render of its children.
 */

import { forwardRef, type ReactNode } from "react";

interface StickySearchBarProps {
  /** Whether the bar should be shown (mobile only — desktop is always shown). */
  visible: boolean;
  /** Content for the top row, e.g. Category Tabs. */
  topSlot: ReactNode;
  /** Content for the bottom row, e.g. Filter Bar. */
  bottomSlot: ReactNode;
  /** Optional extra classes for the outer sticky container. */
  className?: string;
}

const StickySearchBar = forwardRef<HTMLDivElement, StickySearchBarProps>(
  ({ visible, topSlot, bottomSlot, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "sticky top-16 md:top-20 z-40 bg-white",
          // Single GPU-accelerated transition driving both rows as one unit.
          "transition-[transform,opacity] duration-[220ms] ease-out will-change-transform",
          // Desktop always stays fully visible/undocked from the hide logic.
          "md:!translate-y-0 md:!opacity-100",
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
          className,
        ].join(" ")}
      >
        {topSlot}
        {bottomSlot}
      </div>
    );
  },
);

StickySearchBar.displayName = "StickySearchBar";

export default StickySearchBar;