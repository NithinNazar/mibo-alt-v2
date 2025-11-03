// src/pages/Experts/data/doctors.ts
import doctor1 from "../assets/doctor-dp-1.png";
import doctor2 from "../assets/doctor-dp-2.png";
import doctor3 from "../assets/doctor-dp-3.png";
import doctor4 from "../assets/doctor-dp-4.png";
import doctor5 from "../assets/doctor-dp-5.png";
import doctor6 from "../assets/doctor-dp-6.png";
import doctor7 from "../assets/doctor-dp-7.png";
import doctor8 from "../assets/doctor-dp-8.png";

export interface Doctor {
  id: number;
  name: string;
  qualification: string;
  designation: string;
  experience: string;
  expertise: string[];
  image: string;
  location: string;
  language: string[];
  price: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aisha Mehta",
    qualification: "PhD, Clinical Psychology",
    designation: "Senior Therapist",
    experience: "10+ years",
    expertise: ["Anxiety", "Depression", "Work Stress", "Relationships"],
    location: "Bangalore",
    language: ["English", "Hindi"],
    price: "₹1500–2500/hr",
    image: doctor1,
  },
  {
    id: 2,
    name: "Dr. Rahul Desai",
    qualification: "MD, Psychiatry",
    designation: "Consultant Psychiatrist",
    experience: "8+ years",
    expertise: ["Bipolar Disorder", "Sleep Issues", "Addiction"],
    location: "Mumbai",
    language: ["English", "Marathi"],
    price: "₹2500–5000/hr",
    image: doctor2,
  },
  {
    id: 3,
    name: "Dr. Meera Nair",
    qualification: "MPhil, Psychology",
    designation: "Clinical Psychologist",
    experience: "7+ years",
    expertise: ["Trauma", "Family Therapy", "Adolescents"],
    location: "Kochi",
    language: ["English", "Malayalam"],
    price: "₹1000–1500/hr",
    image: doctor3,
  },
  {
    id: 4,
    name: "Dr. Aditya Sharma",
    qualification: "MD, Psychiatry",
    designation: "Lead Psychiatrist",
    experience: "12+ years",
    expertise: ["OCD", "Mood Disorders", "Schizophrenia"],
    location: "Bangalore",
    language: ["English", "Hindi"],
    price: "₹2500–5000/hr",
    image: doctor4,
  },
  {
    id: 5,
    name: "Dr. Neha Kapoor",
    qualification: "MSc, Counselling Psychology",
    designation: "Therapist",
    experience: "6+ years",
    expertise: ["Self-esteem", "Stress", "Cognitive Therapy"],
    location: "Mumbai",
    language: ["English", "Hindi"],
    price: "₹1000–1500/hr",
    image: doctor5,
  },
  {
    id: 6,
    name: "Dr. Aarav Singh",
    qualification: "PhD, Psychiatry",
    designation: "Consultant Psychiatrist",
    experience: "9+ years",
    expertise: ["PTSD", "ADHD", "Personality Disorders"],
    location: "Kochi",
    language: ["English", "Tamil"],
    price: "₹1500–2500/hr",
    image: doctor6,
  },
  {
    id: 7,
    name: "Dr. Isha Thomas",
    qualification: "MPhil, Clinical Psychology",
    designation: "Therapist",
    experience: "5+ years",
    expertise: ["Mindfulness", "Anger", "Behavioral Issues"],
    location: "Bangalore",
    language: ["English", "Malayalam"],
    price: "₹1000–1500/hr",
    image: doctor7,
  },
  {
    id: 8,
    name: "Dr. Rohan Pillai",
    qualification: "MD, Psychiatry",
    designation: "Senior Consultant",
    experience: "11+ years",
    expertise: ["Anxiety", "Mood Disorders", "Sleep Disorders"],
    location: "Mumbai",
    language: ["English", "Hindi"],
    price: "₹2500–5000/hr",
    image: doctor8,
  },
];

// // src/pages/Experts/data/doctors.ts
// import doctor1 from "../assets/doctor-dp-1.png";
// import doctor2 from "../assets/doctor-dp-2.png";
// import doctor3 from "../assets/doctor-dp-3.png";
// import doctor4 from "../assets/doctor-dp-4.png";
// import doctor5 from "../assets/doctor-dp-5.png";
// import doctor6 from "../assets/doctor-dp-6.png";
// import doctor7 from "../assets/doctor-dp-7.png";
// import doctor8 from "../assets/doctor-dp-8.png";

// export interface Doctor {
//   id: number;
//   name: string;
//   qualification: string;
//   designation: string;
//   experience: string;
//   expertise: string[];
//   image: string;
// }

// export const doctors: Doctor[] = [
//   {
//     id: 1,
//     name: "Dr. Aisha Mehta",
//     qualification: "PhD, Clinical Psychology",
//     designation: "Senior Therapist",
//     experience: "10+ years",
//     expertise: ["Anxiety", "Depression", "Work Stress", "Relationships"],
//     image: doctor1,
//   },
//   {
//     id: 2,
//     name: "Dr. Rahul Desai",
//     qualification: "MD, Psychiatry",
//     designation: "Consultant Psychiatrist",
//     experience: "8+ years",
//     expertise: ["Bipolar Disorder", "Sleep Issues", "Addiction"],
//     image: doctor2,
//   },
//   {
//     id: 3,
//     name: "Dr. Meera Nair",
//     qualification: "MPhil, Psychology",
//     designation: "Clinical Psychologist",
//     experience: "7+ years",
//     expertise: ["Trauma", "Family Therapy", "Adolescents"],
//     image: doctor3,
//   },
//   {
//     id: 4,
//     name: "Dr. Aditya Sharma",
//     qualification: "MD, Psychiatry",
//     designation: "Lead Psychiatrist",
//     experience: "12+ years",
//     expertise: ["OCD", "Mood Disorders", "Schizophrenia"],
//     image: doctor4,
//   },
//   {
//     id: 5,
//     name: "Dr. Neha Kapoor",
//     qualification: "MSc, Counselling Psychology",
//     designation: "Therapist",
//     experience: "6+ years",
//     expertise: ["Self-esteem", "Stress", "Cognitive Therapy"],
//     image: doctor5,
//   },
//   {
//     id: 6,
//     name: "Dr. Aarav Singh",
//     qualification: "PhD, Psychiatry",
//     designation: "Consultant Psychiatrist",
//     experience: "9+ years",
//     expertise: ["PTSD", "ADHD", "Personality Disorders"],
//     image: doctor6,
//   },
//   {
//     id: 7,
//     name: "Dr. Isha Thomas",
//     qualification: "MPhil, Clinical Psychology",
//     designation: "Therapist",
//     experience: "5+ years",
//     expertise: ["Mindfulness", "Anger", "Behavioral Issues"],
//     image: doctor7,
//   },
//   {
//     id: 8,
//     name: "Dr. Rohan Pillai",
//     qualification: "MD, Psychiatry",
//     designation: "Senior Consultant",
//     experience: "11+ years",
//     expertise: ["Anxiety", "Mood Disorders", "Sleep Disorders"],
//     image: doctor8,
//   },
// ];
