import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail } from "lucide-react";

const ContactSection = () => {
  const offices = [
    {
      city: "Bangalore Office",
      address:
        "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041",
    },
    {
      city: "Kochi Office",
      address:
        "38/1818, Kannanthodath Road, Near Changampuzha Park Metro Station, Edappally P.O., Kochi, Ernakulam, PIN: 682024",
    },
    {
      city: "Mumbai Office",
      address:
        "Sayba Emerald, 207/208, above Burger King, opposite Bandra Railway Station, Bandra West, Mumbai, Maharashtra 400050",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offices.length]);

  return (
    <section className="w-full bg-[#0a0a7a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Still not sure what to do?
          </h2>
          <p className="text-base flex items-center justify-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-[#97f7df]" />
            Please call us, we will sort it out
          </p>
          <p className="text-[#97f7df] text-lg md:text-xl font-bold">
            +91 90833 35000
          </p>
        </div>

        {/* Auto Slider */}
        <div className="relative w-full overflow-hidden h-[160px] md:h-[130px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-[#0a0a7a] border border-[#97f7df] rounded-xl p-4 md:p-5 max-w-md w-[90%] shadow-md">
                <h3 className="text-lg font-semibold text-[#97f7df] mb-2">
                  {offices[currentIndex].city}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {offices[currentIndex].address}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {offices.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full ${
                idx === currentIndex ? "bg-[#97f7df]" : "bg-white/40"
              }`}
            ></button>
          ))}
        </div>

        {/* Email */}
        <div className="mt-4">
          <h3 className="text-sm md:text-base font-semibold mb-1 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-[#97f7df]" /> Email Us
          </h3>
          <p className="text-[#97f7df] text-base font-medium">
            reach@mibocare.com
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
