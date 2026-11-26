// Clean-URL filter handling for the Experts page.
//
// Filters never live in the URL. Their sources, in priority order, are:
//   1. an explicit destination passed via React Router navigation state
//      (landing pages, header menus) — see ExpertsNavState
//   2. the last selection saved in sessionStorage (survives refresh)
//   3. the page's built-in defaults (no restriction, "All Experts")
// This module is pure (no React) so the priority/validation rules are testable.

export const EXPERTS_FILTERS_STORAGE_KEY = "mibo.experts.filters.v1";

export const EXPERTS_FILTER_KEYS = [
  "Location",
  "Expertise",
  "Language",
  "Price",
  "Gender",
] as const;
export type ExpertsFilterKey = (typeof EXPERTS_FILTER_KEYS)[number];
export type ExpertsFilterSelection = Record<ExpertsFilterKey, string[]>;

export const DEFAULT_CATEGORY = "All Experts";

/** Router state accepted by /experts (and /psychiatrist for `location`). */
export interface ExpertsNavState {
  location?: string; // e.g. "Bangalore" | "Kochi" | "Mumbai"
  specialization?: string; // e.g. "Psychiatrist" | "Clinical Psychologist"
}

export interface ExpertsFilterState {
  category: string;
  filters: ExpertsFilterSelection;
}

export const emptyFilters = (): ExpertsFilterSelection => ({
  Location: [],
  Expertise: [],
  Language: [],
  Price: [],
  Gender: [],
});

export const isDefaultState = (s: ExpertsFilterState): boolean =>
  s.category === DEFAULT_CATEGORY &&
  EXPERTS_FILTER_KEYS.every((k) => s.filters[k].length === 0);

/** Narrow unknown router state to ExpertsNavState (null when nothing usable). */
export function parseExpertsNavState(raw: unknown): ExpertsNavState | null {
  if (!raw || typeof raw !== "object") return null;
  const { location, specialization } = raw as Record<string, unknown>;
  const out: ExpertsNavState = {};
  if (typeof location === "string" && location.trim()) out.location = location;
  if (typeof specialization === "string" && specialization.trim())
    out.specialization = specialization;
  return out.location || out.specialization ? out : null;
}

/**
 * Validates whatever sessionStorage returned. Unknown categories, unknown
 * option values, wrong types and malformed JSON are all discarded.
 */
export function loadStoredFilters(
  storage: Pick<Storage, "getItem" | "removeItem"> | null,
  validCategories: string[],
  validOptions: Partial<Record<ExpertsFilterKey, string[]>>,
): ExpertsFilterState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(EXPERTS_FILTERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("shape");
    const category =
      typeof parsed.category === "string" &&
      validCategories.includes(parsed.category)
        ? parsed.category
        : DEFAULT_CATEGORY;
    const filters = emptyFilters();
    for (const key of EXPERTS_FILTER_KEYS) {
      const value = parsed.filters?.[key];
      if (!Array.isArray(value)) continue;
      const allowed = validOptions[key];
      filters[key] = value.filter(
        (v): v is string =>
          typeof v === "string" && (!allowed || allowed.includes(v)),
      );
    }
    const state = { category, filters };
    return isDefaultState(state) ? null : state;
  } catch {
    try {
      storage.removeItem(EXPERTS_FILTERS_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    return null;
  }
}

/** Saves the selection; a fully-default selection removes the entry. */
export function persistFilters(
  storage: Pick<Storage, "setItem" | "removeItem"> | null,
  state: ExpertsFilterState,
): void {
  if (!storage) return;
  try {
    if (isDefaultState(state)) {
      storage.removeItem(EXPERTS_FILTERS_STORAGE_KEY);
    } else {
      storage.setItem(EXPERTS_FILTERS_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    /* quota / private mode — filters simply won't persist */
  }
}

/**
 * Priority resolution. An explicit navigation location/specialization
 * replaces the stored one; other stored filters are kept. `resolveLocation`
 * and `resolveCategory` map raw strings to valid options ([] / default when
 * unrecognised).
 */
export function resolveFilterState(args: {
  nav: ExpertsNavState | null;
  stored: ExpertsFilterState | null;
  resolveLocation: (raw: string) => string[];
  resolveCategory: (raw: string) => string;
}): ExpertsFilterState {
  const base: ExpertsFilterState = args.stored
    ? { category: args.stored.category, filters: { ...args.stored.filters } }
    : { category: DEFAULT_CATEGORY, filters: emptyFilters() };
  if (args.nav?.location) {
    base.filters.Location = args.resolveLocation(args.nav.location);
  }
  if (args.nav?.specialization) {
    base.category = args.resolveCategory(args.nav.specialization);
  }
  return base;
}

export function safeSessionStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
}