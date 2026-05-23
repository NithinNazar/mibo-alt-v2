import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="mt-12 px-4">
      <h2 className="text-2xl font-semibold text-center text-[#034B44] mb-6">
        What Our Clients Say
      </h2>

      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
        {testimonials.map((t, index) => (
          <div
            key={t.id}
            className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl p-5 w-[280px] flex-shrink-0 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <p className="text-[#034B44]/80 italic mb-3">"{t.feedback}"</p>
            <p className="text-[#034B44] font-semibold text-sm">- {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
