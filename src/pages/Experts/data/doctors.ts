// src/pages/Experts/data/doctors.ts
export interface Doctor {
  id: number;
  name: string;
  qualification: string;
  designation: string;
  experience: string;
  expertise: string[];
  image: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aisha Mehta",
    qualification: "PhD, Clinical Psychology",
    designation: "Senior Therapist",
    experience: "10+ years",
    expertise: ["Anxiety", "Depression", "Work Stress", "Relationships"],
    image: "doctor_dp_1",
  },
  {
    id: 2,
    name: "Dr. Rahul Desai",
    qualification: "MD, Psychiatry",
    designation: "Consultant Psychiatrist",
    experience: "8+ years",
    expertise: ["Bipolar Disorder", "Sleep Issues", "Addiction"],
    image: "doctor_dp_2",
  },
  {
    id: 3,
    name: "Dr. Meera Nair",
    qualification: "MPhil, Psychology",
    designation: "Clinical Psychologist",
    experience: "7+ years",
    expertise: ["Trauma", "Family Therapy", "Adolescents"],
    image: "doctor_dp_3",
  },
  {
    id: 4,
    name: "Dr. Aditya Sharma",
    qualification: "MD, Psychiatry",
    designation: "Lead Psychiatrist",
    experience: "12+ years",
    expertise: ["OCD", "Mood Disorders", "Schizophrenia"],
    image: "doctor_dp_4",
  },
  {
    id: 5,
    name: "Dr. Neha Kapoor",
    qualification: "MSc, Counselling Psychology",
    designation: "Therapist",
    experience: "6+ years",
    expertise: ["Self-esteem", "Stress", "Cognitive Therapy"],
    image: "doctor_dp_5",
  },
  {
    id: 6,
    name: "Dr. Aarav Singh",
    qualification: "PhD, Psychiatry",
    designation: "Consultant Psychiatrist",
    experience: "9+ years",
    expertise: ["PTSD", "ADHD", "Personality Disorders"],
    image: "doctor_dp_6",
  },
  {
    id: 7,
    name: "Dr. Isha Thomas",
    qualification: "MPhil, Clinical Psychology",
    designation: "Therapist",
    experience: "5+ years",
    expertise: ["Mindfulness", "Anger", "Behavioral Issues"],
    image: "doctor_dp_7",
  },
  {
    id: 8,
    name: "Dr. Rohan Pillai",
    qualification: "MD, Psychiatry",
    designation: "Senior Consultant",
    experience: "11+ years",
    expertise: ["Anxiety", "Mood Disorders", "Sleep Disorders"],
    image: "doctor_dp_8",
  },
];
