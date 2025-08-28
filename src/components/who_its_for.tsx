import React from 'react';
import { motion } from 'framer-motion';
import meetingImage1 from '../assets/whoitsfor1.png';
import meetingImage2 from '../assets/whoitsfor2.png';
import meetingImage3 from '../assets/whoitsfor3.png';

const CorporateLanding: React.FC = () => {
    // Card data
    const cards = [
        {
            title: 'For Families',
            description:
                'Personalized programs that help families strengthen communication, build resilience, and support each other.',
            image: meetingImage1,
        },
        {
            title: 'For Individuals',
            description: 'Tailored experiences designed for self-growth, mental well-being, and achieving personal goals.',
            image: meetingImage2,
        },
        {
            title: 'For Couples',
            description:
                'Workshops and resources that help couples improve understanding, strengthen bonds, and grow together.',
            image: meetingImage3,
        },
        {
            title: 'For Children',
            description:
                'Engaging and age-appropriate activities that support emotional development, creativity, and confidence.',
            image: meetingImage3,
        },
        {
            title: 'For Corporates',
            description:
                'Enterprise-ready infrastructure designed to deliver real-time impact data, enabling tailored programs that drive measurable outcomes.',
            image: meetingImage1,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-14 pb-14">
            <div className="max-w-5xl mx-auto">
                {/* Header Text */}
                <div className="mb-10 text-center">
                    <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mt-4">
                        Tailored for those who <br /> lead, seek, and listen
                    </h1>
                </div>

                {/* Grid with Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white rounded-3xl shadow-sm overflow-hidden relative min-h-[400px]"
                        >
                            {/* Text section */}
                            <div className="px-8 py-8">
                                <h2 className="text-[1.25rem] font-[700] text-[rgb(76,76,76)] mb-4">{card.title}</h2>
                                <p className="text-[rgb(76,76,76)] leading-[20px] text-[0.9rem]">{card.description}</p>
                            </div>

                            {/* Image fixed at card's bottom-right */}
                            <img
                                src={card.image}
                                alt={card.title}
                                className="absolute bottom-0 right-0 w-60 h-auto object-cover rounded-br-3xl"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CorporateLanding;
