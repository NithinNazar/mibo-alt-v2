import React from "react";

interface FallbackImageProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackColor?: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt = "",
  className = "",
  style = {},
  fallbackColor = "#cce3de",
}) => {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ backgroundColor: fallbackColor, ...style }}
      />
    );
  }

  return <img src={src} alt={alt} className={className} style={style} />;
};

export default FallbackImage;
