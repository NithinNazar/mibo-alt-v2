// import { Users, Heart, MessageCircle } from 'lucide-react';

// export default function SupportServices() {
//     return (
//         <div className="max-w-md mx-auto space-y-8 p-6">
//             {/* Support shaped around you */}
//             <div className="animate-fade-in opacity-0 animation-delay-100">
//                 <div className="flex items-center gap-3 mb-4">
//                     <div className="flex gap-1">
//                         <Users className="w-6 h-6 text-[#2FA19A]" />
//                         <Users className="w-5 h-5 text-[#2FA19A] -ml-2" />
//                         <Users className="w-4 h-4 text-emerald-400 -ml-1" />
//                     </div>
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#3c493f] mb-3">Support shaped around you</h2>
//                 <p className="text-gray-600 text-[0.875rem] leading-relaxed">
//                     We look at your needs and experiences to connect you with someone who understands where you're coming
//                     from and what support looks like.
//                 </p>
//             </div>

//             {/* Supporting those who support you */}
//             <div className="animate-fade-in opacity-0 animation-delay-300">
//                 <div className="flex items-center gap-3 mb-4">
//                     <Heart className="w-6 h-6 text-[#2FA19A] fill-[#2FA19A]" />
//                     <Heart className="w-5 h-5 text-[#2FA19A] fill-[#2FA19A]" />
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#3c493f] mb-3">Supporting those who support you</h2>
//                 <p className="text-gray-600  text-[0.875rem] leading-relaxed">
//                     We bring your loved ones into the process through joint sessions when needed, updates and resources that
//                     show them what to expect and how to help without over-stepping.
//                 </p>
//             </div>

//             {/* Care in your language */}
//             <div className="animate-fade-in opacity-0 animation-delay-500">
//                 <div className="flex items-center gap-3 mb-2">
//                     <div className="relative">
//                         <MessageCircle className="w-6 h-6 text-[#2FA19A] mb-1" />
//                         {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
//                             15+
//                         </div> */}
//                     </div>
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#3c493f] mb-3 leading-tight">
//                     Care in your language, and for your context
//                 </h2>
//                 <p className="text-gray-600 text-[0.875rem]  leading-relaxed">
//                     With fluency across 15+ Indian languages, our experts understand your cultural context so you don't have
//                     to over-explain and nothing is lost in translation.
//                 </p>
//             </div>

//             <style>{`
//                 @keyframes fade-in {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .animate-fade-in {
//                     animation: fade-in 0.8s ease-out forwards;
//                 }

//                 .animation-delay-100 {
//                     animation-delay: 0.1s;
//                 }

//                 .animation-delay-300 {
//                     animation-delay: 0.3s;
//                 }

//                 .animation-delay-500 {
//                     animation-delay: 0.5s;
//                 }
//             `}</style>
//         </div>
//     );
// }



// import userIcon from '../assets/internet.png'; // replace with your actual file
import heartIcon from '../assets/solidarity.png'; // replace with your actual file
import messageIcon from '../assets/arabic.png'; // replace with your actual file
import animationData from '../assets/wired-lineal-981-consultation-in-reveal.json';
import Lottie from 'lottie-react';

export default function SupportServices() {
    return (
        <div className="max-w-md mx-auto space-y-8 p-6 pt-14 pb-14">
            {/* Support shaped around you */}
            {/* <div className="animate-fade-in opacity-0 animation-delay-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1">
                        <img src={userIcon} alt="Users" className="w-6 h-6" />

                    </div>
                </div>
                <h2 className="text-lg font-semibold text-[#3c493f] mb-3">Support shaped around you</h2>
                <p className="text-gray-600 text-[0.875rem] leading-relaxed">
                    We look at your needs and experiences to connect you with someone who understands where you're coming
                    from and what support looks like.
                </p>
            </div> */}
            <div className="animate-fade-in opacity-0 animation-delay-100 relative">
                {/* Lottie animation moved slightly to the left */}
                <Lottie animationData={animationData} className="w-20 h-20 relative left-[-10px]" loop={true} />

                <h2 className="text-lg font-semibold text-[#3c493f] mb-3">Support shaped around you</h2>
                <p className="text-gray-600 text-[1rem] leading-relaxed">
                    We look at your needs and experiences to connect you with someone who understands where you're coming
                    from and what support looks like.
                </p>
            </div>

            {/* Supporting those who support you */}
            <div className="animate-fade-in opacity-0 animation-delay-300">
                <div className="flex items-center gap-3 mb-4">
                    <img src={heartIcon} alt="Heart" className="w-6 h-6" />
                    {/* <img src={heartIcon} alt="Heart" className="w-5 h-5" /> */}
                </div>
                <h2 className="text-lg font-semibold text-[#3c493f] mb-3">Supporting those who support you</h2>
                <p className="text-gray-600 text-[1rem] leading-relaxed">
                    We bring your loved ones into the process through joint sessions when needed, updates and resources that
                    show them what to expect and how to help without over-stepping.
                </p>
            </div>

            {/* Care in your language */}
            <div className="animate-fade-in opacity-0 animation-delay-500">
                <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                        <img src={messageIcon} alt="Message" className="w-6 h-6 mb-1" />
                        {/* Optional badge */}
                        {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            15+
                        </div> */}
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-[#3c493f] mb-3 leading-tight">
                    Care in your language, and for your context
                </h2>
                <p className="text-gray-600 text-[1rem] leading-relaxed">
                    With fluency across 15+ Indian languages, our experts understand your cultural context so you don't have
                    to over-explain and nothing is lost in translation.
                </p>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animation-delay-100 {
                    animation-delay: 0.1s;
                }

                .animation-delay-300 {
                    animation-delay: 0.3s;
                }

                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    );
}
