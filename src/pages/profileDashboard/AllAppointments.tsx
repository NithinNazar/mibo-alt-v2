import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import patientDashboardService from "../../services/patientDashboardService";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Video,
  Building2,
} from "lucide-react";

interface Appointment {
  id: number;
  clinician_name: string;
  centre_name: string;
  appointment_type: string;
  scheduled_start_at: string;
  scheduled_end_at: string;
  duration_minutes?: number;
  status: string;
  consultation_fee?: number;
  notes?: string | null;
  created_at?: string;
}

export default function AllAppointments() {
  const navigate = useNavigate();
  const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>(
    []
  );
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await patientDashboardService.getAppointments();

      if (response.success) {
        const appointments = response.data.appointments;

        // Categorize appointments
        const now = new Date();
        const upcoming = appointments.filter(
          (apt) =>
            new Date(apt.scheduled_start_at) > now &&
            apt.status !== "CANCELLED" &&
            apt.status !== "COMPLETED"
        );

        const past = appointments.filter(
          (apt) =>
            new Date(apt.scheduled_start_at) <= now ||
            apt.status === "COMPLETED" ||
            apt.status === "CANCELLED"
        );

        setCurrentAppointments(upcoming);
        setPastAppointments(past);
      } else {
        setError("Failed to load appointments");
      }
    } catch (err: any) {
      console.error("Error loading appointments:", err);
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (appointment: Appointment) => {
    switch (appointment.status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle2 size={14} />
            Confirmed
          </span>
        );
      case "CANCELLED":
      case "CANCELLATION_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <XCircle size={14} />
            Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <CheckCircle2 size={14} />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {appointment.status}
          </span>
        );
    }
  };

  const AppointmentCard = ({
    appointment,
    isPast,
  }: {
    appointment: Appointment;
    isPast: boolean;
  }) => {
    const appointmentDate = new Date(appointment.scheduled_start_at);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl border ${
          isPast ? "border-gray-200" : "border-[#034B44]/20"
        } shadow-sm hover:shadow-md transition-all p-5`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${
                isPast ? "bg-gray-100" : "bg-[#034B44]/10"
              } flex items-center justify-center`}
            >
              <Calendar
                className={isPast ? "text-gray-600" : "text-[#034B44]"}
                size={24}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Appointment #{appointment.id}
              </h3>
              <p className="text-xs text-gray-500">
                {appointmentDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {getStatusBadge(appointment)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="text-gray-400" size={18} />
            <div>
              <p className="text-xs text-gray-500">Clinician</p>
              <p className="font-medium text-gray-800">
                {appointment.clinician_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <MapPin className="text-gray-400" size={18} />
            <div>
              <p className="text-xs text-gray-500">Centre</p>
              <p className="font-medium text-gray-800">
                {appointment.centre_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-medium text-gray-800">
                  {appointmentDate.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {appointment.appointment_type === "ONLINE" ? (
                <Video className="text-gray-400" size={18} />
              ) : (
                <Building2 className="text-gray-400" size={18} />
              )}
              <div>
                <p className="text-xs text-gray-500">Mode</p>
                <p className="font-medium text-gray-800">
                  {appointment.appointment_type === "ONLINE"
                    ? "Online"
                    : "In-Person"}
                </p>
              </div>
            </div>
          </div>

          {appointment.consultation_fee && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Consultation Fee</span>
                <span className="font-semibold text-[#034B44]">
                  ₹{appointment.consultation_fee.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isPast && appointment.status === "CONFIRMED" && (
          <button
            onClick={() => navigate("/profileDashboard")}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#034B44] text-white rounded-lg hover:bg-[#046e63] transition-colors text-sm font-medium"
          >
            View Details
            <ArrowRight size={16} />
          </button>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#034B44] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
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
              Error Loading Appointments
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadAppointments}
              className="px-6 py-3 bg-[#034B44] text-white rounded-full hover:bg-[#046e63] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProfileHeader />
      <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Appointments
            </h1>
            <p className="text-gray-600">
              View and manage all your appointments
            </p>
          </div>

          {/* Current Appointments */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Appointments
              </h2>
              <span className="text-sm text-gray-500">
                {currentAppointments.length} appointment
                {currentAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            {currentAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isPast={false}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No current appointments
                </h3>
                <p className="text-gray-600 mb-6">
                  You don't have any upcoming appointments scheduled
                </p>
                <button
                  onClick={() => navigate("/experts")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#034B44] text-white rounded-full hover:bg-[#046e63] transition-colors font-medium"
                >
                  Book an Appointment
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Past Appointments
              </h2>
              <span className="text-sm text-gray-500">
                {pastAppointments.length} appointment
                {pastAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            {pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isPast={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No past appointments
                </h3>
                <p className="text-gray-600">
                  Your completed appointments will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
