import React, { useState } from 'react';
import { ChevronRight, ChevronDown, User, Users, Monitor } from 'lucide-react';

const MentalHealthServices = () => {
    const [expandedService, setExpandedService] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedCondition, setSelectedCondition] = useState(null);

    const services = [
        {
            id: 'in-patient',
            title: 'In-Patient',
            icon: <User className="w-6 h-6" />,
            description: 'Comprehensive residential care for intensive mental health treatment',
            details:
                'When clicked a brief description of service appears in drop down, and a CTA button to book appointment now/learn more button directing user to the section explaining how mibo handles each type of mental health problems',
        },
        {
            id: 'in-person',
            title: 'In-Person',
            icon: <Users className="w-6 h-6" />,
            description: 'Face-to-face therapy sessions with qualified mental health professionals',
            details:
                'Personalized therapy sessions in a comfortable, professional environment with experienced therapists.',
        },
        {
            id: 'online',
            title: 'Online Services',
            icon: <Monitor className="w-6 h-6" />,
            description: 'Convenient virtual therapy and counseling sessions from anywhere',
            details: 'Access mental health support through secure video calls, chat, and digital tools.',
        },
    ];

    

    const toggleService = (serviceId) => {
        setExpandedService(expandedService === serviceId ? null : serviceId);
    };

    // const goToConditionDetail = (condition) => {
    //     setSelectedCondition(condition);
    //     setCurrentPage('detail');
    // };

    const goToHome = () => {
        setCurrentPage('home');
        setSelectedCondition(null);
    };

    if (currentPage === 'detail' && selectedCondition) {
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
                        <div className={`${selectedCondition.color} rounded-2xl p-8 text-white shadow-2xl`}>
                            <div className="flex items-center mb-4">
                                {selectedCondition.icon}
                                <h1 className="text-3xl font-bold ml-4">{selectedCondition.title}</h1>
                            </div>
                            <p className="text-lg opacity-90">{selectedCondition.description}</p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Symptoms */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Common Symptoms</h2>
                            <div className="space-y-3">
                                {selectedCondition.symptoms.map((symptom, index) => (
                                    <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                                        <span className="text-slate-700">{symptom}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Treatments */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Treatment Approaches</h2>
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
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Start Your Journey?</h3>
                        <p className="text-slate-600 mb-6">
                            Take the first step towards better mental health with our expert care.
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
        <div className="min-h-screen bg-[#fff] ">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] ">Mental Health Services</h1>
                    <p className="text-[10px] sm:text-[10px] text-slate-600  mx-auto leading-relaxed">
                        Comprehensive care for your mental wellbeing
                    </p>
                    <style>
                        {`
                            @keyframes premium-underline {
                            0% { transform: translateX(-100%); }
                            50% { transform: translateX(0%); }
                            100% { transform: translateX(100%); }
                        }
`}
                    </style>

                    {/* <div className="relative mt-4 h-1 w-20 mx-auto mb-0 overflow-hidden rounded-full shadow-lg">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c]"
                            style={{
                                animation: 'premium-underline 3s ease-in-out infinite',
                            }}
                        ></div>
                    </div> */}
                </div>

                {/* Services Section */}
                <div className="mb-14">
                    <div className="space-y-3">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`relative rounded-md
       bg-[#E9F6F4] hover:bg-[#B3E5FF] 
     `}
                            >
                                <div className=" rounded-2xl">
                                    <button
                                        onClick={() => toggleService(service.id)}
                                        className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 
    ${expandedService === service.id ? 'bg-white/10' : 'hover:bg-white/10'}`}
                                    >
                                        {/* Title & description container */}
                                        <div>
                                            <h3 className="text-sm ml-2 font-extrabold text-slate-700">{service.title}</h3>
                                            {/* <p className="text-slate-100 text-xs">{service.description}</p> */}
                                        </div>

                                        {/* Chevron on far right */}
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-700 transform transition-transform duration-500 ease-in-out 
      ${expandedService === service.id ? 'rotate-180 scale-110' : 'rotate-0'}`}
                                        />
                                    </button>
                                    <div
                                        className={`transition-all duration-500 ease-in-out overflow-hidden 
            ${expandedService === service.id ? 'max-h-96 opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}
                                    >
                                        <p className="text-gra mb-4 text-sm leading-relaxed">{service.details}</p>
                                        <button
                                            className="bg-[#18276c]  text-[#d8e2dc]
              px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg 
              transform hover:scale-105 active:scale-95 transition-all duration-300"
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conditions Section */}
                {/* <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">What are you struggling with?</h2>
                    <p className="text-slate-600 mb-8">Mibo is here to support you with all your mental health needs.</p>

                    <div className="grid gap-4">
                        {conditions.map((condition) => (
                            <button
                                key={condition.id}
                                onClick={() => goToConditionDetail(condition)}
                                className={`${condition.color} text-white p-6 rounded-2xl flex items-center justify-between group hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg`}
                            >
                                <div className="flex items-center">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">{condition.icon}</div>
                                    <span className="text-lg font-semibold">{condition.title}</span>
                                </div>
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                        ))}
                    </div>
                </div> */}
                

                {/* Footer CTA */}
                {/* <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Take the Next Step?</h3>
                    <p className="text-slate-600 mb-6">Connect with our mental health professionals today</p>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        Get Started Today
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default MentalHealthServices;
