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
import heroImage from "../../assets/mibo-doc-pat.jpg";
import kochiImage from "../../assets/mibo-kochi-centre-2.jpg";
import therapyImage from "../../assets/mibo-individual-counselling.jpg";
import groupImage from "../../assets/group_session.jpg";
import familyImage from "../../assets/mibo-family.jpg";
import onlineImage from "../../assets/online.jpg";
import inPersonImage from "../../assets/mbo-inperson.jpg";
import certifiedExpertBg from "../../assets/mibo-certified-expert.jpg";
import supportBg from "../../assets/mibo-247-support.jpg";
import individualImage from "../../assets/mibo-individual-counselling.jpg";
import coupleImage from "../../assets/mibo-couple.jpg";
import bangaloreRec1 from "../../assets/mibo-bangalore-rec-1.jpg";
import bangaloreRec2 from "../../assets/mibo-bangalore-rec-2.jpg";
import bangaloreRec3 from "../../assets/mibo-bangalore-rec-3.jpg";
import bangaloreRec4 from "../../assets/mibo-bangalore-rec-4.jpg";
import kochiReal1 from "../../assets/mibo-kochi-real-1.jpg";
import kochiReal2 from "../../assets/mibo-kochi-real-2.jpg";
import miboReal1 from "../../assets/mibo-real-1.jpg";
import miboReal2 from "../../assets/mibo-real-2.jpg";
import miboReal3 from "../../assets/mibo-real-3.jpg";
import miboReal4 from "../../assets/mibo-real-4.jpg";
import miboReal5 from "../../assets/mibo-real-5.jpg";
import miboReal6 from "../../assets/mibo-real-6.jpg";
import miboReal7 from "../../assets/mibo-real-7.jpg";
import confidentialImage from "../../assets/mibo-individual.jpg";
import availabilityImage from "../../assets/mibo-avail.jpg";
import whyChooseImage from "../../assets/mibo-why-choose.jpg";

const BangaloreLanding = () => {
  const phoneNumber = "9083335000";
  const email = "reach@mibocare.com";
  const address =
    "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041";

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const centreImages = [
    kochiImage,
    kochiReal1,
    kochiReal2,
    bangaloreRec1,
    bangaloreRec2,
    bangaloreRec3,
    bangaloreRec4,
    miboReal1,
    miboReal2,
    miboReal3,
    miboReal4,
    miboReal5,
    miboReal6,
    miboReal7,
  ];

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/91${phoneNumber}`, "_blank");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % centreImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + centreImages.length) % centreImages.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  React.useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

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
      icon: <Award className="w-12 h-12 text-[#212154]" />,
      title: "Certified Psychologists & Psychiatrists",
      description:
        "Highly qualified psychologists, psychiatrists, and counselors with proven expertise",
      bgImage: certifiedExpertBg,
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-[#212154]" />,
      title: "Evidence-Based Treatment",
      description:
        "Scientifically proven therapeutic approaches tailored to your unique needs and goals",
      bgImage: supportBg,
    },
    {
      icon: <Shield className="w-12 h-12 text-[#212154]" />,
      title: "100% Confidential Care",
      description:
        "Your privacy is our priority. All sessions are completely confidential and secure",
      bgImage: confidentialImage,
    },
    {
      icon: <Clock className="w-12 h-12 text-[#212154]" />,
      title: "Fast Appointment Availability",
      description:
        "Get help when you need it. Quick appointment scheduling with minimal wait times",
      bgImage: availabilityImage,
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
    {
      text: "Professional, caring, and effective. The therapist really understood my struggles and helped me work through them.",
      author: "Anonymous Patient",
      rating: 5,
    },
    {
      text: "I was hesitant at first, but the team made me feel so comfortable. The progress I've made is incredible.",
      author: "Anonymous Patient",
      rating: 5,
    },
    {
      text: "Excellent service and genuine care. The psychiatrist was thorough and the treatment plan really works.",
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
      image: individualImage,
      title: "Individuals",
      description: "Personal growth and mental wellness for everyone",
    },
    {
      image: coupleImage,
      title: "Couples",
      description: "Strengthen your relationship and communication",
    },
    {
      image: familyImage,
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
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-miboAccent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-miboGreen/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col items-start text-left space-y-6 max-w-3xl animate-fadeIn">
            {/* Logo */}
            <img src={logo} alt="Mibo Logo" className="h-20 w-auto mb-2" />

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Talk to a Mental Health Specialist in Kochi Today
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-semibold">
              Confidential therapy, psychiatry, and wellness care tailored to
              you
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-[#30baa3]" />
                <span className="font-semibold">Trusted by 5000+ Patients</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-[#30baa3]" />
                <span className="font-semibold">100% Confidential</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-[#30baa3]" />
                <span className="font-semibold">Certified Experts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 text-[#30baa3]" />
                <span className="font-semibold">No Judgement Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handlePhoneClick}
                className="bg-[#30baa3] hover:bg-[#2a9e8f] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Call Now: {phoneNumber}
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="bg-white hover:bg-gray-100 text-[#212154] px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
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
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#212154] mb-8">
            Why Choose Mibo Kochi?
          </h2>

          {/* Image with overlay text */}
          <div className="relative w-full max-w-2xl mx-auto h-96 md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img
              src={whyChooseImage}
              alt="Mibo Kochi Centre"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#212154]/80 to-[#212154]/40 flex items-center justify-center px-6">
              <p className="text-white text-lg md:text-2xl text-center max-w-xl font-semibold leading-relaxed">
                Premier mental health care in God's Own Country. From one-on-one
                therapy to psychiatry and wellness programs, Mibo offers
                evidence-based care designed around your goals.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-[#212154]/15 overflow-hidden"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50"
                  style={{
                    backgroundImage: `url(${feature.bgImage})`,
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    {React.cloneElement(feature.icon, {
                      className: "w-12 h-12 text-[#212154]",
                    })}
                  </div>

                  <h3 className="text-2xl font-bold text-[#212154] mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-miboText text-lg leading-relaxed font-semibold">
                    {feature.description}
                  </p>
                </div>
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

      {/* Need Help Now Section */}
      <section className="py-20 bg-gradient-to-br from-[#30baa3]/10 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212154] mb-6">
              Need Help Now?
            </h2>
            <p className="text-xl text-miboText mb-10 font-semibold">
              Our care team can guide you to the right specialist quickly.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <Phone className="w-12 h-12 text-[#30baa3] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#212154] mb-3">
                  Call Now - Speak Immediately
                </h3>
                <button
                  onClick={handlePhoneClick}
                  className="bg-[#30baa3] hover:bg-[#2a9e8f] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Phone className="w-5 h-5" />
                  +91 {phoneNumber}
                </button>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#212154] mb-3">
                  WhatsApp Now - Get Quick Response
                </h3>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  {phoneNumber}
                </button>
              </div>
            </div>
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

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-6 min-w-max px-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-96 bg-gradient-to-br from-[#212154]/8 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex-shrink-0"
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

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps?q=10.014698823782494,76.30359075580301&hl=en&z=15&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mibo Kochi Location"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div
                className="relative w-full h-96 md:h-[500px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {centreImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Mibo Kochi Centre ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#212154] p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#212154] p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {centreImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-[#30baa3] w-8"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
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
            <div className="flex items-center justify-center bg-white rounded-2xl w-24 h-24 mb-4 shadow-sm">
              <img src={logo} alt="Mibo Logo" className="h-12 w-auto" />
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
