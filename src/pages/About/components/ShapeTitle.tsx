import React from "react";

interface ShapeTitleProps {
  title: string;
  color?: string;
}

const ShapeTitle: React.FC<ShapeTitleProps> = ({
  title,
  color = "#cce3de",
}) => {
  return (
    <div className="relative inline-block mb-6">
      <div
        className="absolute -top-2 -left-3 w-16 h-8 rounded-full opacity-60"
        style={{ backgroundColor: color }}
      ></div>
      <h2 className="relative text-2xl md:text-3xl font-bold text-[#0a3d62] font-[Quicksand]">
        {title}
      </h2>
    </div>
  );
};

export default ShapeTitle;
