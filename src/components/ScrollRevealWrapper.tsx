import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface Props {
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom" | "fade";
  delay?: number;
  cascade?: boolean;
}

const ScrollRevealWrapper: React.FC<Props> = ({
  children,
  direction = "fade",
  delay = 0,
  cascade = true,
}) => {
  const delaySeconds = Math.max(0, delay) / 1000;
  const distance = direction === "left" || direction === "right" ? 150 : 100;
  const xHidden =
    direction === "left" ? -distance : direction === "right" ? distance : 0;
  const yHidden =
    direction === "top" ? -distance : direction === "bottom" ? distance : 0;

  const childVariant: Variants = {
    hidden: { opacity: 0, x: xHidden, y: yHidden },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const containerVariant: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delaySeconds,
        staggerChildren: cascade ? 0.5 : 0,
      },
    },
  };

  if (cascade) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariant}
      >
        {React.Children.map(children, (child) => (
          <motion.div variants={childVariant}>{child}</motion.div>
        ))}
      </motion.div>
    );
  }

  const blockVariant: Variants = {
    hidden: { opacity: 0, x: xHidden, y: yHidden },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 3,
        delay: delaySeconds,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={blockVariant}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealWrapper;
