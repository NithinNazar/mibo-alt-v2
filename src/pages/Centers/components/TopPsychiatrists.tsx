import React from "react";
import { psychiatrists } from "../data/doctors";
import SectionTitle from "./SectionTitle";
import DoctorCard from "./DoctorCard";
import ViewAllButton from "./ViewAllButton";

interface Props {
  city: string;
}

const TopPsychiatrists: React.FC<Props> = ({ city }) => (
  <section className="py-12 bg-mibo-offwhite">
    <SectionTitle
      title={`Top Rated Psychiatrists in ${city}`}
      subtitle="Meet our experienced psychiatrists who provide compassionate, science-backed care."
    />
    <div className="flex overflow-x-auto px-4 pb-4 scrollbar-hide">
      {psychiatrists.map((doc, i) => (
        <DoctorCard key={i} doctor={doc} />
      ))}
    </div>
    <div className="text-center mt-6">
      <ViewAllButton label="View All Psychiatrists" />
    </div>
  </section>
);

export default TopPsychiatrists;
