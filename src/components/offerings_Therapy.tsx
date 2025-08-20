// import sample from '../assets/Banner_2.jpg';

// const OfferingsAndTherapy = () => {
//     return (
//         <div className="max-w-md mx-auto bg-white">
//             {/* First Section - Our mental healthcare offerings */}
//             <div className="text-center px-8 pt-12 pb-6">
//                 <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
//                     Our mental healthcare offerings
//                 </h1>
//                 <p className="text-[rgb(76, 76, 76)] font-[500] leading-[20px] text-[0.8rem]">
//                     We are a mental health ecosystem that brings together multiple treatment options to create an experience
//                     that makes getting help easy and seamless. From assessment to treatment, we're with you every step of
//                     the way.
//                 </p>
//             </div>
//             <div className="flex flex-col items-center text-center px-4  pb-4 pt-0 mt-0">
//                 {/* Image Placeholder */}
//                 {/* <div>
//                     <img src={sampleImage} alt="Mental Health" className="w-full h-full object-cover" />
//                 </div> */}
//                 <svg viewBox="0 0 200 200" className="w-100 100">
//                     <defs>
//                         <clipPath id="blobClip">
//                             <path
//                                 d="M36.5,-69.5C43,-59.5,40.9,-40.9,49,-27.9C57.1,-14.9,75.4,-7.5,82,3.8C88.5,15,83.3,30,70.7,35.3C58.1,40.5,38.1,36,25.1,45.1C12.1,54.3,6,77.1,-5.1,85.9C-16.3,94.8,-32.5,89.6,-41.2,78C-49.9,66.4,-51.1,48.3,-58.1,34.2C-65.1,20.1,-77.9,10.1,-80.5,-1.5C-83.1,-13,-75.4,-26.1,-67.9,-39.4C-60.5,-52.7,-53.3,-66.2,-42,-73.4C-30.7,-80.6,-15.3,-81.4,-0.2,-81.1C15,-80.9,30,-79.5,36.5,-69.5Z"
//                                 transform="translate(100 100) scale(1.2)"
//                             />
//                         </clipPath>
//                     </defs>

//                     <image
//                         href={sample} // replace with your img
//                         width="200"
//                         height="200"
//                         preserveAspectRatio="xMidYMid slice"
//                         clipPath="url(#blobClip)"
//                     />
//                 </svg>
//             </div>

//             {/* Second Section - Therapy & Psychiatry */}
//             <div className="px-8 pb-6">
//                 <h2 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-4">Therapy & Psychiatry</h2>

//                 <div className="space-y-6">
//                     <p className="text-[rgb(76, 76, 76)] leading-[20px] text-[0.8rem]">
//                         Our professionals are highly qualified and trained to deliver quality and compassionate clinical
//                         treatment across ages through therapy, psychiatry, mental health support for your child and couples
//                         therapy.
//                     </p>

//                     <p className="text-[rgb(76, 76, 76)] leading-[20px] text-[0.8rem]">
//                         They follow proprietary protocols & undergo peer supervision to ensure you get exceptional care, now
//                         in person too. Meet your mental health expert today.
//                     </p>
//                 </div>

//                 {/* CTA Button */}
//                 <div className="mt-8">
//                     <button className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide">
//                         EXPLORE EXPERTS
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OfferingsAndTherapy;


import sample from '../assets/Banner_2.jpg';
import wavePng from '../assets/wave.jpg'; // Add your wave PNG import here

const OfferingsAndTherapy = () => {
    return (
        <div className="max-w-md mx-auto bg-white">
            {/* First Section - Our mental healthcare offerings */}
            <div className="text-center px-8 pt-12 pb-6">
                <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
                    Our mental healthcare offerings
                </h1>
                <p className="text-[rgb(76, 76, 76)] font-[500] leading-[20px] text-[0.8rem]">
                    We are a mental health ecosystem that brings together multiple treatment options to create an experience
                    that makes getting help easy and seamless. From assessment to treatment, we're with you every step of
                    the way.
                </p>
            </div>

            <div className="flex flex-col items-center text-center px-4 pb-4 pt-0 mt-0 relative">
                {/* Wave PNG positioned near SVG */}
                <div className="absolute top-0 left-0 w-full z-0">
                    <img src={wavePng} alt="Wave decoration" className="w-full h-auto object-cover opacity-70" />
                </div>
                <div>
                    <img src={sample} alt="Mental Health" className="w-full h-full object-cover" />
                </div>

                {/* SVG Blob Image */}
                {/* <svg viewBox="0 0 400 400" className="w-180 h-180  overflow-hidden">
                    <defs>
                        <clipPath id="blobClip">
                            <path
                                d="M57.8,-68.6C74,-55.2,85.9,-36.2,89.5,-15.8C93.1,4.6,88.5,26.5,77.4,43.8C66.3,61,48.8,73.5,29.2,81.1C9.6,88.6,-12.2,91,-31.2,84.6C-50.1,78.1,-66.2,62.8,-76.3,44.5C-86.4,26.1,-90.5,4.7,-86.4,-14.7C-82.3,-34.1,-70,-51.5,-54.3,-65C-38.5,-78.5,-19.3,-88.2,0.7,-89.1C20.7,-90,41.5,-82.1,57.8,-68.6Z"
                                transform="translate(200 200) scale(0.9)"
                            />
                        </clipPath>
                    </defs>

                    <image
                        href={sample}
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid meet"
                        clipPath="url(#blobClip)"
                    />
                </svg> */}
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
