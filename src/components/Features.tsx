import chattingImg from "../assets/chatting.jpg";

export default function CareServiceComponent() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-2xl lg:text-5xl ml-4 font-bold text-gray-900 leading-tight">
                Real care adapts to your
                <span className="text-[#2FA19A] ">
                  {" "}
                  life, your people, your pace.
                </span>
              </h1>

              <p className="text-[0.9rem] font-500 ml-4 text-gray-600 leading-relaxed max-w-lg font-semibold">
                Care doesn't happen in isolation. It works when it's rooted in
                your everyday life. We practice care that speaks your language
                and sees your world.
              </p>
            </div>
          </div>

          {/* Right Content - Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Woman with phone image placeholder */}
            <div className="relative animate-fadeIn">
              <div className="w-80 h-96 bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center">
                {/* Actual Image */}
                <img
                  src={chattingImg}
                  alt="Woman using mobile app"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-200 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
