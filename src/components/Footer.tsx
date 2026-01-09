import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#E3F7F1] text-[#1C3D3A] py-12 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto border-t border-[#C1DFDA] pt-10">
        {/* --- 🌐 Social Icons Row --- */}
        <div className="flex justify-center items-center gap-8 mb-10 text-gray-400">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0b1180] transition-transform transform hover:scale-110"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0b1180] transition-transform transform hover:scale-110"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0b1180] transition-transform transform hover:scale-110"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0b1180] transition-transform transform hover:scale-110"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        {/* --- Footer Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* --- Left Column --- */}
          <div className="grid grid-cols-2 gap-6">
            {/* About Mibo */}
            <div>
              <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
                About Mibo
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#276C72] transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Mibo in Media
                  </a>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    For Therapists
                  </Link>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("contact");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Help / FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
                Services
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Adult Therapy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Adult Psychiatry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/in-patient"
                    className="hover:text-[#276C72] transition"
                  >
                    Mental Health Hospital
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Children First Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Couples Therapy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/in-person"
                    className="hover:text-[#276C72] transition"
                  >
                    Self-Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Assessments
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* --- Right Column --- */}
          <div className="grid grid-cols-2 gap-6">
            {/* Conditions */}
            <div>
              <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
                Conditions
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Depression
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Anxiety
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Bipolar Disorder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    OCD
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    ADHD
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Social Anxiety
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Women's Mental Health
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Addiction
                  </Link>
                </li>
              </ul>
            </div>

            {/* Professionals */}
            <div>
              <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
                Professionals
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Therapists
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Psychiatrists
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Child & Youth Experts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experts"
                    className="hover:text-[#276C72] transition"
                  >
                    Couples Therapists
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Line --- */}
        <div className="mt-10 pt-6 text-sm text-center text-[#2A5752]/80">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">Mibo Care</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
