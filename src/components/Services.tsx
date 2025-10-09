import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight, ChevronDown, User, Users, Monitor } from "lucide-react";
import inPatientImg from "../assets/In-patient.jpg";
import inPersonImg from "../assets/in-person.jpg";
import onlineImg from "../assets/online.jpg";

type Service = {
  id: string;
  title: string;
  icon: ReactNode;
  description: string;
  details: string;
};

type Condition = {
  id: string;
  title: string;
  color: string;
  icon: ReactNode;
  description: string;
  symptoms: string[];
  treatments: string[];
};

const MentalHealthServices = () => {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"home" | "detail">("home");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null
  );

  // Service background images
  const getServiceImage = (serviceId: string) => {
    const images = {
      "in-patient": inPatientImg,
      "in-person": inPersonImg,
      online: onlineImg,
    };

    return images[serviceId as keyof typeof images] || images["in-person"];
  };

  const services: Service[] = [
    {
      id: "in-patient",
      title: "In-Patient",
      icon: <User className="w-6 h-6" />,
      description:
        "Comprehensive residential care for intensive mental health treatment",
      details: "Comprehensive care in a supportive residential environment",
    },
    {
      id: "in-person",
      title: "In-Person",
      icon: <Users className="w-6 h-6" />,
      description:
        "Face-to-face therapy sessions with qualified mental health professionals",
      details: "Personalized therapy with experienced professionals",
    },
    {
      id: "online",
      title: "Online Services",
      icon: <Monitor className="w-6 h-6" />,
      description:
        "Convenient virtual therapy and counseling sessions from anywhere",
      details: "Virtual therapy sessions from anywhere you feel comfortable",
    },
  ];

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  // const goToConditionDetail = (condition: Condition) => {
  //   setSelectedCondition(condition);
  //   setCurrentPage('detail');
  // };

  const goToHome = () => {
    setCurrentPage("home");
    setSelectedCondition(null);
  };

  if (currentPage === "detail" && selectedCondition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#aef0e6] via-white to-[#aef0e6] ">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goToHome}
              className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
              Back to Services
            </button>
            <div
              className={`${selectedCondition.color} rounded-2xl p-8 text-white shadow-2xl`}
            >
              <div className="flex items-center mb-4">
                {selectedCondition.icon}
                <h1 className="text-3xl font-bold ml-4">
                  {selectedCondition.title}
                </h1>
              </div>
              <p className="text-lg opacity-90">
                {selectedCondition.description}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Symptoms */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Common Symptoms
              </h2>
              <div className="space-y-3">
                {selectedCondition.symptoms.map((symptom, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                    <span className="text-slate-700">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatments */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Our Treatment Approaches
              </h2>
              <div className="space-y-3">
                {selectedCondition.treatments.map((treatment, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-slate-700">{treatment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-slate-600 mb-6">
              Take the first step towards better mental health with our expert
              care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Book Appointment
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#E9F6F4] ">
      <div className="max-w-4xl mx-auto p-6 pb-14 pt-14 ">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] ">
            Mental Health Services
          </h1>
          <p className="text-[16px] sm:text-[16px] text-slate-600  mx-auto leading-relaxed">
            Comprehensive care for your mental wellbeing
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-14">
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative rounded-2xl">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 bg-[#BDE3DE] 
                      ${
                        expandedService === service.id
                          ? "bg-white/10"
                          : "hover:bg-white/10"
                      }`}
                  >
                    {/* Title & description container */}
                    <div>
                      <h3 className="text-sm ml-2 font-extrabold text-slate-700">
                        {service.title}
                      </h3>
                    </div>

                    {/* Chevron on far right */}
                    <ChevronDown
                      className={`w-5 h-5 text-slate-700 transform transition-transform duration-500 ease-in-out 
                        ${
                          expandedService === service.id
                            ? "rotate-180 scale-110"
                            : "rotate-0"
                        }`}
                    />
                  </button>
                  <div
                    className={`relative transition-all duration-500 ease-in-out overflow-hidden 
                      ${
                        expandedService === service.id
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                  >
                    {/* Background Image */}
                    <div
                      className="relative h-48 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${getServiceImage(service.id)})`,
                      }}
                    >
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/50"></div>

                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="text-white mb-4">
                          <p className="text-lg font-semibold mb-2">
                            {service.details}
                          </p>
                        </div>
                        <button
                          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl font-semibold 
                                                    hover:bg-white/30 hover:border-white/50 transform hover:scale-105 active:scale-95 transition-all duration-300 
                                                    w-fit shadow-lg"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthServices;
