// src/pages/Landing/psychiatristReviewsData.ts
//
// Real patient reviews for MIBO's Google Business Profile, used on the
// Psychiatrist Landing Page's "What Our Patients Say" section. Kept in
// its own file (name + review text only — no photos) so the testimonial
// copy can be refreshed independently of component logic.
//
// Source: Google Maps listing for "Mibo Bangalore". Some reviews are
// shown as Google truncates them ("... More" on the listing) — the
// trailing ellipsis reflects that truncation rather than an edit on our
// part. Do not append fabricated text after the ellipsis.

export interface PsychiatristReviewItem {
  name: string;
  text: string;
}

export const psychiatristReviewsData: PsychiatristReviewItem[] = [
  {
    name: "Sheela Reddy",
    text: "I visited the MIBO Centre and had a very positive experience overall. From the moment I walked in, the environment was clean, calm, and well organized. The staff was extremely polite, approachable, and took the time to explain everything…",
  },
  {
    name: "Sangeetha J",
    text: "We had a wonderful experience at Mibo. From the very beginning, the entire team made our treatment journey smooth, transparent, and stress-free. The supportive doctors here truly stand out for their professionalism and excellent bedside…",
  },
  {
    name: "Mahi Akula",
    text: "My visit to Mibo was a wonderful experience. The environment is so great and welcoming with calm and peaceful ambience. The staff is polite and professional in providing services with greater confidence. The Psychiatrists and Psychologists…",
  },
  {
    name: "Harshitha",
    text: "Had a good experience with Mibo Hospital. The overall environment is clean, calm, and well-maintained, which makes it suitable for mental health treatment.…",
  },
  {
    name: "Ashvini Kumar Saxena",
    text: "Excellent hospital cum clinic. Psychologist Ms. Yashaswini and psychiatrist Dr. Miller are excellent professionals. The atmosphere is friendly and comfortable and appointment timings are strictly honoured. The rooms are comfortable and relaxing to converse. I can see so many great reviews and I would say, I agree with them.",
  },
  {
    name: "Rina Jain",
    text: "Visiting MIBO was a great experience altogether!! The ambience is so welcoming and calming.. doesn't feel like a mental health facility!! Was just mesmerised with the place! Their approach towards mental health and pioneering mind lab is…",
  },
  {
    name: "Sneha M",
    text: "I had a very good experience at MIBO. It feels calm, private, and welcoming. The place is well equipped, with everything available in one location. The care feels personal, the team is warm, and Amal has been very good in guiding the process.",
  },
  {
    name: "Niishanth Kaushik",
    text: "I'm incredibly grateful for the care and support I received from my therapist Mr. Naufal and psychiatrist Dr. Miller. They truly changed my life for the better and helped me recover from a very difficult period of depression and anxiety. Their…",
  },
  {
    name: "Mona Trivedi",
    text: "Mibo is the very best Psychological and Psychiatric clinic in Bangalore. Mibo's doctors and supporting staff are very dedicated to excellent patient care. Highly recommend Dr. Srinivas Reddy — he is the world's best doctor. Very much thankful to Mibo and team, and Dr. Millar.",
  },
  {
    name: "Poojapooja Poojapooja",
    text: "It was an incredibly compassionate and understanding psychologist. I always feel heard and supported during our sessions. Highly recommend to anyone seeking professional and caring mental health support.",
  },
];