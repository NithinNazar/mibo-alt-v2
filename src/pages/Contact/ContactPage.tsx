import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";
import CallButton from "../../components/CallButton";
import {
  BANGALORE_PHONE_DISPLAY,
  BANGALORE_TEL_LINK,
  DEFAULT_PHONE_DISPLAY,
  DEFAULT_TEL_LINK,
  KOCHI_PHONE_DISPLAY,
  KOCHI_TEL_LINK,
} from "../../utils/contact";
import kochiImg from "../Centers/assets/mibo-kochi-contact.png?w=900&format=webp&quality=75";
import bengaluruImg from "../Centers/assets/mibo-banglore-contact.png?w=900&format=webp&quality=75";

const EMAIL = "reach@mibocare.com";

interface CentreContact {
  id: string;
  name: string;
  image: string;
  address: string;
  phoneDisplay: string;
  telLink: string;
}

// Addresses and numbers match the Kochi / Bengaluru landing pages and
// utils/contact.ts (each centre uses its own number).
const CENTRES: CentreContact[] = [
  {
    id: "kochi",
    name: "Kochi Centre",
    image: kochiImg,
    address:
      "13/1818, Kannanthodathu Rd, near Changampuzha Park Metro Station, Devankulangara, Mamangalam, Edappally, Kochi, Ernakulam, Kerala 682024",
    phoneDisplay: KOCHI_PHONE_DISPLAY,
    telLink: KOCHI_TEL_LINK,
  },
  {
    id: "bengaluru",
    name: "Bengaluru Centre",
    image: bengaluruImg,
    address:
      "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041",
    phoneDisplay: BANGALORE_PHONE_DISPLAY,
    telLink: BANGALORE_TEL_LINK,
  },
];

const headingFont = {
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
};

const ContactPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white text-[#16241f] font-['Inter',sans-serif]">
      <ExpertsHeader />

      {/* Title band */}
      <section className="text-center pt-[92px] sm:pt-[110px] md:pt-[120px] pb-8 sm:pb-10 px-4 sm:px-6 bg-gradient-to-b from-[#f8fcfa] to-white">
        <h1
          className="text-[26px] sm:text-3xl md:text-[42px] font-extrabold text-[#0a2e23] mb-2 tracking-tight leading-tight"
          style={headingFont}
        >
          Contact Our Centres
        </h1>
        <div className="w-14 h-[3px] bg-[#138158] mx-auto my-4 rounded-full" />
        <p className="max-w-xl mx-auto text-[14px] sm:text-[15.5px] font-medium text-[#637268]">
          Reach out to the centre most convenient for you. Our teams can assist
          with appointments and enquiries.
        </p>
      </section>

      {/* Centre cards */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {CENTRES.map((c) => (
            <article
              key={c.id}
              className="bg-white rounded-[18px] border border-[#e6ede9] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <img
                src={c.image}
                alt={`Mibo ${c.name}`}
                loading="lazy"
                className="w-full h-48 md:h-72 object-cover"
              />
              <div className="flex-1 flex flex-col items-center text-center px-6 md:px-10 pt-8 pb-9">
                <h2
                  className="text-2xl font-bold text-[#0a2e23] mb-5"
                  style={headingFont}
                >
                  {c.name}
                </h2>

                <div className="space-y-4 text-sm text-[#637268] leading-relaxed">
                  <div>
                    <p className="font-bold text-[#16241f] flex items-center justify-center gap-1.5">
                      <MapPin size={14} className="text-[#138158]" />
                      Address:
                    </p>
                    <p className="mt-1">{c.address}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#16241f] flex items-center justify-center gap-1.5">
                      <Phone size={14} className="text-[#138158]" />
                      Phone:
                    </p>
                    <a
                      href={c.telLink}
                      className="mt-1 inline-block hover:text-[#0e6b4f] transition-colors"
                    >
                      {c.phoneDisplay}
                    </a>
                  </div>
                  <div>
                    <p className="font-bold text-[#16241f] flex items-center justify-center gap-1.5">
                      <Mail size={14} className="text-[#138158]" />
                      Email:
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1 inline-block hover:text-[#0e6b4f] transition-colors"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>

                <a
                  href={c.telLink}
                  className="mt-7 inline-flex items-center justify-center bg-[#0e6b4f] hover:bg-[#138158] text-white text-sm font-bold px-7 py-3 rounded-full transition-colors"
                >
                    <Phone size={14} className="text-[#ffffff]" /> &nbsp;
                  Call Now
                </a>
                <a
                  href={DEFAULT_TEL_LINK}
                  className="mt-3 text-sm font-semibold text-[#637268] hover:text-[#0e6b4f] transition-colors"
                >
                  {/* {DEFAULT_PHONE_DISPLAY} */}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CallButton label="General enquiries:" />
        </div>
      </section>

      <ExpertsFooter />
    </div>
  );
};

export default ContactPage;