import React from "react";
import { therapists } from "../data/doctors";
import SectionTitle from "./SectionTitle";
import DoctorCard from "./DoctorCard";
import ViewAllButton from "./ViewAllButton";

interface Props {
  city: string;
}

const TopTherapists: React.FC<Props> = ({ city }) => (
  <section className="py-12 bg-mibo-teal-light">
    <SectionTitle
      title={`Top Rated Therapists in ${city}`}
      subtitle="Connect with highly qualified therapists for one-on-one sessions tailored to your needs."
    />
    <div className="flex overflow-x-auto px-4 pb-4 scrollbar-hide">
      {therapists.map((doc, i) => (
        <DoctorCard key={i} doctor={doc} />
      ))}
    </div>
    <div className="text-center mt-6">
      <ViewAllButton label="View All Therapists" />
    </div>
  </section>
);

export default TopTherapists;
