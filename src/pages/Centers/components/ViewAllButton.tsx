import React from "react";

interface Props {
  label: string;
}

const ViewAllButton: React.FC<Props> = ({ label }) => (
  <button className="bg-mibo-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-mibo-teal transition-colors">
    {label}
  </button>
);

export default ViewAllButton;
