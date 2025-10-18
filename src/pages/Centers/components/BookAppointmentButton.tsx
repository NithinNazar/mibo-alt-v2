import React from "react";

interface Props {
  onClick?: () => void; // Optional click handler
}

const BookAppointmentButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex justify-center py-8 bg-mibo-offwhite">
      <button
        onClick={onClick}
        className="bg-[#83b0f7] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-[#6a94d1] transition duration-300 text-lg"
      >
        Book Appointment Now
      </button>
    </div>
  );
};

export default BookAppointmentButton;
