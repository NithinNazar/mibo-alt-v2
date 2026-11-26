// src/pages/Landing/PsychiatristLanding.tsx
//
// Dedicated Psychiatrist Landing Page.
// Renders between the existing shared Header/Footer. The expert listing
// (backend data, filters, pagination, profile modal, booking) lives in
// ./PsychiatristExpertListing and is shared with the city landing pages.

import {
  BANGALORE_PHONE,
  BANGALORE_TEL_LINK,
  KOCHI_PHONE,
  KOCHI_TEL_LINK,
} from "../../utils/contact";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  Flame,
  Gift,
  HeartPulse,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  Wine,
  Zap,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PsychiatristExpertListing from "./PsychiatristExpertListing";
import ExploreOtherCentre from "../../components/ExploreOtherCentre";
import heroBanner from "./banner.jpg";
import heroBannerMobile from "./banner-mobile.png";
import notAloneImg from "./you-are-not-alone.jpg";
import adDesktop from "./ad-desktop.png";
import adMobile from "./ad-mobile.jpg";
import { psychiatristFaqData } from "./psychiatristFaqData";
import { psychiatristReviewsData } from "./psychiatristReviewsData";


// Router state for the Experts listing, pre-filtered to psychiatrists in a
// city — ExpertsPage reads `location` / `specialization` from navigation state
// (see resolveLocationFromParam / resolveCategoryFromParam there). Nothing
// filter-related goes in the URL.
const PSYCHIATRIST_LOCATIONS = ["Bangalore", "Kochi", "Mumbai"];

const EXPERTS_PATH = "/experts";
const expertsPsychiatristState = (location: string) => ({
  location,
  specialization: "Psychiatrist",
});

// Real MIBO clinic details per city — reused from the existing Bangalore and
// Kochi landing pages. Cities without an entry (e.g. Mumbai) fall back to Bangalore.
const CLINIC_EMAIL = "reach@mibocare.com";
const CITY_CONTENT: Record<
  string,
  {
    name: string;
    address: string;
    phone: string;
    telLink: string;
    mapEmbedUrl: string;
  }
> = {
  Bangalore: {
    name: "Bangalore",
    address:
      "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041",
    phone: BANGALORE_PHONE,
    telLink: BANGALORE_TEL_LINK,
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7014776263536!2d77.5959189!3d12.926898300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15995eb9d80d%3A0x627959ca498fde09!2sMibo%20The%20Mind%20Expert!5e0!3m2!1sen!2sin!4v1790150878647!5m2!1sen!2sin",
  },
  Kochi: {
    name: "Kochi",
    address:
      "13/1818, Kannanthodathu Rd, near Changampuzha Park Metro Station, Devankulangara, Mamangalam, Edappally, Kochi, Ernakulam, Kerala 682024",
    phone: KOCHI_PHONE,
    telLink: KOCHI_TEL_LINK,
    mapEmbedUrl:
      "https://www.google.com/maps?q=10.014698823782494,76.30359075580301&hl=en&z=15&output=embed",
  },
};

// Static, non-personal process copy — describes the booking flow itself,
// not any individual patient or clinician record.
const PROCESS_STEPS = [
  {
    icon: Calendar,
    title: "Book Your Consultation",
    description: "Choose a convenient time for an in-person or online consultation.",
  },
  {
    icon: MessageCircle,
    title: "Meet Your Psychiatrist",
    description: "Discuss your concerns in a safe, private and confidential consultation.",
  },
  {
    icon: ClipboardList,
    title: "Assessment & Treatment Plan",
    description: "Your psychiatrist will understand your concerns and recommend an appropriate treatment approach.",
  },
  {
    icon: Heart,
    title: "Follow-Up & Ongoing Care",
    description: "Follow-up consultations can be scheduled when required to monitor your progress and support your ongoing care.",
  },
];

const WHY_CHOOSE_MIBO = [
  "Experienced Psychiatrists",
  "Evidence-Based Care",
  "Personalised Treatment",
  "Confidential & Private Consultations",
  "In-Person & Online Consultations",
  "Convenient Appointments",
  "Patient-Centred Care",
];

// Conditions MIBO psychiatrists treat — mirrors the FAQ's "Can a
// psychiatrist help with anxiety and depression?" scope and the copy
// already used across the Bangalore/Kochi landing pages.
const CONDITIONS_WE_HELP_WITH = [
  { icon: Brain, title: "Depression" },
  { icon: Waves, title: "Anxiety Disorders" },
  { icon: RefreshCw, title: "OCD" },
  { icon: Scale, title: "Bipolar Disorder" },
  { icon: Zap, title: "ADHD" },
  { icon: HeartPulse, title: "Panic Attacks" },
  { icon: Moon, title: "Sleep-Related Concerns" },
  { icon: Flame, title: "Stress-Related Concerns" },
  { icon: Wine, title: "Addiction & Substance Use" },
  { icon: MoreHorizontal, title: "Other Mental Health Concerns" },
];

