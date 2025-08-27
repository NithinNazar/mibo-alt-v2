// import React from 'react';
// import sampleImage from '../assets/banner.webp'; // replace with your image path

// const MentalHealthCard: React.FC = () => {
//     return (
//         <div className="flex flex-col items-center text-center px-6 pt-10 pb-0">
//             {/* Image with organic rounded shape */}
//             <div>
//                 <img src={sampleImage} alt="Mental Health" className="w-full h-full object-cover" />
//             </div>

//             {/* Title */}
//             <h2
//                 className="mt-6 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug"
//                 style={{ fontFamily: 'Quicksand, sans-serif' }}
//             >
//                 Trust Mibo with your <br /> mental health
//             </h2>

//             {/* Subtitle */}
//             <p
//                 className="mt-4 text-[0.8rem] text-[rgb(76, 76, 76)] text-center max-w-md mx-auto"
//                 style={{ fontFamily: 'Quicksand, sans-serif' }}
//             >
//                 Our mission is simple: to help you feel better, get better and stay better.
//             </p>

//             {/* Body text */}
//             <p
//                 className="mt-4 text-[rgb(76, 76, 76)] text-[0.8rem]  text-center "
//                 style={{ fontFamily: 'Quicksand, sans-serif' }}
//             >
//                 We bring together self-care, support from qualified therapists and psychiatrists, as well as community
//                 access to deliver the best quality mental healthcare for your needs.
//             </p>

//             {/* Button */}
//             <div className="mt-6 flex justify-center">
//                 <button
//                     className="px-10 py-3 bg-[#18356C] text-white font-bold rounded-full text-sm tracking-wider shadow-md hover:opacity-90 transition"
//                     style={{ fontFamily: 'Quicksand, sans-serif' }}
//                 >
//                     SEE MORE
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MentalHealthCard;

import React from 'react';
import sampleImage from '../assets/Mental-wellness-month.png'; // replace with your image path

const MentalHealthCard: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full h-full bg-[#def2ff] text-center px-6 pt-14 pb-14">
            {/* Image with SVG blob shape */}
            {/* <svg viewBox="0 0 400 400" className="w-180 h-180  overflow-hidden">
                <defs>
                    <clipPath id="blobClip1">
                        <path
                            d="M43.5,-69.4C54.3,-60.8,59.5,-45.2,67.4,-30.1C75.3,-15,85.9,-0.6,85,12.9C84.1,26.3,71.6,38.8,59.9,51.4C48.2,64.1,37.3,76.9,24.3,79.2C11.2,81.5,-3.9,73.2,-18.1,66.7C-32.2,60.2,-45.4,55.5,-53,46.2C-60.6,37,-62.6,23.1,-67.1,8.1C-71.5,-6.8,-78.5,-22.9,-74.6,-35.1C-70.7,-47.3,-55.8,-55.5,-41.6,-62.5C-27.3,-69.5,-13.7,-75.2,1.4,-77.3C16.4,-79.4,32.8,-78,43.5,-69.4Z"
                            transform="translate(200 200) scale(0.9)"
                        />
                    </clipPath>
                </defs>

                <image
                    href={sampleImage}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                    clipPath="url(#blobClip1)"
                />
            </svg> */}
            <div>
                <img src={sampleImage} alt="Mental Health" className="w-full h-full object-cover" />
            </div>
            {/* Title */}
            <h2
                className="mt-6  text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug"
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
                className="mt-4 text-[rgb(76, 76, 76)] text-[0.8rem] text-center"
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

