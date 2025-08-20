import sampleImage from '../assets/banner.webp';

const OfferingsAndTherapy = () => {
    return (
        <div className="max-w-md mx-auto bg-white">
            {/* First Section - Our mental healthcare offerings */}
            <div className="text-center px-8 py-12">
                <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
                    Our mental healthcare offerings
                </h1>
                <p className="text-[rgb(76, 76, 76)] font-[500] leading-[20px] text-[0.8rem]">
                    We are a mental health ecosystem that brings together multiple treatment options to create an experience
                    that makes getting help easy and seamless. From assessment to treatment, we're with you every step of
                    the way.
                </p>
            </div>
            <div className="flex flex-col items-center text-center px-6  pb-4">
                {/* Image Placeholder */}
                <div>
                    <img src={sampleImage} alt="Mental Health" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Second Section - Therapy & Psychiatry */}
            <div className="px-8 pb-6">
                <h2 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-4">Therapy & Psychiatry</h2>

                <div className="space-y-6">
                    <p className="text-[rgb(76, 76, 76)] leading-[20px] text-[0.8rem]">
                        Our professionals are highly qualified and trained to deliver quality and compassionate clinical
                        treatment across ages through therapy, psychiatry, mental health support for your child and couples
                        therapy.
                    </p>

                    <p className="text-[rgb(76, 76, 76)] leading-[20px] text-[0.8rem]">
                        They follow proprietary protocols & undergo peer supervision to ensure you get exceptional care, now
                        in person too. Meet your mental health expert today.
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                    <button className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide">
                        EXPLORE EXPERTS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferingsAndTherapy;