const PsychiatristLanding = () => {
  const navigate = useNavigate();
  // Opened from a location landing page (/kochi, /bengaluru) via router state
  // { location: "<City>" }: that city is applied as the default Location
  // filter. Unknown/missing values keep the existing Bangalore default.
  const routerLocation = useLocation();
  const stateLocation = (routerLocation.state as { location?: unknown } | null)
    ?.location;
  const requestedLocation =
    typeof stateLocation === "string"
      ? stateLocation.trim().toLowerCase()
      : undefined;
  const selectedLocation =
    PSYCHIATRIST_LOCATIONS.find((l) => l.toLowerCase() === requestedLocation) ??
    "Bangalore";
  const EXPERTS_PSYCHIATRIST_STATE = expertsPsychiatristState(selectedLocation);
  // City-specific copy, address, phone and map (Bangalore fallback).
  const city = CITY_CONTENT[selectedLocation] ?? CITY_CONTENT.Bangalore;
  const PATIENT_PHONE = city.phone;
  const CITY_TEL_LINK = city.telLink;
  const faqItems = psychiatristFaqData.map((faq) => ({
    question: faq.question.replaceAll("Bangalore", city.name),
    answer: faq.answer.replaceAll("Bangalore", city.name),
  }));

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // --- FAQ accordion state (first question open by default) ---
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [showPromoPopup, setShowPromoPopup] = useState(true);

  useEffect(() => {
    if (!showPromoPopup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPromoPopup(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPromoPopup]);

  const handleCall = () => {
    window.location.href = CITY_TEL_LINK;
  };

  // Real patient testimonials sourced from MIBO's Google Business Profile
  // reviews (paraphrased — see psychiatristReviewsData.ts for why these
  // aren't verbatim review text).
  const testimonials = useMemo(() => psychiatristReviewsData, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevTestimonial = () =>
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  const goToNextTestimonial = () =>
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

    {/* Promo Popup======== */}

      {/* {showPromoPopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="World Mental Health Day offer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowPromoPopup(false)}
        >
          <div
            className="relative w-full max-w-[320px] md:max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#212154] shadow-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <picture>
              <source media="(min-width: 768px)" srcSet={adDesktop} />
              <img
                src={adMobile}
                alt="World Mental Health Day: 50% off on psychiatric consultation at Mibo Bengaluru. Use code MHM72."
                className="block w-full h-auto max-h-[85vh] object-contain rounded-2xl bg-white"
              />
            </picture>
          </div>
        </div>
      )} */}

      <Header />

      {/* Spacer to clear the fixed Header */}
      <div className="pt-16 md:pt-[72px]">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="relative flex flex-col md:block aspect-[941/1672] md:aspect-auto bg-cover bg-[position:85%_bottom] md:bg-center bg-[image:var(--hero-bg-mobile)] md:bg-[image:var(--hero-bg-desktop)]"
          style={
            {
              "--hero-bg-mobile": `url(${heroBannerMobile})`,
              "--hero-bg-desktop": `url(${heroBanner})`,
            } as CSSProperties
          }
        >
          {/* Scrim for text legibility over the banner photo */}
          {/* Mobile scrim: white on the text side, fading out over the doctor */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 45%, rgba(255,255,255,0.65) 64%, rgba(255,255,255,0) 86%)",
            }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, #ffffff 0%, #ffffff 32%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0) 62%)",
            }}
          />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4 sm:py-10 md:py-12">
            <div className="max-w-[64%] sm:max-w-2xl">
              <span className="inline-block bg-[#eaf7f2] text-[#138158] text-xs font-bold tracking-wide px-4 py-1.5 rounded-full mb-4 sm:mb-5">
                Your Mental Health Matters
              </span>
              <h1 className="text-[27px] min-[400px]:text-[30px] leading-[1.15] tracking-tight sm:tracking-normal sm:text-5xl sm:leading-tight font-extrabold text-[#212154] mb-4">
                Psychiatrist in <br className="sm:hidden" />
                {city.name} for
                <br />
                <span className="text-[#138158]">
                  Expert Mental <br className="sm:hidden" />
                  Health Care
                </span>
              </h1>
              <p className="text-[#3f4a5a] font-medium text-[13px] leading-relaxed -mx-3 px-3 py-2 rounded-xl bg-white/85 backdrop-blur-sm sm:mx-0 sm:p-0 sm:rounded-none sm:bg-transparent sm:backdrop-blur-none sm:text-miboText sm:font-normal sm:text-lg sm:leading-normal mb-5 sm:mb-8 max-w-full sm:max-w-xl">
                Get compassionate, confidential and evidence-based
                psychiatric care from experienced psychiatrists in
                {city.name}. Consult us in person or online based on your
                convenience.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 mb-2 sm:mb-10 w-[88%] sm:w-auto">
                {/* <button
                  onClick={() => navigate(EXPERTS_PATH, { state: EXPERTS_PSYCHIATRIST_STATE })}
                  className="bg-[#138158] hover:bg-[#0e6b4f] text-white font-semibold px-4 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-full transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Book Psychiatrist Consultation
                  <span aria-hidden>→</span>
                </button> */}
                <button
                  onClick={handleCall}
                  className="bg-[#138158] hover:bg-[#0f6b49] text-white shadow-lg shadow-[#138158]/30 font-semibold px-4 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-full transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  Call Now
                </button>
              </div>
              <p className="text-sm sm:text-base text-miboText mb-4 sm:mb-8">
                Or call us at{" "}
                <a
                  href={CITY_TEL_LINK}
                  className="font-bold text-[#212154] hover:text-[#138158] transition-colors whitespace-nowrap"
                >
                  +91 {PATIENT_PHONE}
                </a>
              </p>

              <div className="hidden sm:grid grid-cols-3 gap-x-4 gap-y-4 sm:gap-6">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    In-Person &amp; Online Consultations
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    Confidential Care
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    Experienced Psychiatrists
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only feature card (matches the mobile design). The
              inline strip above is used from the sm breakpoint up. */}
          <div className="relative sm:hidden mt-auto mx-[4.7%] mb-[10%] grid grid-cols-3 rounded-2xl bg-white/95 shadow-[0_8px_28px_rgba(19,129,88,0.12)]">
            {[
              { Icon: Calendar, title: "In-Person & Online Consultations" },
              { Icon: ShieldCheck, title: "Confidential Care" },
              { Icon: Sparkles, title: "Experienced Psychiatrists" },
            ].map(({ Icon, title }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center text-center gap-1.5 p-3 min-w-0 ${
                  i > 0 ? "border-l border-[#e6ede9]" : ""
                }`}
              >
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[#eaf7f2]">
                  <Icon className="w-[18px] h-[18px] text-[#138158]" />
                </span>
                <span className="block text-[10.5px] font-bold leading-tight text-[#212154]">{title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* World Mental Health Day promotional banner                       */}
        {/* ---------------------------------------------------------------- */}
        {/* <section
          aria-label="World Mental Health Day offer"
          className="bg-white py-8 sm:py-10 md:py-12"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <picture>
              <source media="(min-width: 768px)" srcSet={adDesktop} width={1672} height={941} />
              <img
                src={adMobile}
                width={1024}
                height={1536}
                alt="World Mental Health Day: 50% off on psychiatric consultation at Mibo Bengaluru. Use code MHM72, valid 1st to 30th October."
                loading="lazy"
                decoding="async"
                className="block h-auto w-full max-w-[320px] md:max-w-4xl mx-auto rounded-2xl"
              />
            </picture> */}

            {/* Offer summary strip */}
            {/* <div className="mt-4 md:mt-6 mx-auto max-w-[320px] md:max-w-4xl rounded-2xl border border-[#138158]/20 bg-[#eaf6f2] px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-start gap-3 md:flex-1">
                <Gift className="w-8 h-8 shrink-0 text-[#138158]" />
                <div>
                  <p className="font-bold text-[#212154]">Special Offer for a Healthier You</p>
                  <p className="text-sm text-miboText">
                    On this World Mental Health Day, take the first step towards
                    better mental well-being with 50% off on psychiatrist consultation.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-around md:justify-start gap-6 md:gap-8 md:border-l md:border-[#212154]/15 md:pl-6">
                <div>
                  <p className="text-xs text-miboText">Regular Price</p>
                  <p className="text-xl font-bold text-[#212154] line-through decoration-red-500">₹800</p>
                </div>
                <div>
                  <p className="text-xs text-miboText">Offer Price</p>
                  <p className="text-2xl font-extrabold text-[#212154]">₹400</p>
                  <p className="text-[11px] text-miboText">Only until 10th October</p>
                </div>
              </div>
              <button
                onClick={handleCall}
                className="bg-[#212154] hover:bg-[#1a1a46] text-white font-semibold px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 shrink-0" />
                Call Now <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </section> */}

        {/* ---------------------------------------------------------------- */}
        {/* About Psychiatric Care at MIBO                                   */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-4">
              Psychiatric Care at MIBO
            </h2>
            <p className="text-miboText text-base sm:text-lg leading-relaxed">
              At MIBO, our psychiatrists provide professional and
              personalised mental health care for adults, adolescents and
              older adults. We focus on understanding your concerns,
              providing appropriate assessment and treatment, and
              supporting you throughout your mental health journey.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Conditions We Help With                                          */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f7fbfa]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-3">
                What Can a Psychiatrist Help With?
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {CONDITIONS_WE_HELP_WITH.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="bg-white border border-[#eef4f1] rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#eef7f4] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#138158]" />
                  </div>
                  <p className="text-sm font-semibold text-[#212154] leading-snug">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* When Should You See a Psychiatrist?                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-4">
              When Should You See a Psychiatrist?
            </h2>
            <p className="text-miboText text-base sm:text-lg leading-relaxed">
              Consider speaking with a psychiatrist when emotional,
              behavioural or mental health concerns begin affecting your
              daily life, relationships, work, sleep or overall wellbeing.
              A psychiatrist can assess your concerns and recommend an
              appropriate treatment approach based on your individual
              needs.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Psychiatrist profile cards                                       */}
        {/* ---------------------------------------------------------------- */}
        <PsychiatristExpertListing
          key={selectedLocation}
          defaultLocation={selectedLocation}
          viewAllLink={EXPERTS_PATH}
          viewAllState={EXPERTS_PSYCHIATRIST_STATE}
        />

        {/* Switch between centres */}
        <ExploreOtherCentre />

        {/* ---------------------------------------------------------------- */}
        {/* How It Works                                                     */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                HOW IT WORKS
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-3">
                How Psychiatric <span className="text-[#138158]">Consultation Works</span>
              </h2>
              <p className="text-miboText max-w-2xl mx-auto">
                A simple, supportive process to help you get the care you need.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-10 relative">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div className="bg-white border-2 border-[#138158]/25 rounded-2xl p-6 text-center shadow-md shadow-[#138158]/10 h-full">
                      <div className="relative w-14 h-14 mx-auto mb-5">
                        <div className="w-14 h-14 rounded-full bg-[#eef7f4] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#138158]" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#138158] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#212154] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-miboText leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {index < PROCESS_STEPS.length - 1 && (
                      <span className="hidden lg:flex items-center justify-center absolute top-1/2 -right-8 -translate-y-1/2 w-6 h-6 z-10">
                        <ChevronRight
                          className="w-6 h-6 text-[#138158]"
                          strokeWidth={2.5}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Psychiatrist Consultation in {city} (Location)  */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-4">
                  Psychiatrist Consultation in {city.name}
                </h2>
                <p className="text-miboText text-base sm:text-lg leading-relaxed mb-6">
                  MIBO provides psychiatric consultations in {city.name}
                  through experienced psychiatrists, with options for
                  in-person and online consultations. Choose a convenient
                  appointment and get professional mental health care in a
                  confidential and supportive environment.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-[#eef7f4] p-5 rounded-2xl">
                    <MapPin className="w-6 h-6 text-[#138158] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-[#212154] mb-1">
                        Address
                      </h3>
                      <p className="text-miboText text-sm">{city.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-[#eef7f4] p-5 rounded-2xl">
                    <Phone className="w-6 h-6 text-[#138158] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-[#212154] mb-1">
                        Phone
                      </h3>
                      <p className="text-miboText text-sm">
                        <a
                          href={CITY_TEL_LINK}
                          className="hover:text-[#138158] transition-colors"
                        >
                          +91 {PATIENT_PHONE}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-[#eef7f4] p-5 rounded-2xl">
                    <Mail className="w-6 h-6 text-[#138158] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-[#212154] mb-1">
                        Email
                      </h3>
                      <p className="text-miboText text-sm">{CLINIC_EMAIL}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#eef4f1] h-80 md:h-[420px]">
                <iframe
                  src={city.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`MIBO ${city.name} Location`}
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Testimonials + Promotional + Why Choose Us                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f7fbfa]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-3 gap-6 items-stretch">
              {/* Testimonials */}
              <div className="flex flex-col">
                <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                  WHAT OUR PATIENTS SAY
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212154] mb-1">
                  What Our <span className="text-[#138158]">Patients Say</span>
                </h2>
                <p className="text-miboText mb-6 text-sm">
                  Hear from individuals who have experienced positive change.
                </p>

                <div className="bg-white rounded-2xl border border-[#eef4f1] shadow-sm p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-4xl text-[#138158]/30 leading-none">
                      &ldquo;
                    </span>
                    <p className="text-[#212154] text-base leading-relaxed -mt-3">
                      {testimonials[testimonialIndex].text}
                    </p>
                  </div>
                  <div>
                    <div className="mt-4 pt-4 border-t border-[#eef4f1] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* <img
                          src={testimonials[testimonialIndex].image}
                          alt={testimonials[testimonialIndex].name}
                          className="w-14 h-14 rounded-full object-cover shrink-0"
                        /> */}
                        <div>
                          <p className="font-bold text-[#212154] text-sm">
                            {testimonials[testimonialIndex].name}
                          </p>
                          <p className="text-xs text-miboText">Mibo Patient</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623]"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={goToPrevTestimonial}
                        aria-label="Previous testimonial"
                        className="w-7 h-7 rounded-full border border-[#e6ede9] flex items-center justify-center text-[#212154] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors"
                      >
                        <span aria-hidden className="text-sm">
                          ‹
                        </span>
                      </button>
                      <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTestimonialIndex(i)}
                            aria-label={`Show testimonial ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === testimonialIndex
                                ? "bg-[#138158]"
                                : "bg-[#e6ede9]"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={goToNextTestimonial}
                        aria-label="Next testimonial"
                        className="w-7 h-7 rounded-full border border-[#e6ede9] flex items-center justify-center text-[#212154] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors"
                      >
                        <span aria-hidden className="text-sm">
                          ›
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotional / "You Are Not Alone" */}
              <div
                className="relative rounded-2xl overflow-hidden bg-white border border-[#eef4f1] shadow-sm min-h-[280px] sm:min-h-[320px] lg:min-h-0 bg-no-repeat bg-cover lg:bg-contain bg-left"
                style={{ backgroundImage: `url(${notAloneImg})` }}
              >
                <div className="relative h-full flex flex-col justify-center p-5 sm:p-8 pl-[46%] sm:pl-[48%]">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#212154] mb-2 sm:mb-3 leading-snug">
                    You Are Not Alone
                  </h3>
                  <p className="text-miboText text-xs sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    We are here to listen, support and guide you towards a
                    brighter tomorrow.
                  </p>
                  <button
                    onClick={() => navigate("/why-mibo")}
                    className="self-start bg-white text-[#212154] text-sm sm:text-base font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 border border-[#e6ede9] shadow-sm hover:bg-[#f7fbfa] transition-colors whitespace-nowrap"
                  >
                    Learn More
                    <span aria-hidden className="text-[#138158]">→</span>
                  </button>
                </div>
              </div>

              {/* Why Choose Mibo */}
              <div className="bg-white rounded-2xl border border-[#eef4f1] shadow-sm p-6">
                <h3 className="text-lg font-extrabold text-[#212154] mb-5 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-[#eef7f4] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#138158]" />
                  </span>
                  Why Choose Mibo?
                </h3>
                <div className="flex flex-col gap-4">
                  {WHY_CHOOSE_MIBO.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#eef7f4] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#138158]" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-[#212154] font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FAQ                                                               */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f7fbfa]">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#212154] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-[#212154]/70 text-sm sm:text-base mb-10 sm:mb-14 max-w-2xl mx-auto">
              Find answers to common questions about psychiatric consultations
              at MIBO.
            </p>

            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {faqItems.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#212154]/10"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left hover:bg-[#138158]/5 transition-colors duration-300"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base md:text-lg font-bold text-[#212154] leading-snug">
                        {faq.question}
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-[#138158] flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <p className="text-[#212154]/80 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CTA                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#212154] to-[#1a1a46] text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-snug">
              Book Your Psychiatric Consultation in {city.name}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Take the first step towards better mental health. Speak with
              an experienced psychiatrist at MIBO through an in-person or
              online consultation.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              {/* <button
                onClick={() => navigate(EXPERTS_PATH, { state: EXPERTS_PSYCHIATRIST_STATE })}
                className="bg-white text-[#212154] px-7 py-3.5 rounded-full font-semibold hover:bg-white/90 transition-colors w-full sm:w-auto"
              >
                Book Appointment
              </button> */}
              <button
                onClick={handleCall}
                className="border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Call +91 {PATIENT_PHONE}
              </button>
            </div>
            <p className="mt-5 text-white/80 text-sm sm:text-base">
              Or dial us directly:{" "}
              <a
                href={CITY_TEL_LINK}
                className="font-bold text-white underline underline-offset-4 hover:text-[#97f7df] transition-colors whitespace-nowrap"
              >
                +91 {PATIENT_PHONE}
              </a>
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PsychiatristLanding;