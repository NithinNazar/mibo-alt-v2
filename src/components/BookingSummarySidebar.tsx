// src/components/BookingSummarySidebar.tsx
import { ArrowLeft, ShieldCheck, Star, Check } from "lucide-react";
import type { Doctor } from "../pages/Experts/data/doctors";

/** ---------- MIBO THEME (kept in sync with Step1SessionDetails) ---------- */
const MIBO = {
  primary: "#034B44",
  primaryHover: "#046e63",
  accent: "#d0f7e9",
  accentSoft: "#f0faf6",
  gray: "#cbd5e1",
};

export type BookingStep = 1 | 2 | 3;

const STEPS: { step: BookingStep; label: string }[] = [
  { step: 1, label: "Select session details" },
  { step: 2, label: "Verify Your Number" },
  { step: 3, label: "Complete your booking" },
];

interface BookingSummarySidebarProps {
  /** Doctor being booked — the same object used by all booking steps. */
  doctor: Doctor | null;
  /** Which step is currently active (1, 2, or 3). Earlier steps render as completed. */
  currentStep: BookingStep;
  /** Back navigation handler — wired to each step's existing onBack. */
  onBack: () => void;
  /** Optional extra classes for layout tweaks from the parent (e.g. grid column sizing). */
  className?: string;
}

/**
 * Shared left-hand sidebar used across all Book Appointment steps:
 * back button, doctor summary + rating, step progress indicator, and the
 * "Secure & Private" reassurance card. Sticky on desktop, normal flow on mobile.
 */
export default function BookingSummarySidebar({
  doctor,
  currentStep,
  onBack,
  className = "",
}: BookingSummarySidebarProps) {
  return (
    <div
      className={`flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:p-6 lg:sticky lg:top-6 ${className}`}
    >
      <button
        onClick={onBack}
        aria-label="Go back"
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition hover:bg-gray-100"
        style={{ color: MIBO.primary }}
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </button>

      {/* Doctor summary card */}
      {doctor && (
        <div className="mb-5 flex items-start gap-3.5">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-14 w-14 flex-shrink-0 rounded-xl object-cover ring-2 ring-white shadow-md sm:h-16 sm:w-16"
          />
          <div className="min-w-0 pt-0.5">
            <div className="truncate text-base font-bold text-gray-900">
              {doctor.name}
            </div>
            <div className="truncate text-sm text-gray-500">
              {doctor.designation}
            </div>
            {typeof doctor.rating === "number" && (
              <div
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: MIBO.accentSoft }}
              >
                <Star
                  className="h-3.5 w-3.5"
                  style={{ color: MIBO.primary, fill: MIBO.primary }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: MIBO.primary }}
                >
                  {doctor.rating.toFixed(1)}
                </span>
                {typeof doctor.reviewsCount === "number" && (
                  <span className="text-xs text-gray-500">
                    ({doctor.reviewsCount} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step progress — dynamically reflects currentStep */}
      <div>
        {STEPS.map((s, i, arr) => {
          const isActive = s.step === currentStep;
          const isCompleted = s.step < currentStep;
          const isHighlighted = isActive || isCompleted;

          return (
            <div
              key={s.label}
              className="relative flex items-center gap-3 pb-6 last:pb-0"
            >
              {i < arr.length - 1 && (
                <span
                  className="absolute left-[13px] top-7 w-px"
                  style={{
                    background: isHighlighted ? MIBO.primary : MIBO.gray,
                    opacity: isHighlighted ? 0.35 : 1,
                    bottom: -6,
                  }}
                />
              )}
              <span
                className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-shadow ${
                  isActive ? "shadow-sm" : ""
                }`}
                style={{
                  background: isHighlighted ? MIBO.primary : "#fff",
                  color: isHighlighted ? "#fff" : "#94a3b8",
                  border: `1.5px solid ${
                    isHighlighted ? MIBO.primary : MIBO.gray
                  }`,
                }}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.step}
              </span>
              <span
                className={`text-sm ${
                  isActive
                    ? "font-semibold text-gray-900"
                    : isCompleted
                      ? "font-medium text-gray-700"
                      : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Secure & Private - pinned to the bottom of the panel */}
      <div
        className="mt-auto flex items-start gap-2.5 rounded-xl border p-4"
        style={{ background: MIBO.accentSoft, borderColor: "#dcefe7" }}
      >
        <ShieldCheck
          className="mt-0.5 h-4.5 w-4.5 flex-shrink-0"
          style={{ color: MIBO.primary }}
        />
        <div>
          <p className="text-xs font-semibold text-gray-900">
            Secure &amp; Private
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
            Your information is safe with us and will never be shared.
          </p>
        </div>
      </div>
    </div>
  );
}