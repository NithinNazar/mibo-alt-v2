// src/pages/BookAppointment/Step1SessionDetails.tsx
import type { Doctor } from "../Experts/data/doctors";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  MapPin,
  Video,
  Phone,
  CalendarDays,
  Sun,
  Sunrise,
  Moon,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  AlertCircle,
  Info,
  Users,
  Clock,
  IndianRupee,
} from "lucide-react";
import type { Clinician, Centre, TimeSlot } from "../../types";
import { API_BASE_URL } from "../../services/api";
import locationIllustration from "../Experts/assets/location.png";
import phoneVerifyBg from "../Experts/assets/phone-verify-bg.jpg";
import BookingSummarySidebar from "../../components/BookingSummarySidebar";

interface Props {
  doctor: Doctor;
  bookingData: any;
  setBookingData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

/** ---------- MIBO THEME ---------- */
const MIBO = {
  primary: "#034B44",
  primaryHover: "#046e63",
  accent: "#d0f7e9",
  accentSoft: "#f0faf6",
  gray: "#cbd5e1",
};

/** ---------- UTILITIES ---------- */
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * @param time24 - Time in HH:MM format (e.g., "14:00")
 * @returns Time in 12-hour format (e.g., "2:00 PM")
 */
const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

type Availability = "available" | "few" | "unavailable";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameYMD(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function toISODateKey(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
function formatShort(d: Date) {
  // e.g., "Fri", "08 Nov"
  const day = dayNames[d.getDay()];
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = monthNames[d.getMonth()].slice(0, 3);
  return { top: day, mid: `${dd} ${mon}` };
}

/**
 * Build a per-day availability map for the calendar UI from REAL
 * `/booking/dates-with-slots` data. Days not present in `datesWithSlots`
 * (including days outside the fetched 60-day window) are treated as
 * unavailable rather than guessed — no synthetic/random data.
 */
function makeMonthAvailability(
  seedMonth: Date,
  datesWithSlots: { date: string; slotCount: number }[],
): Record<string, Availability> {
  const first = startOfMonth(seedMonth);
  const last = endOfMonth(seedMonth);
  const slotCountByDate = new Map(
    datesWithSlots.map((d) => [d.date, d.slotCount]),
  );
  const map: Record<string, Availability> = {};
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const key = toISODateKey(date);
    const slotCount = slotCountByDate.get(key) ?? 0;
    map[key] =
      slotCount === 0 ? "unavailable" : slotCount <= 2 ? "few" : "available";
  }
  return map;
}

export default function Step1SessionDetails({
  doctor,
  bookingData,
  setBookingData,
  onContinue,
  onBack,
}: Props) {
  // ========== STATE MANAGEMENT ==========
  const [selectedMode, setSelectedMode] = useState<string>(bookingData.mode);

  // Date/time state (preserve previous if any)
  const initialDate = bookingData.date ? new Date(bookingData.date) : null;
  const today = new Date();
  // Real availability isn't known yet on first render (it depends on the
  // `/booking/dates-with-slots` API call below), so default to showing
  // today and let the slots/dates effects correct the selection once real
  // data arrives.
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ?? today,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingData.time || "",
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dateStripRef = useRef<HTMLDivElement | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    startOfMonth(initialDate ?? new Date()),
  );

  // ========== REAL CLINICIAN DATA (from API) ==========
  // Fetch clinician details from API to get real database IDs
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(
    null,
  );
  const [selectedCentre, setSelectedCentre] = useState<Centre | null>(null);
  const [clinicianLoading, setClinicianLoading] = useState(true);

  // Fetch real clinician data on mount
  useEffect(() => {
    const fetchClinicianData = async () => {
      try {
        setClinicianLoading(true);

        // Fetch clinician by ID from API
        const response = await fetch(
          `${API_BASE_URL}/users/clinicians/${doctor.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clinician details");
        }

        const data = await response.json();
        const clinicianData = data.data;

        // Set clinician data
        setSelectedClinician({
          id: clinicianData.id,
          userId: clinicianData.userId,
          fullName: clinicianData.fullName,
          phone: clinicianData.phone,
          email: clinicianData.email,
          primaryCentreId: clinicianData.primaryCentreId,
          primaryCentreName: clinicianData.primaryCentreName,
          specialization: clinicianData.specialization,
          registrationNumber: clinicianData.registrationNumber,
          yearsOfExperience: clinicianData.yearsOfExperience,
          consultationFee: clinicianData.consultationFee,
          defaultDurationMinutes: clinicianData.defaultDurationMinutes,
          bio: clinicianData.bio,
          qualification: clinicianData.qualification,
          expertise: clinicianData.expertise || [],
          languages: clinicianData.languages || [],
          isActive: clinicianData.isActive,
        });

        // Fetch centre details
        const centreResponse = await fetch(
          `${API_BASE_URL}/centres/${clinicianData.primaryCentreId}`,
        );

        if (centreResponse.ok) {
          const centreData = await centreResponse.json();
          setSelectedCentre(centreData.data);
        } else if (import.meta.env.DEV) {
          // Dev-only fallback centre data if the centre API fails.
          setSelectedCentre({
            id: clinicianData.primaryCentreId,
            name: clinicianData.primaryCentreName,
            city: doctor.location.toLowerCase() as any,
            address_line_1: `${doctor.location} Centre`,
            address_line_2: null,
            pincode: "560001",
            contact_phone: "+919876543210",
            is_active: true,
          });
        } else {
          // Production: surface the real failure instead of a fabricated
          // centre record.
          throw new Error("Failed to fetch centre details");
        }
      } catch (error) {
        console.error("Error fetching clinician data:", error);
        if (import.meta.env.DEV) {
          // Dev-only fallback so the UI is still usable without a running
          // backend. Never used in production — real bookings must be tied
          // to a real clinician/centre record.
          setSelectedClinician({
            id: doctor.id,
            userId: Number(doctor.id),
            fullName: doctor.name,
            phone: "+919876543210",
            email: null,
            primaryCentreId: 1,
            primaryCentreName: `Mibo ${doctor.location}`,
            specialization: doctor.designation,
            registrationNumber: null,
            yearsOfExperience: parseInt(doctor.experience) || 5,
            consultationFee: 1600,
            defaultDurationMinutes: 50,
            bio: null,
            qualification: null,
            expertise: [],
            languages: [],
            isActive: true,
          });
          setSelectedCentre({
            id: 1,
            name: `Mibo ${doctor.location}`,
            city: doctor.location.toLowerCase() as any,
            address_line_1: `${doctor.location} Centre`,
            address_line_2: null,
            pincode: "560001",
            contact_phone: "+919876543210",
            is_active: true,
          });
        } else {
          // Production: don't fabricate a clinician/centre. Leave both
          // null so the UI shows a real error state instead of letting
          // someone book against fake data.
          setSelectedClinician(null);
          setSelectedCentre(null);
        }
      } finally {
        setClinicianLoading(false);
      }
    };

    fetchClinicianData();
  }, [
    doctor.id,
    doctor.name,
    doctor.location,
    doctor.designation,
    doctor.experience,
  ]);

  const modes = ["In-person", "Video call"];

  // ========== API STATE FOR REAL SLOTS ==========
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // ========== API STATE FOR DATES WITH SLOTS ==========
  const [datesWithSlots, setDatesWithSlots] = useState<
    { date: string; slotCount: number }[]
  >([]);
  const [datesLoading, setDatesLoading] = useState(false);

  // ========== COMPUTED VALUES ==========

  /** Month availability map - for calendar UI, derived from real API data */
  const availabilityMap = useMemo(
    () => makeMonthAvailability(calendarMonth, datesWithSlots),
    [calendarMonth, datesWithSlots],
  );

  // ========== FETCH DATES WITH SLOTS FROM API ==========
  /**
   * Fetch dates with available slots for the next 60 days
   */
  useEffect(() => {
    if (!selectedClinician || !selectedCentre) {
      setDatesWithSlots([]);
      return;
    }

    const fetchDatesWithSlots = async () => {
      try {
        setDatesLoading(true);

        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 60); // Next 60 days

        const startDateStr = toISODateKey(today);
        const endDateStr = toISODateKey(endDate);

        console.log(
          `Fetching dates with slots for clinician ${selectedClinician.id}, centre ${selectedCentre.id}, from ${startDateStr} to ${endDateStr}`,
        );

        const response = await fetch(
          `${API_BASE_URL}/booking/dates-with-slots?clinicianId=${selectedClinician.id}&centreId=${selectedCentre.id}&startDate=${startDateStr}&endDate=${endDateStr}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dates with slots");
        }

        const data = await response.json();
        console.log("Dates with slots response:", data);

        const realDates: { date: string; slotCount: number }[] =
          data.data || [];

        // ✅ FIX: Only use real API data, no fallback to mock slots
        setDatesWithSlots(realDates);

        // Auto-select first available date if no date is selected
        if (!selectedDate && realDates.length > 0) {
          const firstDate = new Date(realDates[0].date + "T00:00:00");
          setSelectedDate(firstDate);
          console.log("Auto-selected first available date:", firstDate);
        }
      } catch (error) {
        console.error("Error fetching dates with slots:", error);
        // ✅ FIX: Show empty state, no fallback to dummy data
        setDatesWithSlots([]);
      } finally {
        setDatesLoading(false);
      }
    };

    fetchDatesWithSlots();
  }, [selectedClinician, selectedCentre]);

  // ========== FETCH REAL SLOTS FROM API ==========
  /**
   * Fetch available slots from backend when date is selected
   */
  useEffect(() => {
    if (!selectedDate || !selectedClinician || !selectedCentre) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setSlotsError(null);

        // Format date as YYYY-MM-DD
        const dateStr = toISODateKey(selectedDate);

        // Call public API endpoint
        const response = await fetch(
          `${API_BASE_URL}/booking/available-slots?clinicianId=${selectedClinician.id}&centreId=${selectedCentre.id}&date=${dateStr}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch slots");
        }

        const data = await response.json();

        // API returns { success: true, data: { date, slots: [...] } }
        const slots = data.data?.slots || [];

        // Transform API response to match TimeSlot interface
        const transformedSlots: TimeSlot[] = slots.map((slot: any) => ({
          start_time: slot.startTime,
          end_time: slot.endTime,
          available: slot.available,
        }));

        // ✅ FIX: Only use real API data, no fallback to mock slots
        setAvailableSlots(transformedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlotsError(null);
        // ✅ FIX: Show empty state, no fallback to dummy slots
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedClinician, selectedCentre]);

  /**
   * Group available slots by period (Morning/Afternoon/Evening)
   * Uses REAL API data
   * Filters out:
   * 1. Booked slots (available: false)
   * 2. Unbooked slots that are less than 30 minutes away
   */
  const slotsByPeriod = useMemo(() => {
    const grouped: Record<string, TimeSlot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    // Get current time in IST for filtering
    const now = new Date();
    const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const istMinutesRaw = utcMinutes + istOffset;
    const currentISTMinutes = istMinutesRaw % (24 * 60);

    // Get current date in IST
    const istDate = new Date(now.getTime() + istOffset * 60 * 1000);
    const istYear = istDate.getUTCFullYear();
    const istMonth = istDate.getUTCMonth();
    const istDay = istDate.getUTCDate();

    // Check if selected date is today
    const selectedDateOnly = selectedDate
      ? new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        )
      : null;
    const todayIST = new Date(istYear, istMonth, istDay);
    const isToday =
      selectedDateOnly && selectedDateOnly.getTime() === todayIST.getTime();

    availableSlots.forEach((slot) => {
      // Filter 1: Remove booked slots completely
      if (!slot.available) {
        return; // Skip booked slots
      }

      // Filter 2: For today, remove unbooked slots 15 minutes or less away
      if (isToday) {
        const [slotHour, slotMinute] = slot.start_time.split(":").map(Number);
        const slotTimeMinutes = slotHour * 60 + slotMinute;

        // Calculate time difference in minutes
        const minutesUntilSlot = slotTimeMinutes - currentISTMinutes;

        // If slot is 15 minutes or less away (or in the past), skip it
        if (minutesUntilSlot <= 15) {
          return; // Skip slots 15 minutes or less away
        }
      }

      // Parse time to determine period
      const hour = parseInt(slot.start_time.split(":")[0]);

      if (hour < 12) {
        grouped.Morning.push(slot);
      } else if (hour < 17) {
        grouped.Afternoon.push(slot);
      } else {
        grouped.Evening.push(slot);
      }
    });

    return grouped;
  }, [availableSlots, selectedDate]);

  /**
   * Get periods that have available slots
   */
  const availablePeriods = useMemo(() => {
    return Object.keys(slotsByPeriod).filter(
      (period) => slotsByPeriod[period].length > 0,
    );
  }, [slotsByPeriod]);

  /** Horizontal pills: show dates with available slots */
  const dateStrip = useMemo(() => {
    if (datesWithSlots.length === 0) {
      return [];
    }

    return datesWithSlots.map(({ date, slotCount }) => {
      const d = new Date(date + "T00:00:00"); // Parse as local date
      const key = toISODateKey(d);
      return {
        date: d,
        key,
        availability: "available" as Availability,
        slots: slotCount,
      };
    });
  }, [datesWithSlots]);

  // periodsForSelected removed - now using availablePeriods from real API data

  // ========== EVENT HANDLERS ==========

  function handleChooseCalendarDay(day: Date, status: Availability) {
    if (status === "unavailable") return;
    setSelectedDate(day);
    setSelectedTime("");
    setCalendarOpen(false);
  }

  /**
   * Handle continue button click
   * Validates all required fields and saves booking data
   */
  function handleContinue() {
    if (
      !selectedMode ||
      !selectedCentre ||
      !selectedClinician ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    // Map mode to appointment type
    const appointmentType =
      selectedMode === "Video call"
        ? "ONLINE"
        : selectedMode === "Phone call"
          ? "PHONE"
          : "IN_PERSON";

    // Use real data from API. consultationFee is a required field on a
    // real clinician record — never fabricate it. defaultDurationMinutes
    // is optional in the type; only dev gets a placeholder if it's missing.
    const durationMinutes =
      selectedClinician.defaultDurationMinutes ??
      (import.meta.env.DEV ? 50 : 0);
    const consultationFee = selectedClinician.consultationFee;

    // Format date as YYYY-MM-DD to avoid timezone issues
    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    setBookingData({
      ...bookingData,
      mode: selectedMode,
      appointmentType,
      duration: `${durationMinutes} mins`,
      durationMinutes: durationMinutes,
      price: consultationFee,
      date: dateString,
      time: selectedTime,
      doctorId: doctor?.id,
      clinicianId: selectedClinician.id,
      clinicianName: selectedClinician.fullName,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      centreAddress: `${selectedCentre.address_line_1}${
        selectedCentre.address_line_2
          ? ", " + selectedCentre.address_line_2
          : ""
      }`,
    });
    onContinue();
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#e9f6f4] bg-scroll bg-cover bg-center bg-no-repeat md:bg-fixed"
      style={{
        backgroundImage: `url(${phoneVerifyBg})`,
      }}
    >
      {/* Loading State */}
      {clinicianLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034B44] mx-auto mb-4"></div>
            <p className="text-[#034B44]">Loading clinician details...</p>
          </div>
        </div>
      )}

      {/* Error State - clinician/centre could not be loaded from the backend */}
      {!clinicianLoading && (!selectedClinician || !selectedCentre) && (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <p className="text-lg text-red-600 mb-2">
            We couldn't load this clinician's details right now.
          </p>
          <p className="text-sm text-[#3a463f] mb-6">
            Please go back and try again in a moment.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-[#0e6b4f] text-white rounded-full hover:bg-[#0b5940] transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Main Content - Only show when clinician data is loaded */}
      {!clinicianLoading && selectedClinician && selectedCentre && (
        <>
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 h-fit">
            {/* <div className="mb-6 flex items-center gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14"
                style={{ background: MIBO.accentSoft }}
              >
                <CalendarDays className="h-7 w-7" style={{ color: MIBO.primary }} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Book your appointment
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Choose a session mode, date and time that works for you.
                </p>
              </div>
            </div> */}
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-[minmax(260px,300px)_minmax(320px,360px)_minmax(280px,1fr)] lg:gap-5 xl:grid-cols-[300px_360px_1fr] xl:gap-6">
              {/* ================= LEFT: shared booking summary sidebar ================= */}
              <BookingSummarySidebar
                doctor={doctor}
                currentStep={1}
                onBack={onBack}
              />

              {/* ================= MIDDLE: Mode of Session + Duration + Location ================= */}
              <div className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:p-6">
                <div className="mb-3.5 flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: MIBO.accentSoft }}
                  >
                    <Users
                      className="h-4.5 w-4.5"
                      style={{ color: MIBO.primary }}
                    />
                  </span>
                  <h3
                    className="text-base font-bold"
                    style={{ color: MIBO.primary }}
                  >
                    Mode of Session
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {modes.map((mode) => {
                    const Icon =
                      mode === "In-person"
                        ? MapPin
                        : mode === "Video call"
                          ? Video
                          : Phone;
                    const isSelected = selectedMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-2 py-4 transition-all duration-200 sm:px-3 sm:py-5 ${
                          isSelected
                            ? "shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                        }`}
                        style={
                          isSelected
                            ? {
                                background: MIBO.accentSoft,
                                borderColor: MIBO.primary,
                                color: MIBO.primary,
                              }
                            : {}
                        }
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">
                          {mode}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Session Duration */}
                {selectedClinician && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: MIBO.accentSoft }}
                      >
                        <Clock
                          className="h-4.5 w-4.5"
                          style={{ color: MIBO.primary }}
                        />
                      </span>
                      <h3
                        className="text-base font-bold"
                        style={{ color: MIBO.primary }}
                      >
                        Session Duration
                      </h3>
                    </div>
                    <div
                      className="flex flex-col items-stretch overflow-hidden rounded-xl border shadow-sm sm:flex-row"
                      style={{
                        borderColor: "#e5efeb",
                        background: MIBO.accentSoft,
                      }}
                    >
                      <div className="flex flex-1 items-center gap-2 px-4 py-3.5">
                        <Clock
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: MIBO.primary }}
                        />
                        <span
                          className="text-sm font-semibold whitespace-nowrap"
                          style={{ color: MIBO.primary }}
                        >
                          {selectedClinician.defaultDurationMinutes ??
                            (import.meta.env.DEV ? 50 : 0)}{" "}
                          mins, 1 session
                        </span>
                      </div>
                      <div
                        className="h-px w-full sm:h-auto sm:w-px sm:self-stretch"
                        style={{ background: "#d7e9e1" }}
                      />
                      <div className="flex items-center gap-1.5 px-4 py-3.5">
                        <IndianRupee
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: MIBO.primary }}
                        />
                        <span
                          className="text-sm font-semibold whitespace-nowrap"
                          style={{ color: MIBO.primary }}
                        >
                          {selectedClinician.consultationFee} / session
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                {selectedCentre && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="mb-2 flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: MIBO.accentSoft }}
                      >
                        <MapPin
                          className="h-4.5 w-4.5"
                          style={{ color: MIBO.primary }}
                        />
                      </span>
                      <h3
                        className="text-base font-bold"
                        style={{ color: MIBO.primary }}
                      >
                        Location
                      </h3>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedCentre.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {selectedCentre.address_line_1}
                      {selectedCentre.address_line_2 &&
                        `, ${selectedCentre.address_line_2}`}
                    </p>
                    <img
                      src={locationIllustration}
                      alt="Location illustration"
                      className="mt-4 h-28 w-full rounded-xl object-contain sm:h-36 lg:h-32 xl:h-40"
                      style={{ background: MIBO.accentSoft }}
                    />
                  </div>
                )}
              </div>

              {/* ================= RIGHT: Date and Time + Continue ================= */}
              <div className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:p-6 md:col-span-2 lg:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: MIBO.accentSoft }}
                    >
                      <CalendarDays
                        className="h-4.5 w-4.5"
                        style={{ color: MIBO.primary }}
                      />
                    </span>
                    <h3
                      className="text-base font-bold"
                      style={{ color: MIBO.primary }}
                    >
                      Date and Time
                    </h3>
                  </div>
                  <button
                    onClick={() => setCalendarOpen(true)}
                    className="rounded-lg border border-gray-200 p-2 transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                    aria-label="Open calendar"
                  >
                    <CalendarDays
                      className="h-5 w-5"
                      style={{ color: MIBO.primary }}
                    />
                  </button>
                </div>

                {/* Horizontal date pills */}
                <div className="relative">
                  {datesLoading && (
                    <div className="py-4 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-[#034B44]"></div>
                      <p className="mt-2 text-xs text-gray-600">
                        Loading available dates...
                      </p>
                    </div>
                  )}

                  {!datesLoading && dateStrip.length === 0 && (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                        <div>
                          <p className="text-xs font-medium text-yellow-800">
                            No slots available
                          </p>
                          <p className="mt-1 text-xs text-yellow-600">
                            No appointment slots are currently available for
                            this clinician.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!datesLoading && dateStrip.length > 0 && (
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        aria-label="Previous dates"
                        onClick={() =>
                          dateStripRef.current?.scrollBy({
                            left: -240,
                            behavior: "smooth",
                          })
                        }
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm sm:h-8 sm:w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div
                        ref={dateStripRef}
                        className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth py-1 sm:gap-3"
                      >
                        {dateStrip.map(({ date, key, availability, slots }) => {
                          const { top, mid } = formatShort(date);
                          const disabled = availability === "unavailable";
                          const selected = selectedDate
                            ? sameYMD(date, selectedDate)
                            : false;

                          const base =
                            "flex min-w-[72px] flex-col items-center justify-center gap-0.5 rounded-xl border px-2.5 py-2 text-center transition-all duration-200 sm:min-w-[84px] sm:px-3.5 sm:py-2.5";
                          let cls = "";
                          if (disabled) {
                            cls =
                              "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400";
                          } else if (selected) {
                            cls = "text-white shadow-md";
                          } else {
                            cls =
                              "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md";
                          }

                          return (
                            <button
                              key={key}
                              disabled={disabled}
                              onClick={() => {
                                setSelectedDate(date);
                                setSelectedTime("");
                              }}
                              className={`${base} ${cls}`}
                              style={
                                selected
                                  ? {
                                      background: MIBO.primary,
                                      borderColor: MIBO.primary,
                                    }
                                  : {}
                              }
                            >
                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wide ${
                                  selected
                                    ? "text-white/80"
                                    : disabled
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                }`}
                              >
                                {top}
                              </span>
                              <span className="text-[13px] font-semibold">
                                {mid}
                              </span>
                              <span
                                className={`text-[10px] ${
                                  selected
                                    ? "text-white/80"
                                    : disabled
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                }`}
                              >
                                {disabled ? "no slots" : `${slots} slots`}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        aria-label="Next dates"
                        onClick={() =>
                          dateStripRef.current?.scrollBy({
                            left: 240,
                            behavior: "smooth",
                          })
                        }
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm sm:h-8 sm:w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Time groups with real API data */}
                {selectedDate && slotsLoading && (
                  <div className="mt-4 py-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#034B44]"></div>
                    <p className="mt-2 text-sm text-gray-600">
                      Loading available slots...
                    </p>
                  </div>
                )}

                {selectedDate && slotsError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                      <div>
                        <p className="text-xs font-medium text-red-800">
                          Error loading slots
                        </p>
                        <p className="mt-1 text-xs text-red-600">
                          {slotsError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDate &&
                  !slotsLoading &&
                  !slotsError &&
                  availablePeriods.length > 0 && (
                    <div className="mt-4 flex-1 space-y-4">
                      {availablePeriods.map((period) => {
                        const Icon =
                          period === "Morning"
                            ? Sunrise
                            : period === "Afternoon"
                              ? Sun
                              : Moon;
                        const slots = slotsByPeriod[period];

                        return (
                          <div key={period} className="mb-4 last:mb-0">
                            <div className="mb-2 flex items-center gap-2">
                              <Icon
                                className="h-4 w-4"
                                style={{ color: MIBO.primary }}
                              />
                              <h4
                                className="text-sm font-semibold"
                                style={{ color: MIBO.primary }}
                              >
                                {period}
                              </h4>
                              <span className="text-xs text-gray-500">
                                ({slots.length} slot
                                {slots.length !== 1 ? "s" : ""})
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2 xl:grid-cols-4">
                              {slots.map((slot) => {
                                const active = selectedTime === slot.start_time;

                                return (
                                  <button
                                    key={slot.start_time}
                                    onClick={() =>
                                      setSelectedTime(slot.start_time)
                                    }
                                    className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-all hover:shadow-md sm:px-4 sm:py-2 sm:text-sm ${
                                      active
                                        ? ""
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    }`}
                                    style={
                                      active
                                        ? {
                                            background: MIBO.primary,
                                            color: "#fff",
                                            borderColor: MIBO.primary,
                                            transform: "scale(1.03)",
                                          }
                                        : {}
                                    }
                                  >
                                    {formatTime12Hour(slot.start_time)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* If selected date has no availability */}
                {selectedDate &&
                  !slotsLoading &&
                  !slotsError &&
                  availablePeriods.length === 0 && (
                    <div className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                        <div>
                          <p className="text-xs font-medium text-yellow-800">
                            No slots available
                          </p>
                          <p className="mt-1 text-xs text-yellow-600">
                            No time slots are available for this date. Please
                            select another date.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Helper note + Continue */}
                <div className="mt-5 border-t border-gray-100 pt-5 pb-20 sm:pb-0">
                  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                    <p className="text-xs text-indigo-800">
                      Please make sure you have selected Mode of Session, Date
                      and Time before continuing
                    </p>
                  </div>

                  {/* Desktop / tablet inline button */}
                  <button
                    onClick={handleContinue}
                    disabled={
                      !selectedMode ||
                      !selectedCentre ||
                      !selectedClinician ||
                      !selectedDate ||
                      !selectedTime
                    }
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled)
                        e.currentTarget.style.background = MIBO.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = MIBO.primary;
                    }}
                    className="hidden w-full flex-shrink-0 items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:ml-auto sm:flex sm:w-auto sm:justify-start"
                    style={{ background: MIBO.primary, color: "#fff" }}
                  >
                    CONTINUE
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Mobile: floating pill button, centered at the bottom of the viewport */}
                  <div
                    className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pt-2 sm:hidden"
                    style={{ background: "white" }}
                  >
                    <button
                      onClick={handleContinue}
                      disabled={
                        !selectedMode ||
                        !selectedCentre ||
                        !selectedClinician ||
                        !selectedDate ||
                        !selectedTime
                      }
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled)
                          e.currentTarget.style.background = MIBO.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = MIBO.primary;
                      }}
                      className="flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold shadow-[0_8px_24px_rgba(3,75,68,0.35)] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      style={{ background: MIBO.primary, color: "#fff" }}
                    >
                      CONTINUE
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------- Calendar Modal (Custom Tailwind) -------- */}
          {calendarOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={() => setCalendarOpen(false)}
              />
              <div className="absolute bottom-0 left-1/2 flex max-h-[92vh] w-full max-w-md -translate-x-1/2 flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:bottom-auto sm:top-1/2 sm:max-h-[85vh] sm:-translate-y-1/2 sm:rounded-2xl">
                {/* Modal header */}
                <div className="flex-shrink-0 border-b border-gray-100 px-5 pb-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">Choose a date</div>
                    <button
                      onClick={() => setCalendarOpen(false)}
                      className="rounded-lg p-2 hover:bg-gray-50"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      className="rounded-lg p-2 hover:bg-gray-50"
                      onClick={() => {
                        setCalendarMonth(addMonths(calendarMonth, -1));
                      }}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="font-medium">
                      {monthNames[calendarMonth.getMonth()]}{" "}
                      {calendarMonth.getFullYear()}
                    </div>
                    <button
                      className="rounded-lg p-2 hover:bg-gray-50"
                      onClick={() => {
                        setCalendarMonth(addMonths(calendarMonth, 1));
                      }}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Legend (Mibo variants) */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: MIBO.primary }}
                      />
                      Slots available
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: MIBO.gray }}
                      />
                      No slots
                    </span>
                  </div>
                </div>

                {/* Scrollable body: calendar grid, so tall months never get cut off on short screens */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  <div className="mb-2 grid grid-cols-7 text-center text-xs text-gray-500">
                    {dayNames.map((d) => (
                      <div key={d} className="py-1">
                        {d[0]}
                      </div>
                    ))}
                  </div>

                  <CalendarMonthGrid
                    month={calendarMonth}
                    availabilityMap={availabilityMap}
                    selectedDate={selectedDate}
                    onPick={handleChooseCalendarDay}
                    datesWithSlots={datesWithSlots}
                  />

                  {/* Bottom space (safe area) */}
                  <div className="h-4" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Renders the days for a given month with availability dots */
function CalendarMonthGrid({
  month,
  availabilityMap,
  selectedDate,
  onPick,
  datesWithSlots,
}: {
  month: Date;
  availabilityMap: Record<string, Availability>;
  selectedDate: Date | null;
  onPick: (day: Date, status: Availability) => void;
  datesWithSlots: { date: string; slotCount: number }[];
}) {
  const first = startOfMonth(month);
  const last = endOfMonth(month);
  const days: { date: Date; status: Availability; hasSlots: boolean }[] = [];

  // Create a map of dates with slots for quick lookup
  const slotsMap = new Map(datesWithSlots.map((d) => [d.date, d.slotCount]));

  // Pad empty cells before 1st
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) {
    days.push({ date: new Date(NaN), status: "unavailable", hasSlots: false });
  }
  // Actual days
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const key = toISODateKey(date);
    const hasSlots = slotsMap.has(key);
    const status = hasSlots ? "available" : "unavailable";
    days.push({ date, status, hasSlots });
  }

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {days.map(({ date, status, hasSlots }, idx) => {
        if (isNaN(date.getTime())) {
          return <div key={`pad-${idx}`} />;
        }
        const today = new Date();
        const isPast =
          date <
          new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const disabled = !hasSlots || isPast;
        const isSelected = selectedDate ? sameYMD(date, selectedDate) : false;

        return (
          <button
            key={toISODateKey(date)}
            onClick={() => onPick(date, status)}
            disabled={disabled}
            className={`relative aspect-square rounded-xl border text-sm flex flex-col items-center justify-center transition
      ${
        disabled
          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border-gray-200 hover:shadow"
      }
      ${isSelected ? "ring-2 ring-offset-2 ring-[#034B44]" : ""}
    `}
          >
            <div className="text-[13px] font-medium">{date.getDate()}</div>
            {hasSlots && (
              <span
                className="mt-1 inline-block w-2.5 h-2.5 rounded-full"
                style={{
                  background: MIBO.primary,
                  opacity: disabled ? 0.6 : 1,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}