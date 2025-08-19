import React from 'react';
import sampleImage from '../assets/banner.webp'; // replace with your image path

const MentalHealthCard: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center px-6 pt-10 pb-0">
            {/* Image with organic rounded shape */}
            <div>
                <img src={sampleImage} alt="Mental Health" className="w-full h-full object-cover" />
            </div>

            {/* Title */}
            <h2
                className="mt-6 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
                Trust Mibo with your <br /> mental health
            </h2>

            {/* Subtitle */}
            <p
                className="mt-4 text-[0.8rem] text-[rgb(76, 76, 76)] text-center max-w-md mx-auto"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
                Our mission is simple: to help you feel better, get better and stay better.
            </p>

            {/* Body text */}
            <p
                className="mt-4 text-[rgb(76, 76, 76)] text-[0.8rem]  text-center "
                style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
                We bring together self-care, support from qualified therapists and psychiatrists, as well as community
                access to deliver the best quality mental healthcare for your needs.
            </p>

            {/* Button */}
            <div className="mt-6 flex justify-center">
                <button
                    className="px-10 py-3 bg-[#18356C] text-white font-bold rounded-full text-sm tracking-wider shadow-md hover:opacity-90 transition"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                    SEE MORE
                </button>
            </div>
        </div>
    );
};

export default MentalHealthCard;
