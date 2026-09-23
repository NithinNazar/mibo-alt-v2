// src/pages/Landing/psychiatristFaqData.ts
//
// FAQ content for the Psychiatrist Landing Page (PsychiatristLanding.tsx).
// Kept in its own file so the Q&A copy can be reviewed/updated by
// non-engineers without touching component logic, and so the same data
// can be reused for the on-page accordion and the FAQPage JSON-LD schema.

export interface PsychiatristFaqItem {
  question: string;
  answer: string;
}

export const psychiatristFaqData: PsychiatristFaqItem[] = [
  {
    question: "What does a psychiatrist do?",
    answer:
      "A psychiatrist is a medical doctor who specialises in mental health. Psychiatrists assess mental health concerns and may recommend treatments such as medication, therapy, lifestyle changes or a combination of approaches based on the individual's needs.",
  },
  {
    question: "When should I see a psychiatrist?",
    answer:
      "You may consider consulting a psychiatrist when concerns such as persistent sadness, anxiety, mood changes, sleep problems, difficulty concentrating or other emotional or behavioural changes begin affecting your daily life, relationships or overall wellbeing.",
  },
  {
    question: "How do I book a psychiatrist consultation in Bangalore?",
    answer:
      "You can book an appointment with a MIBO psychiatrist through our website or by calling us. We offer convenient consultation options based on psychiatrist availability.",
  },
  {
    question: "Can I consult a psychiatrist online?",
    answer:
      "Yes. MIBO offers online psychiatric consultations, allowing you to speak with a psychiatrist remotely from a convenient location. Availability depends on the psychiatrist and appointment schedule.",
  },
  {
    question: "Can I meet a psychiatrist in person in Bangalore?",
    answer:
      "Yes. MIBO offers in-person psychiatric consultations at its available Bangalore locations. You can choose an in-person appointment based on location and psychiatrist availability.",
  },
  {
    question: "What happens during the first psychiatric consultation?",
    answer:
      "During the first consultation, the psychiatrist will discuss your concerns, understand your mental health history and current symptoms, and assess your needs. Based on the assessment, they may recommend an appropriate treatment and follow-up plan.",
  },
  {
    question: "Is psychiatric consultation confidential?",
    answer:
      "Yes. Your consultation and personal information are handled with privacy and confidentiality in accordance with applicable professional and legal requirements.",
  },
  {
    question: "Can a psychiatrist help with anxiety and depression?",
    answer:
      "Yes. Psychiatrists can assess and provide appropriate care for concerns such as anxiety and depression. Treatment recommendations depend on the individual's symptoms, history and clinical assessment.",
  },
  {
    question: "How long does a psychiatric consultation take?",
    answer:
      "The duration of a consultation can vary depending on the individual's concerns and the psychiatrist's assessment. Your psychiatrist will take the time needed to understand your concerns and provide appropriate guidance.",
  },
  {
    question: "Do I need to take medication if I see a psychiatrist?",
    answer:
      "Not necessarily. Treatment depends on your individual needs and clinical assessment. A psychiatrist may recommend medication when appropriate, along with other forms of support or treatment.",
  },
  {
    question: "Can I choose between online and in-person consultation?",
    answer:
      "Yes. MIBO provides both online and in-person consultation options, subject to psychiatrist availability and the suitability of the consultation format.",
  },
  {
    question: "How can I book an appointment with a MIBO psychiatrist?",
    answer:
      "You can book an appointment through the website or contact MIBO directly using the Call Now option. Our team can help you with available psychiatrists and appointment timings.",
  },
];