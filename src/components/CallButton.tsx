import React from "react";
import { Phone } from "lucide-react";
import { DEFAULT_PHONE_DISPLAY, DEFAULT_TEL_LINK } from "../utils/contact";

interface CallButtonProps {
  /** Text shown before the number. Pass an empty string to show only the number. */
  label?: string;
  /** Defaults to the main Mibo number (+91 90833 35000). */
  phoneDisplay?: string;
  telLink?: string;
  className?: string;
}

/**
 * Reusable pill-shaped "call" button. Defaults to the main Mibo number so it
 * can be dropped on any non-location page.
 */
const CallButton: React.FC<CallButtonProps> = ({
  label = "Call Us:",
  phoneDisplay = DEFAULT_PHONE_DISPLAY,
  telLink = DEFAULT_TEL_LINK,
  className = "",
}) => (
  <a
    href={telLink}
    className={`inline-flex items-center justify-center gap-2 bg-[#0e6b4f] hover:bg-[#138158] text-white text-sm font-bold px-7 py-3 rounded-full transition-colors ${className}`}
  >
    <Phone size={16} className="flex-shrink-0" />
    {label ? `${label} ` : ""}
    {phoneDisplay}
  </a>
);

export default CallButton;