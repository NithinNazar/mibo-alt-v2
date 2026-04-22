import React from "react";

// Bangalore experts
import drMiller from "../../Landing/Dr. Miller.webp";
import drSrinivas from "../../Landing/Dr. Srinivas Reddy.webp";
import shifana from "../../Landing/Shifana Sidheeque.webp";
import yashaswini from "../../Landing/Yashaswini.webp";

// Kochi experts
import drMuhammed from "../../Landing/Dr.Muhammed.webp";
import drAnu from "../../Landing/DrAnuSobha.webp";
import drThomasMathai from "../../Landing/DrThomasMathai.webp";
import drHridya from "../../Landing/Hridya.webp";

interface Expert {
  image: string;
  name: string;
  specialization: string;
}

interface MeetOurExpertsProps {
  city: "Bengaluru" | "Kochi" | "Mumbai";
}

const MeetOurExperts: React.FC<MeetOurExpertsProps> = ({ city }) => {
  const bangaloreExperts: Expert[] = [
    {
      image: drMiller,
      name: "Dr. Miller A M",
      specialization:
        "Consultant Psychiatrist, 5+ Years of Expereince In mergency Psychiaty, Community care and Queer mental health.",
    },
    {
      image: drSrinivas,
      name: "Dr. Srinivas Reddy V",
      specialization:
        "Consultant Psychiatrist, 15+ Years Of Experience In Adult Psychiatry & De-addiction",
    },
    {
      image: shifana,
      name: "Shifana Sidheeque TK ",
      specialization:
        "Clinical Psychologist, 4+ Years Of Experience In CBT, DBT,Schema Therapy, SFBT Behaviour modification",
    },
    {
      image: yashaswini,
      name: "Ms. Yashaswini",
      specialization:
        "Clinical Psychologist, 3+ Years Of Experience In CBT, DBT,Mindfullness Approach",
    },
  ];

  const kochiExperts: Expert[] = [
    {
      image: drMuhammed,
      name: "Dr. Muhammed Sadik TM",
      specialization: "Clinical Psychologist, 10+ Years Of Experience",
    },
    {
      image: drAnu,
      name: "Dr.Anu Sobha Jose",
      specialization:
        "Consultant Psychiatrist, 10+ Years Of Experience In Women Mental Health, De-addiction, Child and Adolescent Psychiatry",
    },
    {
      image: drThomasMathai,
      name: "Dr.Thomas Mathai",
      specialization: "Consultant Psychiatrist, 7+ Years Of Experience",
    },
    {
      image: drHridya,
      name: "Hridya VM",
      specialization:
        "Clinical Psychologist, 7+ Years Of Experience In Adult Population, Depression, OCD, Personality Disorder, Marital Issues, Attachment Styles",
    },
  ];

  // Use Bangalore experts for Mumbai as requested
  const experts = city === "Kochi" ? kochiExperts : bangaloreExperts;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-miboLightGreen/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
          Meet Our Psychologists & Psychiatrists
        </h2>

        <p className="text-center text-miboText text-lg font-semibold mb-16 max-w-3xl mx-auto">
          Our experienced mental health professionals are dedicated to providing
          compassionate and evidence-based care.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {experts.map((expert, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden text-center"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[#212154] mb-1">
                  {expert.name}
                </h3>

                <p className="text-miboText font-semibold">
                  {expert.specialization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurExperts;
