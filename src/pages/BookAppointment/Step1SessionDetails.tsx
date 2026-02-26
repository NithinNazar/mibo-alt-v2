// src/pages/BookAppointment/Step1SessionDetails.tsx
import type { Doctor } from "../Experts/data/doctors";
import { useMemo, useState, useEffect } from "react";
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
  X,
  AlertCircle,
} from "lucide-react";
import type { Clinician, Centre, TimeSlot } from "../../types";
import { API_BASE_URL } from "../../services/api";

interface Props {
  doctor: Doctor;
  bookingData: any;
  setBookingData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

/** ---------- MIBO THEME ---------- */
const MIBO = {
  primary: "#0a107d",
  accent: "#94f7ed",
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

/** Create a static-but-natural looking availability map for a month */
function makeMonthAvailability(seedMonth: Date): Record<string, Availability> {
  const first = startOfMonth(seedMonth);
  const last = endOfMonth(seedMonth);
  const map: Record<string, Availability> = {};
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dow = date.getDay();
    // Weekend: fewer/unavailable more often
    let status: Availability;
    if (dow === 0) status = "unavailable";
    else if (dow === 6) status = "few";
    else {
      // Weekdays: mix
      const r = (date.getDate() * 7 + (seedMonth.getMonth() + 1)) % 10;
      status = r < 2 ? "few" : r < 8 ? "available" : "unavailable";
    }
    map[toISODateKey(date)] = status;
  }
  return map;
}

// Removed getPeriodsFor - now using generateMockSlots for dynamic slot generation

// Removed TIME_SLOTS - now using real API data from availableSlots

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
  const initialAvailableToday = makeMonthAvailability(startOfMonth(today));
  const todayKey = toISODateKey(today);
  const isTodayAvailable =
    initialAvailableToday[todayKey] &&
    initialAvailableToday[todayKey] !== "unavailable";

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ?? (isTodayAvailable ? today : null),
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingData.time || "",
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
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
        } else {
          // Fallback centre data if API fails
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
        }
      } catch (error) {
        console.error("Error fetching clinician data:", error);
        // Set fallback data to prevent UI from breaking
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

  const modes = ["In-person", "Video call", "Phone call"];

  // ========== API STATE FOR REAL SLOTS ==========
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // ========== COMPUTED VALUES ==========

  /** Month availability map - for calendar UI */
  const availabilityMap = useMemo(
    () => makeMonthAvailability(calendarMonth),
    [calendarMonth],
  );

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

        setAvailableSlots(transformedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlotsError("Failed to load available slots");
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedClinician, selectedCentre]);

  /**
   * Group available slots by period (Morning/Afternoon/Evening)
   * Uses REAL API data instead of mock
   */
  const slotsByPeriod = useMemo(() => {
    const grouped: Record<string, TimeSlot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    availableSlots.forEach((slot) => {
      if (!slot.available) return;

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
  }, [availableSlots]);

  /**
   * Get periods that have available slots
   */
  const availablePeriods = useMemo(() => {
    return Object.keys(slotsByPeriod).filter(
      (period) => slotsByPeriod[period].length > 0,
    );
  }, [slotsByPeriod]);

  /** Horizontal pills: show next 10 days starting today */
  const dateStrip = useMemo(() => {
    const days: {
      date: Date;
      key: string;
      availability: Availability;
      slots: number;
    }[] = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = toISODateKey(d);
      // if month changed, compute on that month too
      const map =
        d.getMonth() === calendarMonth.getMonth() &&
        d.getFullYear() === calendarMonth.getFullYear()
          ? availabilityMap
          : makeMonthAvailability(startOfMonth(d));
      const av = map[key] ?? "unavailable";
      const slots =
        av === "unavailable"
          ? 0
          : av === "few"
            ? ((d.getDate() % 3) + 1) * 2
            : ((d.getDate() % 4) + 2) * 2; // 2–8
      days.push({ date: d, key, availability: av, slots });
    }
    return days;
  }, [availabilityMap, calendarMonth]);

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

    setBookingData({
      ...bookingData,
      mode: selectedMode,
      appointmentType,
      duration: "50 mins",
      durationMinutes: 50,
      price: 1600,
      date: selectedDate.toISOString(),
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
    <div className="flex flex-col min-h-screen">
      {/* Loading State */}
      {clinicianLoading && (
        <div className="flex items-center justify-center h-screen bg-[#e9f6f4]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034B44] mx-auto mb-4"></div>
            <p className="text-[#034B44]">Loading clinician details...</p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when clinician data is loaded */}
      {!clinicianLoading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-30">
            <button
              onClick={onBack}
              className="text-[18px]"
              style={{ color: MIBO.primary }}
            >
              ←
            </button>
            <h2 className="text-lg font-semibold">Book your session</h2>
            <div className="w-6" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {/* Doctor Info Card - Show selected doctor from expert page */}
            {doctor && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{doctor.name}</div>
                    <div className="text-sm text-gray-600">
                      {doctor.designation}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {doctor.location} • {doctor.sessionTypes}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Centre Selection UI - COMMENTED OUT - Auto-selected based on doctor location */}
            {/* {!centresLoading && !centresError && centres.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: MIBO.primary }}>
              Select Centre
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {centres.map((centre) => {
                const isSelected = selectedCentre?.id === centre.id;
                return (
                  <button
                    key={centre.id}
                    onClick={() => handleCentreChange(centre)}
                    className={`p-4 rounded-xl border transition-all text-left shadow-md ${
                      isSelected
                        ? "shadow-lg"
                        : "bg-white border-gray-300 hover:shadow-lg"
                    }`}
                    style={
                      isSelected
                        ? {
                            background: MIBO.accent,
                            borderColor: MIBO.primary,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: isSelected ? MIBO.primary : "#6b7280" }}
                      />
                      <div className="flex-1">
                        <div
                          className="font-semibold text-sm"
                          style={{
                            color: isSelected ? MIBO.primary : "#1f2937",
                          }}
                        >
                          {centre.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {centre.address_line_1}
                          {centre.address_line_2 &&
                            `, ${centre.address_line_2}`}
                        </div>
                        {centre.contact_phone && (
                          <div className="text-xs text-gray-500 mt-1">
                            {centre.contact_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )} */}

            {/* Clinician Selection UI - COMMENTED OUT - Auto-selected from expert page */}
            {/* {selectedCentre && (
          <>
            {!cliniciansLoading &&
              !cliniciansError &&
              clinicians.length > 0 && (
                <div>
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: MIBO.primary }}
                  >
                    Select Clinician
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {clinicians.map((clinician) => {
                      const isSelected = selectedClinician?.id === clinician.id;
                      return (
                        <button
                          key={clinician.id}
                          onClick={() => handleClinicianChange(clinician)}
                          className={`p-4 rounded-xl border transition-all text-left shadow-md ${
                            isSelected
                              ? "shadow-lg"
                              : "bg-white border-gray-300 hover:shadow-lg"
                          }`}
                          style={
                            isSelected
                              ? {
                                  background: MIBO.accent,
                                  borderColor: MIBO.primary,
                                }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ background: MIBO.primary }}
                            >
                              {clinician.full_name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div
                                className="font-semibold"
                                style={{
                                  color: isSelected ? MIBO.primary : "#1f2937",
                                }}
                              >
                                {clinician.full_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {clinician.specialization ||
                                  "General Practitioner"}
                              </div>
                              {clinician.experience_years && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {clinician.experience_years} years experience
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {!cliniciansLoading &&
              !cliniciansError &&
              clinicians.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        No clinicians available
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        No clinicians are currently available at this centre.
                        Please select a different centre.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </>
        )} */}

            {/* Mode of Session (unchanged) */}
            <div>
              <h3 className="font-semibold mb-2">Mode of Session</h3>
              <div className="flex gap-3">
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
                      className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                        isSelected
                          ? "shadow-lg"
                          : "bg-white border-gray-300 text-gray-500 hover:shadow-lg"
                      }`}
                      style={
                        isSelected
                          ? {
                              background: MIBO.accent,
                              borderColor: MIBO.primary,
                              color: MIBO.primary,
                            }
                          : {}
                      }
                    >
                      <Icon className="w-7 h-7 mb-1" />
                      <span className="text-sm font-medium">{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location (unchanged) */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" style={{ color: MIBO.primary }} />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="text-sm text-gray-700">
                Mibo Mental Health Centre —{" "}
                {doctor.name.split(" ")[1] ?? "City"}
              </p>
            </div>

            {/* ----------------- NEW REDESIGN BEGINS ----------------- */}

            {/* Session Duration (compact, price on right) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span
                    className="font-semibold"
                    style={{ color: MIBO.primary }}
                  >
                    50 mins, 1 session
                  </span>
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: MIBO.primary }}
                >
                  ₹1600 / session
                </div>
              </div>
            </div>

            {/* Date and Time (single block like Amaha) */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: MIBO.primary }}>
                  Date and Time
                </h3>
                <button
                  onClick={() => setCalendarOpen(true)}
                  className="p-2 rounded-lg border border-gray-200 hover:shadow-sm transition"
                  aria-label="Open calendar"
                >
                  <CalendarDays
                    className="w-5 h-5"
                    style={{ color: MIBO.primary }}
                  />
                </button>
              </div>

              {/* Horizontal date pills (no cutoff at top) */}
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
                  {dateStrip.map(({ date, key, availability, slots }) => {
                    const { top, mid } = formatShort(date);
                    const disabled = availability === "unavailable";
                    const selected = selectedDate
                      ? sameYMD(date, selectedDate)
                      : false;

                    const base =
                      "flex flex-col items-center justify-center px-4 py-3 min-w-[92px] rounded-xl border text-center transition-all duration-200";
                    let cls = "";
                    if (disabled) {
                      cls =
                        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
                    } else if (selected) {
                      cls = "scale-[1.03] shadow-md text-gray-900";
                    } else {
                      cls =
                        "bg-white border-gray-300 text-gray-700 hover:shadow-md";
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
                                background: MIBO.accent,
                                borderColor: MIBO.primary,
                              }
                            : {}
                        }
                      >
                        <span className="font-medium text-xs">{top}</span>
                        <span className="text-[13px]">{mid}</span>
                        <span
                          className={`text-[11px] ${
                            disabled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {slots > 0 ? `${slots} slots` : "No slots"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time groups with real API data */}
              {selectedDate && slotsLoading && (
                <div className="mt-4 text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a107d]"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading available slots...
                  </p>
                </div>
              )}

              {selectedDate && slotsError && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-800">
                        Error loading slots
                      </p>
                      <p className="text-xs text-red-600 mt-1">{slotsError}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedDate &&
                !slotsLoading &&
                !slotsError &&
                availablePeriods.length > 0 && (
                  <div className="mt-4 space-y-4">
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
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              className="w-4 h-4"
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
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.map((slot) => {
                              const active = selectedTime === slot.start_time;
                              return (
                                <button
                                  key={slot.start_time}
                                  onClick={() =>
                                    setSelectedTime(slot.start_time)
                                  }
                                  disabled={!slot.available}
                                  className="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                                  {slot.start_time}
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
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800">
                          No slots available
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          No time slots are available for this date. Please
                          select another date.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Sticky Continue */}
          <div className="sticky bottom-0 bg-white border-t">
            <div className="p-4">
              <button
                onClick={handleContinue}
                disabled={
                  !selectedCentre ||
                  !selectedClinician ||
                  !selectedDate ||
                  !selectedTime
                }
                className="w-full py-3 rounded-full font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: MIBO.primary, color: "#fff" }}
              >
                CONTINUE
              </button>
            </div>
          </div>

          {/* -------- Calendar Modal (Custom Tailwind) -------- */}
          {calendarOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={() => setCalendarOpen(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-md rounded-t-2xl bg-white shadow-xl">
                {/* Modal header */}
                <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">Choose a date</div>
                    <button
                      onClick={() => setCalendarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setCalendarMonth(addMonths(calendarMonth, -1));
                      }}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="font-medium">
                      {monthNames[calendarMonth.getMonth()]}{" "}
                      {calendarMonth.getFullYear()}
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setCalendarMonth(addMonths(calendarMonth, 1));
                      }}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Legend (Mibo variants) */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: MIBO.primary }}
                      />
                      Available
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: MIBO.accent }}
                      />
                      Few slots
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: MIBO.gray }}
                      />
                      Unavailable
                    </span>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="px-4 py-3">
                  <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
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
                  />
                </div>

                {/* Bottom space (safe area) */}
                <div className="h-4" />
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
}: {
  month: Date;
  availabilityMap: Record<string, Availability>;
  selectedDate: Date | null;
  onPick: (day: Date, status: Availability) => void;
}) {
  const first = startOfMonth(month);
  const last = endOfMonth(month);
  const days: { date: Date; status: Availability }[] = [];

  // Pad empty cells before 1st
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) {
    days.push({ date: new Date(NaN), status: "unavailable" });
  }
  // Actual days
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const key = toISODateKey(date);
    const status = availabilityMap[key] ?? "unavailable";
    days.push({ date, status });
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(({ date, status }, idx) => {
        if (isNaN(date.getTime())) {
          return <div key={`pad-${idx}`} />;
        }
        const today = new Date();
        const isPast =
          date <
          new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const disabled = status === "unavailable" || isPast;
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
      ${isSelected ? "ring-2 ring-offset-2 ring-[#0a107d]" : ""}
    `}
          >
            <div className="text-[13px] font-medium">{date.getDate()}</div>
            <span
              className="mt-1 inline-block w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  status === "available"
                    ? MIBO.primary
                    : status === "few"
                      ? MIBO.accent
                      : MIBO.gray,
                opacity: disabled ? 0.6 : 1,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// // src/pages/BookAppointment/Step1SessionDetails.tsx
// import type { Doctor } from "../Experts/data/doctors";
// import { useState } from "react";
// import {
//   MapPin,
//   Video,
//   Phone,
//   Clock,
//   CalendarDays,
//   Clock4,
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface Props {
//   doctor: Doctor;
//   bookingData: any;
//   setBookingData: (data: any) => void;
//   onContinue: () => void;
//   onBack: () => void;
// }

// export default function Step1SessionDetails({
//   doctor,
//   bookingData,
//   setBookingData,
//   onContinue,
//   onBack,
// }: Props) {
//   const [selectedMode, setSelectedMode] = useState<string>(bookingData.mode);
//   const [selectedDuration, setSelectedDuration] = useState<string>(
//     bookingData.duration
//   );
//   const [selectedDate, setSelectedDate] = useState<Date | null>(
//     bookingData.date ? new Date(bookingData.date) : null
//   );
//   const [selectedTime, setSelectedTime] = useState<string>(bookingData.time);

//   const modes = ["In-person", "Video call", "Phone call"];
//   const durations = [
//     { label: "30 mins", price: 1500 },
//     { label: "60 mins", price: 2500 },
//   ];
//   const times = ["10:00 AM", "1:00 PM", "5:00 PM"];

//   const handleContinue = () => {
//     setBookingData({
//       ...bookingData,
//       mode: selectedMode,
//       duration: selectedDuration,
//       date: selectedDate ? selectedDate.toDateString() : "",
//       time: selectedTime,
//       price: durations.find((d) => d.label === selectedDuration)?.price ?? 1500,
//       doctorId: doctor.id,
//     });
//     onContinue();
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
//         <button onClick={onBack} className="text-[#034B44] text-lg">
//           ←
//         </button>
//         <h2 className="text-lg font-semibold">Book your session</h2>
//         <div className="w-6" />
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
//         {/* Doctor quick info */}
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <div className="flex items-center gap-4">
//             <img
//               src={doctor.image}
//               alt={doctor.name}
//               className="w-16 h-16 rounded-lg object-cover"
//             />
//             <div>
//               <div className="font-semibold">{doctor.name}</div>
//               <div className="text-sm text-gray-600">{doctor.designation}</div>
//             </div>
//           </div>
//         </div>

//         {/* Mode of Session */}
//         <div>
//           <h3 className="font-semibold mb-2">Mode of Session</h3>
//           <div className="flex gap-3">
//             {modes.map((mode) => {
//               const Icon =
//                 mode === "In-person"
//                   ? MapPin
//                   : mode === "Video call"
//                   ? Video
//                   : Phone;
//               const isSelected = selectedMode === mode;
//               return (
//                 <button
//                   key={mode}
//                   onClick={() => setSelectedMode(mode)}
//                   className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
//                     isSelected
//                       ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg"
//                       : "bg-white border-gray-300 text-gray-500 hover:shadow-lg"
//                   }`}
//                 >
//                   <Icon className="w-7 h-7 mb-1" />
//                   <span className="text-sm font-medium">{mode}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Location */}
//         <div className="bg-white rounded-xl p-4 shadow-md">
//           <div className="flex items-center gap-2 mb-2">
//             <MapPin className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Location</h3>
//           </div>
//           <p className="text-sm text-gray-700">
//             Mibo Mental Health Centre — {doctor.name.split(" ")[1] ?? "City"}
//           </p>
//         </div>

//         {/* NEW: Date Picker (Moved Up) */}
//         <div className="bg-white rounded-xl p-5 shadow-md">
//           <div className="flex items-center gap-2 mb-3">
//             <CalendarDays className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Select Date</h3>
//           </div>
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             minDate={new Date()}
//             placeholderText="click to select a date"
//             className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1425b8]"
//             calendarClassName="rounded-xl shadow-lg border border-gray-200"
//             dateFormat="EEE, MMM d, yyyy"
//           />
//         </div>

//         {/* Time */}
//         <div className="bg-white rounded-xl p-5 shadow-md overflow-visible">
//           <div className="flex items-center gap-2 mb-3">
//             <Clock4 className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Select Time</h3>
//           </div>
//           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
//             {times.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setSelectedTime(t)}
//                 className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
//                   selectedTime === t
//                     ? "bg-[#d2fafa] border-[#d2fafa] text-[#034B44] shadow-lg scale-[1.02]"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Duration */}
//         <div className="bg-white rounded-xl p-4 shadow-md">
//           <div className="flex items-center gap-2 mb-2">
//             <Clock className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Session Duration</h3>
//           </div>
//           <div className="flex gap-3">
//             {durations.map((dur) => (
//               <button
//                 key={dur.label}
//                 onClick={() => setSelectedDuration(dur.label)}
//                 className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 shadow-md hover:shadow-lg ${
//                   selectedDuration === dur.label
//                     ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg scale-[1.02]"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 <span className="text-sm font-medium">{dur.label}</span>
//                 <span className="text-xs">₹{dur.price}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Continue Button */}
//       <div className="p-4 sticky bottom-0 bg-white border-t">
//         <button
//           onClick={handleContinue}
//           disabled={!selectedDate || !selectedTime}
//           className="w-full py-3 bg-[#0e0a73] text-white font-semibold rounded-full disabled:opacity-10"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }
