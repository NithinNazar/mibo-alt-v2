import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  LogOut,
  Edit2,
  Save,
  X,
} from "lucide-react";

interface UserProfile {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  userType: string;
  patientId: number;
}

interface PaymentSummary {
  totalPaid: number;
  totalAppointments: number;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    totalPaid: 0,
    totalAppointments: 0,
    lastPaymentDate: null,
    lastPaymentAmount: null,
  });

  // Edit mode states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    loadUserData();
    loadPaymentSummary();
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem("mibo_user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setEditedName(userData.full_name || "");
        setEditedEmail(userData.email || "");
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  };

  const loadPaymentSummary = () => {
    // Load from localStorage for now
    // TODO: Replace with API call to fetch payment history
    const latestBooking = localStorage.getItem("latestBooking");

    if (latestBooking) {
      try {
        const booking = JSON.parse(latestBooking);
        if (booking.paymentStatus === "PAID") {
          setPaymentSummary({
            totalPaid: booking.amount || booking.price || 1600,
            totalAppointments: 1,
            lastPaymentDate: booking.date || new Date().toISOString(),
            lastPaymentAmount: booking.amount || booking.price || 1600,
          });
        }
      } catch (error) {
        console.error("Failed to parse booking:", error);
      }
    }
  };

  const handleSaveName = () => {
    if (!editedName.trim()) return;

    // Update localStorage
    if (user) {
      const updatedUser = { ...user, full_name: editedName.trim() };
      localStorage.setItem("mibo_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    setIsEditingName(false);
    // TODO: Call API to update name on backend
  };

  const handleSaveEmail = () => {
    // Update localStorage
    if (user) {
      const updatedUser = { ...user, email: editedEmail.trim() || null };
      localStorage.setItem("mibo_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    setIsEditingEmail(false);
    // TODO: Call API to update email on backend
  };

  const handleLogout = () => {
    // Clear all data
    localStorage.removeItem("mibo_access_token");
    localStorage.removeItem("mibo_refresh_token");
    localStorage.removeItem("mibo_user");
    localStorage.removeItem("latestBooking");

    navigate("/");
  };

  if (!user) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#034B44] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProfileHeader />
      <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#034B44] to-[#046e63] px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Full Name */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 flex-1">
                    <User className="text-gray-400" size={20} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      {isEditingName ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-800">
                          {user.full_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditingName ? (
                      <>
                        <button
                          onClick={handleSaveName}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setEditedName(user.full_name);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-2 text-[#034B44] hover:bg-[#034B44]/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 flex-1">
                    <Mail className="text-gray-400" size={20} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Email Address
                      </p>
                      {isEditingEmail ? (
                        <input
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-800">
                          {user.email || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditingEmail ? (
                      <>
                        <button
                          onClick={handleSaveEmail}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingEmail(false);
                            setEditedEmail(user.email || "");
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="p-2 text-[#034B44] hover:bg-[#034B44]/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium text-gray-800">
                        {user.phone.startsWith("91")
                          ? `+${user.phone}`
                          : `+91${user.phone}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#2a1470] to-[#1c0d54] px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Total Paid</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{paymentSummary.totalPaid.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Total Appointments
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {paymentSummary.totalAppointments}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Last Payment</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {paymentSummary.lastPaymentAmount
                        ? `₹${paymentSummary.lastPaymentAmount.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {paymentSummary.lastPaymentDate && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Last payment on{" "}
                      <span className="font-medium text-gray-800">
                        {new Date(
                          paymentSummary.lastPaymentDate
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield size={20} />
                  Account Information
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="font-medium text-gray-800">
                        {new Date().toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Type</p>
                      <p className="font-medium text-gray-800">Patient</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Bell className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Notifications
                      </p>
                      <p className="font-medium text-gray-800">
                        WhatsApp & Email
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Enabled
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                <LogOut size={20} />
                Logout from Account
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
