import React from "react";
import conditions from "../data/conditions";

const ConditionPills: React.FC = () => (
  <div className="mt-8 flex overflow-x-auto space-x-3 px-2 pb-2 scrollbar-hide">
    {conditions.map((c, i) => (
      <span
        key={i}
        className="bg-mibo-teal text-white px-4 py-2 rounded-full whitespace-nowrap cursor-pointer hover:bg-mibo-green transition-colors"
      >
        {c}
      </span>
    ))}
  </div>
);

export default ConditionPills;
