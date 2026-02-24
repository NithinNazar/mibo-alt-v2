import React from "react";
import { motion } from "framer-motion";
import ShapeTitle from "./ShapeTitle";
import FallbackImage from "../../../components/FallbackImage";
import director from "../assets/director.png?w=600&format=webp&quality=85";

const DirectorsNote: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-20 bg-[#f7fbfa]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <FallbackImage
            src={director}
            alt="Managing Director"
            className="w-full rounded-[3rem] object-cover shadow-md"
            fallbackColor="#cce3de"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <ShapeTitle title="Managing Director’s Note" />
          <p className="text-[#2b2b2b] text-lg leading-relaxed font-[Quicksand] mt-4">
            “At Mibo, we believe that mental health care should be as natural
            and essential as physical health care. Our vision is to make
            compassionate, clinically strong, and holistic care accessible to
            everyone — wherever they are.”
          </p>
          <p className="mt-6 text-[#0a3d62] font-semibold font-[Quicksand]">
            — Managing Director, Mibo
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DirectorsNote;
