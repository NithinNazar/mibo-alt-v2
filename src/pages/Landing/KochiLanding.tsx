import React from "react";

import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  Users,
  Heart,
  Shield,
  CheckCircle,
  Brain,
  Mail,
  Calendar,
  Star,
} from "lucide-react";
import logo from "../../assets/logo1.png";
import bangaloreImage from "../../assets/mibo_bangalore.jpg";
import therapyImage from "../../assets/individual_therapy.jpg";
import groupImage from "../../assets/group_session.jpg";
import familyImage from "../../assets/famlily_therapy.jpg";
import onlineImage from "../../assets/online.jpg";
import inPersonImage from "../../assets/In-person.jpg";
import whoItsFor1 from "../../assets/whoitsfor1.png";
import whoItsFor2 from "../../assets/whoitsfor2.png";
import whoItsFor3 from "../../assets/whoitsfor3.png";

const BangaloreLanding = () => {
  const phoneNumber = "9083335000";
  const email = "reach@mibocare.com";
  const address =
    "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041";

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/91${phoneNumber}`, "_blank");
  };

  const services = [
    {
      icon: <Heart className="w-8 h-8 text-miboGreen" />,
      title: "Individual Counseling",
      description:
        "One-on-one sessions tailored to your unique needs with experienced therapists",
      image: therapyImage,
    },
    {
      icon: <Users className="w-8 h-8 text-miboGreen" />,
      title: "Group Therapy",
      description:
        "Heal together in a supportive community setting with shared experiences",
      image: groupImage,
    },
    {
      icon: <Shield className="w-8 h-8 text-miboGreen" />,
      title: "Family Counseling",
      description:
        "Build stronger relationships and improve family dynamics with expert guidance",
      image: familyImage,
    },
    {
      icon: <Star className="w-8 h-8 text-miboGreen" />,
      title: "Online Sessions",
      description:
        "Connect with therapists from the comfort of home via secure video consultations",
      image: onlineImage,
    },
    {
      icon: <Brain className="w-8 h-8 text-miboGreen" />,
      title: "In-Person Therapy",
      description:
        "Experience face-to-face sessions in our modern Kochi facility",
      image: inPersonImage,
    },
  ];

  const features = [
    {
      icon: <Award className="w-12 h-12 text-miboAccent" />,
      title: "Certified Experts",
      description:
        "Highly qualified psychologists, psychiatrists, and counselors with proven expertise",
    },
    {
      icon: <Clock className="w-12 h-12 text-miboAccent" />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance when you need it most, including emergency support",
    },
    {
      icon: <MapPin className="w-12 h-12 text-miboAccent" />,
      title: "Central Location",
      description:
        "Conveniently located in Jayanagar, easily accessible from all parts of Kochi",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-miboAccent" />,
      title: "Proven Results",
      description:
        "Thousands of successful treatment outcomes with evidence-based therapeutic methods",
    },
  ];

  const testimonials = [
    {
      text: "Mibo transformed my life. The therapists are compassionate and professional. I finally found the help I needed.",
      author: "Anonymous Patient",
      rating: 5,
    },
    {
      text: "Best mental health facility in Kochi. Highly recommend! The environment is so calming and supportive.",
      author: "Anonymous Patient",
      rating: 5,
    },
    {
      text: "The support I received here was life-changing. Forever grateful to the entire team at Mibo.",
      author: "Anonymous Patient",
      rating: 5,
    },
  ];

  const concerns = [
    "Anxiety & Panic Attacks",
    "Depression & Mood Disorders",
    "Relationship Counseling",
    "Work Stress & Burnout",
    "Trauma & PTSD",
    "Self-Esteem Issues",
    "Addiction Recovery",
    "Sleep Disorders",
    "OCD & Phobias",
    "Grief & Loss",
    "Anger Management",
    "Life Transitions",
  ];

  const whoItsFor = [
    {
      image: whoItsFor1,
      title: "Individuals",
      description: "Personal growth and mental wellness for everyone",
    },
    {
      image: whoItsFor2,
      title: "Couples",
      description: "Strengthen your relationship and communication",
    },
    {
      image: whoItsFor3,
      title: "Families",
      description: "Build healthier family dynamics and connections",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-miboLightGreen/20 to-white">
      {/* Floating Action Buttons */}
      <div
        className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4"
        style={{ position: "fixed", zIndex: 9999 }}
      >
        <button
          onClick={handlePhoneClick}
          className="bg-miboGreen hover:bg-miboAccent text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 group"
          aria-label="Call us"
          style={{ position: "relative", zIndex: 9999 }}
        >
          <Phone className="w-6 h-6 group-hover:animate-pulse" />
        </button>
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 group"
          aria-label="WhatsApp us"
          style={{ position: "relative", zIndex: 9999 }}
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
        </button>
      </div>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${groupImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Gradient overlay - left visible, right faded */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white/95"></div>

        {/* Additional overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10"></div>

        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-miboAccent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-miboGreen/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-miboLightGreen/30 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 animate-fadeIn">
            {/* Logo */}
            <img src={logo} alt="Mibo Logo" className="h-24 w-auto mb-4" />

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-[#30baa3]">Welcome to </span>
              <span className="text-[#212154]">Mibo Kochi</span>
            </h1>

            <p className="text-xl md:text-2xl text-miboText max-w-3xl font-semibold">
              Experience personalized mental health care at Mibo's Bengaluru
              centre — a serene space designed to help you heal, reflect, and
              grow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handlePhoneClick}
                className="bg-[#212154] hover:bg-[#1a1a46] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Call Now: {phoneNumber}
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="bg-white hover:bg-miboLightGreen text-miboGreen px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 border-2 border-miboGreen"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            Why Choose Mibo Kochi?
          </h2>
          <p className="text-center text-miboText text-lg mb-16 max-w-3xl mx-auto font-semibold">
            Premier mental health care in India's Silicon Valley. From
            one-on-one therapy to psychiatry and wellness programs, Mibo offers
            evidence-based care designed around your goals.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-[#212154]/15"
              >
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  {React.cloneElement(feature.icon, {
                    className: "w-12 h-12 text-[#30baa3]",
                  })}
                </div>

                <h3 className="text-2xl font-bold text-[#212154] mb-4">
                  {feature.title}
                </h3>

                <p className="text-miboText text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Scrollable Cards */}
      <section className="py-20 bg-[#30baa3]/10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            Our Comprehensive Services
          </h2>

          <p className="text-center text-miboText text-lg mb-16 max-w-3xl mx-auto">
            We are a mental health ecosystem that brings together multiple
            treatment options to create an experience that makes getting help
            easy and seamless.
          </p>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-6 min-w-max px-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="w-80 bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4">{service.icon}</div>

                    <h3 className="text-2xl font-bold text-[#212154] mb-3">
                      {service.title}
                    </h3>

                    <p className="text-miboText leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mental Health Concerns Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            We Can Help With
          </h2>

          <p className="text-center text-miboText text-lg font-semibold mb-16 max-w-3xl mx-auto">
            Our expert team specializes in treating a wide range of mental
            health concerns with compassion and evidence-based approaches.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {concerns.map((concern, index) => (
              <div
                key={index}
                className="bg-[#30baa3]/14 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center border border-[#30baa3]/50"
              >
                <CheckCircle className="w-8 h-8 text-[#212154] mx-auto mb-3" />

                <p className="text-[#212154] font-semibold text-lg">
                  {concern}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-miboLightGreen/20 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            What Our Patients Say
          </h2>

          <p className="text-center text-miboText text-lg font-semibold mb-16 max-w-3xl mx-auto">
            Real stories from real people who found healing and hope at Mibo.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#212154] text-[#212154]"
                    />
                  ))}
                </div>

                <p className="text-miboText text-lg italic mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <p className="text-[#212154] font-semibold">
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            Who It's For
          </h2>

          <p className="text-center text-miboText text-lg font-semibold mb-16 max-w-3xl mx-auto">
            Mental health care for everyone, at every stage of life.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whoItsFor.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#30baa3]/14 to-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-[#212154] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-miboText">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gradient-to-b from-[#212154]/8 to-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#30baa3]">
                Visit Our Kochi Centre
              </h2>

              <p className="text-xl text-miboText leading-relaxed font-semibold">
                Our modern facility in Jayanagar offers a peaceful sanctuary for
                your mental health journey. Experience world-class care in a
                comfortable setting.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-[#30baa3]/14 p-6 rounded-2xl">
                  <MapPin className="w-8 h-8 text-[#30baa3] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#30baa3] mb-2">
                      Address
                    </h3>
                    <p className="text-miboText">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-[#30baa3]/14 p-6 rounded-2xl">
                  <Phone className="w-8 h-8 text-[#30baa3] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#30baa3] mb-2">
                      Phone
                    </h3>
                    <p className="text-miboText">+91 {phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-[#30baa3]/14 p-6 rounded-2xl">
                  <Mail className="w-8 h-8 text-[#30baa3] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#30baa3] mb-2">
                      Email
                    </h3>
                    <p className="text-miboText">{email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={bangaloreImage}
                alt="Mibo Bangalore Centre"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-4">
            How to Get Started
          </h2>

          <p className="text-center text-miboText text-lg font-semibold mb-16 max-w-3xl mx-auto">
            Taking the first step is simple. Here's how you can begin your
            journey to better mental health.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl text-center border border-[#212154]/15">
              <div className="bg-[#212154]/12 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[#30baa3]" />
              </div>
              <h3 className="text-2xl font-bold text-[#212154] mb-4">
                1. Call or WhatsApp
              </h3>
              <p className="text-miboText leading-relaxed">
                Reach out to us via phone or WhatsApp. Our team will guide you
                through the process.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl text-center border border-[#212154]/15">
              <div className="bg-[#212154]/12 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[#30baa3]" />
              </div>
              <h3 className="text-2xl font-bold text-[#212154] mb-4">
                2. Book Appointment
              </h3>
              <p className="text-miboText leading-relaxed">
                Schedule a consultation at a time that works best for you,
                online or in-person.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl text-center border border-[#212154]/15">
              <div className="bg-[#212154]/12 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#30baa3]" />
              </div>
              <h3 className="text-2xl font-bold text-[#212154] mb-4">
                3. Start Your Journey
              </h3>
              <p className="text-miboText leading-relaxed">
                Meet your therapist and begin your personalized path to wellness
                and healing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#212154] to-[#1a1a46] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Take the First Step Today
          </h2>

          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90 font-semibold">
            Your mental health matters. Reach out to us and begin your journey
            to wellness. We're here to support you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePhoneClick}
              className="bg-white text-[#212154] px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 justify-center"
            >
              <Phone className="w-5 h-5" />
              Call {phoneNumber}
            </button>

            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212154] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img
                src={logo}
                alt="Mibo Logo"
                className="h-12 w-auto mb-4 opacity-80"
              />
              <p className="text-sm opacity-70 leading-relaxed">
                Redefining premium mental healthcare with compassion, science,
                and innovation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-sm opacity-70">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +91 {phoneNumber}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {email}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Location</h3>
              <p className="text-sm opacity-70 leading-relaxed">{address}</p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-70">
              © 2024 Mibo Mental Health. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BangaloreLanding;
