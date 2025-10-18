import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<Props> = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-mibo-green mb-3">
      {title}
    </h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export default SectionTitle;
