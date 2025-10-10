const Footer = () => {
  return (
    <footer className="bg-[#E3F7F1] text-[#1C3D3A] py-12 px-6 sm:px-12 lg:px-20">
      {/* --- Main Footer Content (Two Columns) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 border-t border-[#C1DFDA] pt-10">
        {/* --- Left Column: About + Services --- */}
        <div className="space-y-10">
          {/* About Mibo */}
          <div>
            <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
              About Mibo
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  About Us
                </a>
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
                <a href="#" className="hover:text-[#276C72] transition">
                  For Therapists
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
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
                <a href="#" className="hover:text-[#276C72] transition">
                  Adult Therapy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Adult Psychiatry
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
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
                <a href="#" className="hover:text-[#276C72] transition">
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

        {/* --- Right Column: Conditions + Professionals --- */}
        <div className="space-y-10">
          {/* Conditions */}
          <div>
            <h3 className="text-sm font-semibold text-[#2A5752] uppercase tracking-wide mb-4">
              Conditions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Depression
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Anxiety
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Bipolar Disorder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  OCD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  ADHD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Social Anxiety
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Women’s Mental Health
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
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
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Therapists
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Psychiatrists
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Child & Youth Experts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#276C72] transition">
                  Couples Therapists
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Bottom Line --- */}
      <div className="max-w-7xl mx-auto border-t border-[#C1DFDA] mt-10 pt-6 text-sm text-center text-[#2A5752]/80">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Mibo Care</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
