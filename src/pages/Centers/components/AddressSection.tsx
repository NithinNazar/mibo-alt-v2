import React from "react";

interface Props {
  city: string;
}

const AddressSection: React.FC<Props> = ({ city }) => (
  <section className="py-12 bg-[#E3F7F1] text-center">
    <h2 className="text-2xl md:text-3xl font-bold text-[#1C3D3A] mb-4">
      {city} Office
    </h2>
    <p className="text-sm md:text-base max-w-xl mx-auto text-[#0F4C36]">
      22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East,
      Jayanagar, Bengaluru, Karnataka 560041
    </p>
    <p className="mt-2 text-xs md:text-sm text-[#0F4C36]/80">
      Open Mon–Sat, 9:00 AM – 7:00 PM | Contact: +91 99999 88888
    </p>
  </section>
);

export default AddressSection;
