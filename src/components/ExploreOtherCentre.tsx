import { Link } from "react-router-dom";

import { SCROLL_TO_EXPERTS_STATE } from "../hooks/useScrollToExpertListing";

/**
 * "Explore our other centre" — lets visitors jump between the Kochi and
 * Bengaluru expert listings. Rendered once, directly after an expert listing.
 *
 * Navigation uses React Router `state` (not URL params) so the destination
 * landing page scrolls to its expert listing. Each landing page already
 * defaults its Location filter to its own city, so no filter is passed.
 */
const CENTRES = [
  { label: "Kochi Centre", to: "/kochi" },
  { label: "Bengaluru Centre", to: "/bengaluru" },
] as const;

const ExploreOtherCentre: React.FC = () => (
  <section
    aria-labelledby="explore-other-centre-heading"
    className="bg-white px-4 sm:px-6 py-8 sm:py-10"
  >
    <div className="max-w-[1180px] mx-auto rounded-[28px] bg-[#f1f6f0] px-4 sm:px-8 py-10 sm:py-12 text-center">
      <h2
        id="explore-other-centre-heading"
        className="text-xl sm:text-[22px] font-bold text-[#1e3a46] mb-2"
      >
        Explore our other centre
      </h2>
      <p className="text-sm sm:text-base text-[#6b7a80] mb-6 sm:mb-7">
        Care options and professional teams can vary by location.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
        {CENTRES.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            state={SCROLL_TO_EXPERTS_STATE}
            className="sm:w-[190px] rounded-2xl bg-white border border-[#e6ede9] shadow-sm px-5 py-4 hover:shadow-md hover:border-[#138158] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#138158] transition-all"
          >
            <span className="block text-base font-bold text-[#1e3a46]">
              {label}
            </span>
            <span className="block mt-1 text-[11px] text-[#8a979c]">
              Explore services and experts
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ExploreOtherCentre;