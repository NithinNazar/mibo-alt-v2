// URL <-> city mapping for location-specific Psychiatrist / Expert pages
// (/psychiatrist/:location, /expert/:location). The URL is the source of truth.

import { Navigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";

// Canonical slug -> city name used by the Location filter options.
export const LOCATION_SLUG_TO_CITY: Record<string, string> = {
  kochi: "Kochi",
  bangalore: "Bangalore",
};

// Extra accepted spellings, redirected to the canonical slug.
const SLUG_ALIASES: Record<string, string> = { bengaluru: "bangalore" };

const normalise = (raw: string | undefined | null) =>
  (raw ?? "").trim().toLowerCase();

/** Canonical slug for a raw URL segment, or null when unsupported. */
export function canonicalLocationSlug(
  raw: string | undefined | null,
): string | null {
  const key = normalise(raw);
  const slug = SLUG_ALIASES[key] ?? key;
  return Object.prototype.hasOwnProperty.call(LOCATION_SLUG_TO_CITY, slug)
    ? slug
    : null;
}

/** City name ("Kochi" | "Bangalore") for a raw URL segment, or null. */
export function resolveLocationSlug(
  raw: string | undefined | null,
): string | null {
  const slug = canonicalLocationSlug(raw);
  return slug ? LOCATION_SLUG_TO_CITY[slug] : null;
}

/** Slug for a city name, or null when the city has no location URL. */
export function locationToSlug(city: string | undefined | null): string | null {
  const key = normalise(city);
  return canonicalLocationSlug(key);
}

// ---- Expert categories (/expert/:category[/:location]) --------------------
// Slug -> label used by the Experts page category pills (ExpertsPage CATEGORIES).
export const CATEGORY_SLUGS: { slug: string; label: string }[] = [
  { slug: "clinical-psychologist", label: "Clinical Psychologists" },
  { slug: "psychiatrist", label: "Psychiatrists" },
  { slug: "counselling-psychologist", label: "Counselling Psychologist" },
];
export const ALL_EXPERTS_LABEL = "All Experts";

const CATEGORY_ALIASES: Record<string, string> = {
  "clinical-psychologists": "clinical-psychologist",
  psychiatrists: "psychiatrist",
  counsellor: "counselling-psychologist",
  counsellors: "counselling-psychologist",
  "counselling-psychologists": "counselling-psychologist",
};

/** Canonical category slug from a URL segment or display name, else null. */
export function canonicalCategorySlug(
  raw: string | undefined | null,
): string | null {
  const key = normalise(raw).replace(/\s+/g, "-");
  const slug = CATEGORY_ALIASES[key] ?? key;
  return CATEGORY_SLUGS.some((c) => c.slug === slug) ? slug : null;
}

/** Category pill label for a slug/name, or null when unsupported. */
export function resolveCategorySlug(
  raw: string | undefined | null,
): string | null {
  const slug = canonicalCategorySlug(raw);
  return CATEGORY_SLUGS.find((c) => c.slug === slug)?.label ?? null;
}

/**
 * Listing path for a category (slug, name or label; null/"All Experts" = none)
 * and city (null = none):
 *   /experts, /experts/:location, /expert/:category, /expert/:category/:location
 */
export function buildExpertsPath(
  category: string | null | undefined,
  city: string | null | undefined,
): string {
  const catSlug = canonicalCategorySlug(category);
  const locSlug = locationToSlug(city);
  if (!catSlug) return locSlug ? `/experts/${locSlug}` : "/experts";
  return locSlug ? `/expert/${catSlug}/${locSlug}` : `/expert/${catSlug}`;
}

/**
 * Guard for every expert-listing route (all four share one element so the
 * page is not remounted between them). Invalid category -> /experts; invalid
 * location -> the category (or /experts) without it; alias spellings -> the
 * canonical URL. All redirects use `replace`.
 */
export function ExpertRouteGuard({ children }: { children: ReactNode }) {
  const { category, location } = useParams();
  const catSlug = category === undefined ? null : canonicalCategorySlug(category);
  if (category !== undefined && !catSlug) return <Navigate to="/experts" replace />;
  const locSlug = location === undefined ? null : canonicalLocationSlug(location);
  const base = catSlug ? `/expert/${catSlug}` : "/experts";
  if (location !== undefined && !locSlug) return <Navigate to={base} replace />;
  const canonical = locSlug ? `${base}/${locSlug}` : base;
  const requested = [
    category === undefined ? "/experts" : `/expert/${category}`,
    location,
  ]
    .filter(Boolean)
    .join("/");
  if (canonical !== requested) return <Navigate to={canonical} replace />;
  return <>{children}</>;
}

/**
 * Route guard: unsupported slugs redirect to `fallbackPath`; alias slugs
 * (e.g. "bengaluru") redirect to the canonical URL. Both use `replace` so the
 * bad URL never enters history (back button stays correct).
 */
export function LocationSlugGuard({
  basePath,
  fallbackPath,
  children,
}: {
  basePath: string;
  fallbackPath: string;
  children: ReactNode;
}) {
  const { location } = useParams();
  const slug = canonicalLocationSlug(location);
  if (!slug) return <Navigate to={fallbackPath} replace />;
  if (slug !== location) return <Navigate to={`${basePath}/${slug}`} replace />;
  return <>{children}</>;
}