import React from "react";
import ShapeTitle from "./ShapeTitle";
import FallbackImage from "../../../components/FallbackImage";

import team1 from "../assets/team1.png?w=400&format=webp&quality=85";
import team2 from "../assets/team2.png?w=400&format=webp&quality=85";
import team3 from "../assets/team3.png?w=400&format=webp&quality=85";
import team4 from "../assets/team4.png?w=400&format=webp&quality=85";

const TeamSection: React.FC = () => {
  const teamRow1 = [team1, team2, team3, team4];
  const teamRow2 = [team3, team4, team1, team2];

  const renderTeamRow = (row: (string | undefined)[], startIndex: number) =>
    row.map((img, i) => (
      <div
        key={i}
        className="min-w-[150px] flex-shrink-0 flex flex-col items-center"
      >
        <FallbackImage
          src={img}
          alt={`Leader ${i + startIndex}`}
          className="w-32 h-32 object-cover rounded-full shadow-md"
          fallbackColor="#cce3de"
        />
        <p className="mt-3 text-[#0a3d62] font-semibold font-[Quicksand]">
          Name {i + startIndex}
        </p>
        <p className="text-sm text-[#2b2b2b]/70 font-[Quicksand]">Position</p>
      </div>
    ));

  return (
    <section className="py-20 px-6 md:px-20 bg-[#cce3de]/30">
      <div className="max-w-6xl mx-auto text-center">
        <ShapeTitle title="Meet Our Leaders" />
        <p className="text-[#2b2b2b] text-lg mb-10 font-[Quicksand]">
          Our leadership team brings together clinical expertise, compassion,
          and innovation to shape the future of mental healthcare.
        </p>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {renderTeamRow(teamRow1, 1)}
        </div>

        <div className="flex gap-6 overflow-x-auto mt-8">
          {renderTeamRow(teamRow2, 5)}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
