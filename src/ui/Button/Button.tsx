import React, { useState, useEffect } from "react";
import "../Button/Button.css";

interface FloatingButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  backgroundColor?: string;
  textColor?: string;
  hideOnScroll?: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  text = "SIGN UP",
  icon,
  onClick,
  position = "top-right",
  backgroundColor = "#5b46c7",
  textColor = "#ffffff",
  hideOnScroll = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (hideOnScroll) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hideOnScroll]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default action - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="demo-container">
      {/* Demo content to show scrolling */}
      <div className="demo-content">
        <div className="demo-header">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>mibo</span>
          </div>
        </div>

        <div className="hero-section">
          <h1>Integrated Care</h1>
          <p>
            From self-care & therapy, to peer support & medication management,
            we can help with it all.
          </p>
          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="content-section">
          <h2>Our mental healthcare offerings</h2>
          <p>
            We are a mental health ecosystem that brings together multiple
            treatment options to create an experience that makes getting help
            easy and seamless. From assessment to treatment, we're with you
            every step of the way.
          </p>
        </div>

        <div className="filler-content">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="content-block">
              <h3>Section {i + 1}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        className={`floating-btn floating-btn--${position} ${
          isVisible ? "floating-btn--visible" : "floating-btn--hidden"
        }`}
        onClick={handleClick}
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        {icon && <span className="floating-btn__icon">{icon}</span>}
        <span className="floating-btn__text">{text}</span>
      </button>
    </div>
  );
};

export default FloatingButton;
