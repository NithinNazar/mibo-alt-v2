// PatientDashboard.tsx - Updated to fetch from API
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import patientDashboardService from "../../services/patientDashboardService";
import {
  CalendarDays,
  MapPin,
  Stethoscope,
  Clock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  History,
  Activity,
  Phone,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Appointment {
  id: number;
  clinician_name: string;
  centre_name: string;
  appointment_type: string;
  scheduled_start_at: string;
  scheduled_end_at?: string;
  duration_minutes?: number;
  status: string;
  consultation_fee?: number;
  notes?: string;
  google_meet_link?: string;
  meet_link?: string;
}

interface DashboardData {
  patient: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  };
  statistics?: {
    totalAppointments?: number;
    completedAppointments?: number;
    upcomingAppointments?: number;
    totalSpent?: number;
  };
  upcomingAppointments: Appointment[];
  recentAppointments: Appointment[];
}

export default function PatientDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await patientDashboardService.getDashboard();

      if (response.success) {
        setDashboardData(response.data as DashboardData);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err: any) {
      console.error("Error loading dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    if (!selectedAppointment?.id) {
      setCancelError("Appointment ID not found");
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      const accessToken = localStorage.getItem("mibo_access_token");
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

      const response = await fetch(
        `${apiBaseUrl}/patient/appointments/${selectedAppointment.id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: cancelReason.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel appointment");
      }

      // Reload dashboard data
      await loadDashboardData();

      // Close modal
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason("");
    } catch (err: any) {
      console.error("Cancellation error:", err);
      setCancelError(err.message || "Failed to cancel appointment");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#034B44] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-6 py-3 bg-[#034B44] text-white rounded-full hover:bg-[#046e63] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!dashboardData || dashboardData.upcomingAppointments.length === 0) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#034B44]/10">
              <CalendarDays className="text-[#034B44]" size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No current appointments
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You do not have any upcoming sessions scheduled. Book a session
              with a clinician to get started.
            </p>
            {dashboardData?.statistics?.totalAppointments &&
              dashboardData.statistics.totalAppointments > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  You have {dashboardData.statistics.totalAppointments} past
                  appointment
                  {dashboardData.statistics.totalAppointments !== 1
                    ? "s"
                    : ""}.{" "}
                  <button
                    onClick={() => navigate("/appointments")}
                    className="text-[#034B44] font-medium hover:underline"
                  >
                    View history
                  </button>
                </p>
              )}
            <button
              onClick={() => navigate("/experts")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#034B44] text-white rounded-full text-sm font-medium hover:bg-[#046e63] transition"
            >
              Book an appointment
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show empty state if no upcoming appointments
  if (
    !dashboardData ||
    !dashboardData.upcomingAppointments ||
    dashboardData.upcomingAppointments.length === 0
  ) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <CalendarDays className="w-20 h-20 mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No current appointments
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You do not have any upcoming sessions scheduled. Book a session
              with a clinician to get started.
            </p>
            {dashboardData?.statistics?.totalAppointments &&
              dashboardData.statistics.totalAppointments > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  You have {dashboardData.statistics.totalAppointments} past
                  appointment
                  {dashboardData.statistics.totalAppointments !== 1
                    ? "s"
                    : ""}.{" "}
                  <button
                    onClick={() => navigate("/appointments")}
                    className="text-[#034B44] font-medium hover:underline"
                  >
                    View history
                  </button>
                </p>
              )}
            <button
              onClick={() => navigate("/experts")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#034B44] text-white rounded-full text-sm font-medium hover:bg-[#046e63] transition"
            >
              Book an appointment
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  // Render dashboard with appointments
  return (
    <>
      <ProfileHeader />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Welcome + summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Welcome back, {dashboardData?.patient.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Phone size={16} className="text-[#034B44]" />
                <span>
                  {dashboardData.patient.phone.startsWith("91")
                    ? `+${dashboardData.patient.phone}`
                    : `+91${dashboardData.patient.phone}`}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-medium inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                {dashboardData?.statistics?.upcomingAppointments || 0} upcoming
              </div>
              <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium inline-flex items-center gap-2">
                <Activity size={16} />
                {dashboardData?.statistics?.totalAppointments || 0} total
              </div>
            </div>
          </motion.div>

          {/* Show all upcoming appointments */}
          <div className="space-y-6">
            {dashboardData.upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#2a1470] to-[#034B44] text-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {index === 0
                          ? "Next Appointment"
                          : `Upcoming Appointment #${index + 1}`}
                      </h2>
                      <p className="text-xs opacity-80">
                        Booking reference: #{appointment.id}
                      </p>
                    </div>
                    <div className="text-right text-xs opacity-80">
                      <p>Mibo Mental Health</p>
                      <p>Your care, personalised</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Stethoscope className="text-[#2a1470]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Clinician
                        </p>
                        <p className="font-medium">
                          {appointment.clinician_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <MapPin className="text-[#034B44]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Centre
                        </p>
                        <p className="font-medium">{appointment.centre_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <CalendarDays className="text-[#2a1470]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Date
                        </p>
                        <p className="font-medium">
                          {new Date(
                            appointment.scheduled_start_at,
                          ).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                        <Clock className="text-[#034B44]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Time and duration
                        </p>
                        <p className="font-medium">
                          {new Date(
                            appointment.scheduled_start_at,
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {appointment.duration_minutes || 50} mins
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Google Meet Link for Online Appointments */}
                  {appointment.appointment_type === "ONLINE" &&
                    (appointment.google_meet_link || appointment.meet_link) && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Online Consultation Link
                            </p>
                            <p className="text-xs text-blue-700 mb-3">
                              Join your session using Google Meet
                            </p>
                            <a
                              href={
                                appointment.google_meet_link ||
                                appointment.meet_link
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M22.547 9.548l-6.547 5.452v-4.55c-6.627 0-12 5.373-12 12 0 1.26.195 2.476.558 3.611-2.557-2.983-4.108-6.868-4.108-11.111 0-9.389 7.611-17 17-17v-4.55l6.547 5.452-1.45 1.696z" />
                              </svg>
                              Join Google Meet
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
                    <p className="text-gray-500">
                      {appointment.appointment_type === "ONLINE"
                        ? "Join the online session from a quiet space."
                        : "Please reach the centre 10–15 minutes before your scheduled time."}
                    </p>

                    <div className="flex gap-2">
                      {appointment.status !== "CANCELLED" && (
                        <>
                          <button
                            onClick={() => navigate("/experts")}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Book another
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowCancelModal(true);
                            }}
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <XCircle size={14} className="mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="text-green-600" size={16} />
                    <span>
                      Status:{" "}
                      <span className="font-medium text-green-600">
                        Confirmed
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mode:{" "}
                    {appointment.appointment_type === "ONLINE"
                      ? "Online"
                      : "In-Person"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Appointments
                </p>
                <History size={16} className="text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData?.statistics?.totalAppointments || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData?.statistics?.completedAppointments || 0}{" "}
                completed
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Spent
                </p>
                <CreditCard size={16} className="text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                ₹{(dashboardData?.statistics?.totalSpent || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </p>
                <Activity size={16} className="text-gray-400" />
              </div>
              <div className="space-y-2 mt-3">
                <button
                  onClick={() => navigate("/appointments")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View all appointments
                </button>
                <button
                  onClick={() => navigate("/profile-settings")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Update profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Cancel Appointment
                </h3>
                <p className="text-xs text-gray-500">
                  Appointment #{selectedAppointment.id}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this appointment? Your
                cancellation request will be sent to the admin for approval.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Refund will be processed only after
                  admin approval. This may take 3-5 business days.
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-red-400 focus:outline-none resize-none"
                rows={4}
                disabled={isCancelling}
              />
              {cancelError && (
                <p className="text-xs text-red-600 mt-2">{cancelError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason("");
                  setCancelError("");
                }}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
