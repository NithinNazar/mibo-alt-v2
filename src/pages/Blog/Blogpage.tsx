// import { Mail, ArrowRight } from "lucide-react";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";

import { motion } from "framer-motion";
import groupSession from "../../assets/group_session.jpg?w=1200&format=webp&quality=75";
import { blogTitle, blogContent } from "./blogContent";

export default function Blogpage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExpertsHeader />
      {/* Hero Image */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <img
          src={groupSession}
          alt="Group therapy session"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
            {blogTitle}
          </h1>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="prose prose-gray max-w-none"
        >
          {blogContent}
        </motion.div>

        {/* 📩 Email subscription card */}
        <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to get notified when we publish new mental health articles
            and updates.
          </p>

          <div className="flex flex-col sm:flex-col gap-3 items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#034B44]"
            />
            <button className="w-full sm:w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <ExpertsFooter />
    </div>
  );
}
