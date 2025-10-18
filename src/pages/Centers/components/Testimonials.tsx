import React from "react";

const testimonials = [
  {
    name: "Ravi Sharma",
    text: "Mibo’s therapists truly care. My sessions in Bengaluru helped me find balance again.",
  },
  {
    name: "Priya S.",
    text: "Such a warm and professional environment — felt supported from day one.",
  },
];

const Testimonials: React.FC = () => (
  <section className="py-16 bg-mibo-offwhite text-center">
    <h2 className="text-2xl md:text-3xl font-bold text-mibo-green mb-10">
      What Our Clients Say
    </h2>
    <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 px-6">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-mibo-teal-light p-6 rounded-xl shadow-sm">
          <p className="text-gray-700 mb-4">“{t.text}”</p>
          <h3 className="font-semibold text-mibo-green">— {t.name}</h3>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
