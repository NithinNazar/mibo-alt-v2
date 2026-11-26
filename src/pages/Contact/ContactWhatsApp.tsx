import React from "react";
import { MessageCircle } from "lucide-react";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";
import { DEFAULT_WHATSAPP_URL, DEFAULT_PHONE_DISPLAY } from "../../utils/contact";

const headingFont = {
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
};

const ContactWhatsApp: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white text-[#16241f] font-['Inter',sans-serif]">
      <ExpertsHeader />

      <section className="flex flex-col items-center justify-center text-center pt-[120px] sm:pt-[140px] pb-20 px-4 sm:px-6 min-h-[70vh] bg-gradient-to-b from-[#f8fcfa] to-white">
        <h1
          className="text-[26px] sm:text-3xl md:text-[42px] font-extrabold text-[#0a2e23] mb-2 tracking-tight leading-tight"
          style={headingFont}
        >
          General Enquiries on WhatsApp
        </h1>
        <div className="w-14 h-[3px] bg-[#138158] mx-auto my-4 rounded-full" />
        <p className="max-w-xl mx-auto text-[14px] sm:text-[15.5px] font-medium text-[#637268] mb-10">
          Chat with our team on WhatsApp for appointments and general
          enquiries. Tap the icon below to start a conversation.
        </p>

        <a
          href={DEFAULT_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Mibo on WhatsApp"
          className="group flex flex-col items-center gap-4"
        >
          <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#25D366] shadow-lg transition-transform group-hover:scale-105">
            <MessageCircle size={40} className="text-white" fill="white" />
          </span>
          <span className="text-sm font-bold text-[#0e6b4f] group-hover:text-[#138158] transition-colors">
            Chat on WhatsApp &middot; {DEFAULT_PHONE_DISPLAY}
          </span>
        </a>
      </section>

      <ExpertsFooter />
    </div>
  );
};

export default ContactWhatsApp;