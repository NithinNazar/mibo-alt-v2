// src/pages/BookAppointment/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import clinicianService from "../../services/clinicianService";
import authService from "../../services/authService";
import type { Doctor } from "../Experts/data/doctors";
import { dummyDoctors } from "../Experts/data/dummyDoctors";
import Step1SessionDetails from "./Step1SessionDetails";
import Step2PhoneVerification from "./Step2PhoneVerification";
import Step3ConfirmBooking from "./Step3ConfirmBooking";
import Step4PaymentSuccess from "./Step4PaymentSuccess";

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId?: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<number>(1);

  const [bookingData, setBookingData] = useState<any>({
    mode: "", // No default mode - user must choose
    duration: "30 mins",
    price: 1500,
    date: "",
    time: "",
    phone: "",
    authenticated: false,
  });

  // Fetch doctor data on mount and when doctorId changes
  useEffect(() => {
    const fetchDoctor = async () => {
      // If no doctorId is provided, fall back to the first dummy doctor
      if (!doctorId) {
        const dummy = dummyDoctors[0]; 
        if (dummy) {
          console.warn("No doctor ID provided — using dummy doctor data.");
          setDoctor(dummy);
          setLoading(false);
          return;
        }
        setError("No doctor ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all clinicians and find the matching one
        const clinicians = await clinicianService.getClinicians();

        // Find clinician by ID (handle both string and number IDs)
        const clinician = clinicians.find(
          (c: any) =>
            String(c.id) === String(doctorId) ||
            parseInt(c.id) === parseInt(doctorId),
        );

        if (!clinician) {
          // No matching real clinician (or none at all) — fall back to dummy data
          const dummy =
            dummyDoctors.find((d) => String(d.id) === String(doctorId)) ||
            dummyDoctors[0];
          if (dummy) {
            console.warn(
              "Clinician not found via API — using dummy doctor data instead.",
            );
            setDoctor(dummy);
            setLoading(false);
            return;
          }
          setError("Doctor not found");
          setLoading(false);
          return;
        }

        // Transform to Doctor format
        const specialization = Array.isArray(clinician.specialization)
          ? clinician.specialization.join(", ")
          : clinician.specialization || "";

        const qualification = Array.isArray(clinician.qualification)
          ? clinician.qualification.join(", ")
          : clinician.qualification || "";

        const transformedDoctor: Doctor = {
          id: parseInt(String(clinician.id)),
          name: clinician.fullName || "",
          qualification,
          designation: specialization,
          experience: `${clinician.yearsOfExperience || 0}+ years`,
          expertise: clinician.expertise || [],
          image: clinician.profilePictureUrl || "/default-avatar.png",
          location: (clinician.primaryCentreName || "Bangalore") as
            | "Bangalore"
            | "Kochi"
            | "Mumbai",
          language: clinician.languages || ["English"],
          price: `₹${clinician.consultationFee || 0}/session`,
          sessionTypes: getSessionTypes(clinician.consultationModes || []),
        };

        setDoctor(transformedDoctor);
        setLoading(false);
      } catch (err) {
        // API unreachable (e.g. no backend running) — fall back to dummy data
        console.warn(
          "Failed to fetch doctor from API — using dummy doctor data instead:",
          err,
        );
        const dummy =
          dummyDoctors.find((d) => String(d.id) === String(doctorId)) ||
          dummyDoctors[0];
        if (dummy) {
          setDoctor(dummy);
        } else {
          setError("Failed to load doctor information");
        }
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Check authentication status on mount and when auth changes
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();

      if (isAuth && user) {
        // User is already logged in - pre-fill booking data
        setBookingData((prev: any) => ({
          ...prev,
          phone: user.phone,
          authenticated: true,
        }));
        console.log("✅ User already authenticated:", user.full_name);
      }
    };

    checkAuth();

    // Listen for auth changes (login/logout in other tabs)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const getSessionTypes = (modes: string[]) => {
    if (modes.includes("ONLINE") && modes.includes("IN_PERSON")) {
      return "In-person & Online sessions";
    } else if (modes.includes("ONLINE")) {
      return "Online sessions";
    } else if (modes.includes("IN_PERSON")) {
      return "In-person sessions";
    } else {
      return "In-person & Online sessions";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-[#eef6f2] text-[#0a2e23]">
        Loading doctor information...
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#eef6f2] text-red-600">
        <p className="text-xl mb-4">{error || "Doctor not found."}</p>
        <button
          onClick={() => navigate("/experts")}
          className="px-6 py-2 bg-[#0e6b4f] text-white rounded-full hover:bg-[#0b5940] transition"
        >
          Back to Experts
        </button>
      </div>
    );
  }

  const nextStep = () => {
    // Smart step navigation: Skip Step 2 if user is already authenticated
    if (step === 1 && bookingData.authenticated) {
      console.log("⏭️ Skipping phone verification - user already logged in");
      setStep(3); // Skip to payment step
    } else {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    // Smart back navigation: Skip Step 2 if user was authenticated
    if (step === 3 && bookingData.authenticated) {
      console.log(
        "⏮️ Going back to session details - skipping phone verification",
      );
      setStep(1); // Go back to session details
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <>
      {step === 1 && (
        <Step1SessionDetails
          doctor={doctor}
          bookingData={bookingData}
          setBookingData={setBookingData}
          onContinue={nextStep}
          onBack={() => navigate(-1)}
        />
      )}
      {step === 2 && (
        <Step2PhoneVerification
          doctor={doctor}
          bookingData={bookingData}
          setBookingData={setBookingData}
          onContinue={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 3 && (
        <Step3ConfirmBooking
          doctor={doctor}
          bookingData={bookingData}
          // onContinue={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 4 && <Step4PaymentSuccess />}
    </>
  );
}