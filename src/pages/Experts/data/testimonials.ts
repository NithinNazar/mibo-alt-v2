// src/pages/Experts/data/testimonials.ts
export interface Testimonial {
  id: number;
  name: string;
  feedback: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aarushi P.",
    feedback:
      "Dr. Aisha helped me rediscover calm in my daily life. I’ve never felt more supported!",
  },
  {
    id: 2,
    name: "Ritika D.",
    feedback:
      "The therapy experience at Mibo was so professional yet personal. Highly recommend.",
  },
  {
    id: 3,
    name: "Karthik R.",
    feedback:
      "My sessions with Dr. Rahul were life-changing. He made mental health approachable.",
  },
];
