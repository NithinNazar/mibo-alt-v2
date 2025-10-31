import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#E3F7F1] text-[#1C3D3A] py-12 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto border-t border-[#C1DFDA] pt-10">
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
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("services");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Adult Therapy
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("services");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Adult Psychiatry
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("services");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Mental Health Hospital
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Children First Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Couples Therapy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Self-Care
                  </a>
                </li>
                <li>
                  <a
                    href="#support-services"
                    onClick={(e) => {
                      e.preventDefault();
                      const section =
                        document.getElementById("support-services");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#276C72] transition">
                    Assessments
                  </a>
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
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Depression
                  </a>
                </li>

                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Anxiety
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Bipolar Disorder
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    OCD
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    ADHD
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Social Anxiety
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Women’s Mental Health
                  </a>
                </li>
                <li>
                  <a
                    href="#concerns"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById("concerns");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#276C72] transition cursor-pointer"
                  >
                    Addiction
                  </a>
                </li>
              </ul>
            </div>

            {/* Professionals */}
            <div>
              <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
                Professionals
              </h3>
              <ul className="space-y-2 text-sm">
                <Link to="/experts" className="hover:text-[#276C72] transition">
                  Therapists
                </Link>
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
