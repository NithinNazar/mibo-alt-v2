import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    department: "",
    doctor: "",
    date: "",
    mrNumber: "",
  });

  const doctors = [
    "Dr. Arjun Menon",
    "Dr. Priya Nair",
    "Dr. Ananya Rao",
    "Dr. Kiran Dev",
    "Dr. Meera Thomas",
  ];

  const departments = [
    "Depression",
    "Anxiety Disorders",
    "Bipolar Disorder",
    "OCD (Obsessive Compulsive Disorder)",
    "PTSD (Post-Traumatic Stress Disorder)",
    "Schizophrenia",
    "Addiction Recovery",
    "Personality Disorders",
    "Sleep Disorders",
    "Eating Disorders",
    "Stress Management",
    "Panic Disorders",
    "Adolescent Mental Health",
    "Geriatric Psychiatry",
    "Neurodevelopmental Disorders",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/appointment-confirmation", { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4f6] to-[#d9f1ee] flex flex-col items-center pt-28 pb-12 px-4">
      <div className="w-full max-w-lg mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#1c0d54] font-semibold hover:text-[#34b9a5] transition-colors"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1c0d54]">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Patient / Visitor Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Contact Number*
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Location*
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            >
              <option value="">Select a Location</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kochi">Kochi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Department*
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            >
              <option value="">Select a Department</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Select Doctor*
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            >
              <option value="">Select a Doctor</option>
              {doctors.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Appointment Date*
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              MR Number (Optional)
            </label>
            <input
              type="text"
              name="mrNumber"
              value={formData.mrNumber}
              onChange={handleChange}
              placeholder="Enter MR Number if available"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#34b9a5] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#34b9a5] text-white py-3 rounded-full font-semibold hover:bg-[#2a857f] transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookAppointmentPage;
