// Single definition of "is this expert a psychiatrist", shared by the
// Experts page (Psychiatrists tab) and the Psychiatrist landing page so
// both always list the same people.
//
// A clinician counts as a psychiatrist when "psychiatrist" or "psychiatry"
// appears in their designation, specialization or qualification
// (e.g. "MD Psychiatry", "DNB Psychiatry").
//
// Generic degrees (MBBS, MD) do NOT count on their own, and neither does
// "Psychiatric Social Worker".

type TextOrList = string | string[] | null | undefined;

export interface PsychiatristCandidate {
  designation?: TextOrList;
  specialization?: TextOrList;
  qualification?: TextOrList;
}

const toText = (value: TextOrList): string =>
  (Array.isArray(value) ? value.join(" ") : value || "").toLowerCase();

const PSYCHIATRIST_PATTERN = /psychiatrist|psychiatry/;

export function isPsychiatrist(c: PsychiatristCandidate): boolean {
  return (
    PSYCHIATRIST_PATTERN.test(toText(c.designation)) ||
    PSYCHIATRIST_PATTERN.test(toText(c.specialization)) ||
    PSYCHIATRIST_PATTERN.test(toText(c.qualification))
  );
}