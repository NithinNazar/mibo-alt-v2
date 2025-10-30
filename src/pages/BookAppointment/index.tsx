// src/pages/BookAppointment/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { doctors } from "../Experts/data/doctors";
import Step1SessionDetails from "./Step1SessionDetails";
import Step2PhoneVerification from "./Step2PhoneVerification";
import Step3ConfirmBooking from "./Step3ConfirmBooking";
import Step4PaymentSuccess from "./Step4PaymentSuccess";

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId?: string }>();
  const navigate = useNavigate();
  const doctor = doctorId
    ? doctors.find((d) => d.id === Number(doctorId))
    : undefined;

  const [step, setStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<any>({
    mode: "In-person",
    duration: "30 mins",
    price: 1500,
    date: "",
    time: "",
    phone: "",
  });

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Doctor not found.
      </div>
    );
  }

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-[#e9f6f4] text-[#034B44] flex flex-col">
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
          bookingData={bookingData}
          setBookingData={setBookingData}
          onContinue={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 3 && (
        <Step3ConfirmBooking
          // doctor={doctor}
          bookingData={bookingData}
          // onContinue={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 4 && <Step4PaymentSuccess />}
    </div>
  );
}
