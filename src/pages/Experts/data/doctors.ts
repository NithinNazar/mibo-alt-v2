// src/pages/Experts/data/doctors.ts
/**
 * Real doctor data from Mibo Mental Health centres
 * Data sourced from city-specific folders: bangalore, kochi, mumbai
 *
 * Language mapping by location:
 * - Bangalore: English, Kannada, Hindi, Tamil, Malayalam
 * - Kochi: Malayalam, English
 * - Mumbai: English, Hindi, Marathi
 */

// Bangalore doctors
import drJini from "../../../bangalore/Dr.-Jini-K-Gopinath.png";
import drSadik from "../../../bangalore/Dr.-Muhammed-Sadik.png";
import drPrajwal from "../../../bangalore/Dr. Prajwal Devurkar.png";
import ashirSahal from "../../../bangalore/Mr.-Ashir-Sahal-.png";
import hridya from "../../../bangalore/Dr.-Hridya-.png";
import abhinand from "../../../bangalore/Abhinand-01-scaled.png";
import drSrinivas from "../../../bangalore/Dr.-Srinivas-Reddy.png";
import shamroz from "../../../bangalore/shamroz-abdu.png";
import mauli from "../../../bangalore/Mauli-.png";
import ajay from "../../../bangalore/Ajay-.png";
import drMiller from "../../../bangalore/Dr.Miller-.png";
import naufal from "../../../bangalore/Naufal-MA-.png";
import drVishakh from "../../../bangalore/Vishakh.png";
import jerry from "../../../bangalore/Dr.-Jerry-.png";
import yashaswini from "../../../bangalore/Yashaswini-01-.png";
import lincy from "../../../bangalore/Lincy-Benny.png";

// Kochi doctors
import drThomas from "../../../kochi/thomas-mathai.png";
import sruthi from "../../../kochi/sruthy annie vincent.png";
import drSangeetha from "../../../kochi/sangeetha.png";
import drAnu from "../../../kochi/anu shobha.png";
import anet from "../../../kochi/Anet-Augustine-.png";
import ria from "../../../kochi/Ria.png";

// Mumbai doctors
import drDhruvi from "../../../mumbai/Dr.-Dhruvi .png";

export interface Doctor {
  id: number;
  name: string;
  qualification: string;
  designation: string;
  experience: string;
  expertise: string[];
  image: string;
  location: "Bangalore" | "Kochi" | "Mumbai";
  language: string[];
  price: string;
  sessionTypes: string;
}

export const doctors: Doctor[] = [
  // ============ BANGALORE DOCTORS ============
  {
    id: 1,
    name: "Dr. Jini K. Gopinath",
    qualification: "Clinical Hypnotherapist",
    designation: "Senior Clinical Psychologist, Advisor – Mibo",
    experience: "10+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Trauma", "Sleep Issues"],
    location: "Bangalore",
    language: ["English", "Hindi", "Malayalam", "Kannada"],
    price: "₹1600/session",
    image: drJini,
    sessionTypes: "In-person & Online sessions",
  },
  {
    id: 2,
    name: "Dr. Muhammed Sadik T.M",
    qualification: "Ph.D., M.Phil (Clinical Psychology)",
    designation: "Director of Psychology Services",
    experience: "10+ years",
    expertise: [
      "Depression",
      "Anxiety",
      "Relationships",
      "Work Stress",
      "PTSD",
    ],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Tamil"],
    price: "₹1600/session",
    image: drSadik,
    sessionTypes: "In-person & Online Consultations",
  },
  {
    id: 3,
    name: "Dr. Prajwal Devurkar",
    qualification: "MBBS, MD",
    designation: "Medical Director, Head of Operations",
    experience: "8+ years",
    expertise: ["Bipolar Disorder", "Schizophrenia", "OCD", "Mood Disorders"],
    location: "Bangalore",
    language: ["English", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: drPrajwal,
    sessionTypes: "In-person & Online Sessions",
  },
  {
    id: 4,
    name: "Ashir Sahal K. T",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4 years",
    expertise: ["Anxiety", "Depression", "Stress", "Relationships"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: ashirSahal,
    sessionTypes: "In-person & Online Sessions",
  },
  {
    id: 5,
    name: "Hridya V M",
    qualification: "M.Sc, M.Phil",
    designation: "Head of the Department, Clinical Psychologist",
    experience: "5 years",
    expertise: ["Anxiety", "Depression", "Trauma", "Family Therapy"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: hridya,
    sessionTypes: "Online Sessions",
  },
  {
    id: 6,
    name: "Abhinand P.S",
    qualification: "M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Stress", "Anxiety", "Work Stress", "Relationships"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Tamil"],
    price: "₹1600/session",
    image: abhinand,
    sessionTypes: "In-person & Online Consultations",
  },
  {
    id: 7,
    name: "Dr. Srinivas Reddy",
    qualification: "MBBS, MRCPsych",
    designation: "Consultant Psychiatrist",
    experience: "7+ years",
    expertise: ["Depression", "Anxiety", "Bipolar Disorder", "Schizophrenia"],
    location: "Bangalore",
    language: ["English", "Hindi", "Kannada", "Tamil"],
    price: "₹1600/session",
    image: drSrinivas,
    sessionTypes: "In-person & Online sessions",
  },
  {
    id: 8,
    name: "Shamroz Abdu",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Trauma"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: shamroz,
    sessionTypes: "In Person & Online Sessions",
  },
  {
    id: 9,
    name: "Mauli Rastogi",
    qualification: "M.Phil, M.Sc (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4+ years",
    expertise: ["Anxiety", "Depression", "Relationships", "Self-esteem"],
    location: "Bangalore",
    language: ["English", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: mauli,
    sessionTypes: "In-person & Online Consultations",
  },
  {
    id: 10,
    name: "Ajay Siby",
    qualification: "M.Sc. Clinical Psychology",
    designation: "Counselling Psychologist",
    experience: "3+ years",
    expertise: ["Stress", "Anxiety", "Work Stress", "Relationships"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Tamil"],
    price: "₹1600/session",
    image: ajay,
    sessionTypes: "In-person & Online sessions",
  },
  {
    id: 11,
    name: "Dr. Miller A M",
    qualification: "MBBS, MD (Psychiatry), PDF (Emergency Psychiatry)",
    designation: "Consultant Psychiatrist",
    experience: "5+ years",
    expertise: ["Depression", "Anxiety", "Bipolar Disorder", "OCD", "PTSD"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: drMiller,
    sessionTypes: "In-person & Online Sessions",
  },
  {
    id: 12,
    name: "Naufal M. A",
    qualification: "M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Trauma"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Tamil"],
    price: "₹1600/session",
    image: naufal,
    sessionTypes: "In-person & Online Consultations",
  },
  {
    id: 13,
    name: "Dr Vishakh Biradar",
    qualification:
      "MD (Psychiatry), Postdoctoral Fellowship in Child & Adolescent Psychiatry",
    designation: "Consultant Child & Adolescent Psychiatrist",
    experience: "5+ years",
    expertise: ["ADHD", "Autism", "Child Anxiety", "Adolescent Issues", "OCD"],
    location: "Bangalore",
    language: ["English", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: drVishakh,
    sessionTypes: "In-person & Online Consultations",
  },
  {
    id: 14,
    name: "Jerry P Mathew",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4 years",
    expertise: ["Anxiety", "Depression", "Relationships", "Stress"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Tamil"],
    price: "₹1600/session",
    image: jerry,
    sessionTypes: "Online Sessions",
  },
  {
    id: 15,
    name: "Yashaswini R S",
    qualification: "M.Phil Clinical Psychology",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Self-esteem"],
    location: "Bangalore",
    language: ["English", "Hindi", "Kannada", "Tamil"],
    price: "₹1600/session",
    image: yashaswini,
    sessionTypes: "In-person & Online Sessions",
  },
  {
    id: 16,
    name: "Lincy Benny B",
    qualification: "M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Trauma", "Relationships"],
    location: "Bangalore",
    language: ["English", "Malayalam", "Hindi", "Kannada"],
    price: "₹1600/session",
    image: lincy,
    sessionTypes: "Online Sessions",
  },

  // ============ KOCHI DOCTORS ============
  {
    id: 17,
    name: "Dr Thomas Mathai",
    qualification: "MBBS, DPM, DNB",
    designation: "Consultant Psychiatrist",
    experience: "6 years",
    expertise: ["Depression", "Anxiety", "Bipolar Disorder", "Schizophrenia"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: drThomas,
    sessionTypes: "In-Person & Online Sessions",
  },
  {
    id: 18,
    name: "Sruthi Annie Vincent",
    qualification: "M.Phil. Clinical Psychology",
    designation: "Clinical Psychologist",
    experience: "5 years",
    expertise: ["Anxiety", "Depression", "Trauma", "Family Therapy"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: sruthi,
    sessionTypes: "In-Person & Online Sessions",
  },
  {
    id: 19,
    name: "Dr Sangeetha O S",
    qualification: "MBBS MD",
    designation: "Consultant Psychiatrist",
    experience: "2 years",
    expertise: ["Depression", "Anxiety", "OCD", "Mood Disorders"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: drSangeetha,
    sessionTypes: "In-Person & Online Sessions",
  },
  {
    id: 20,
    name: "Dr Anu Sobha",
    qualification: "MBBS, DPM, PGDFM",
    designation: "Consultant Psychiatrist",
    experience: "7 years",
    expertise: ["Depression", "Anxiety", "PTSD", "Bipolar Disorder"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: drAnu,
    sessionTypes: "In-Person & Online Sessions",
  },
  {
    id: 21,
    name: "Anet Augustine",
    qualification: "M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Relationships"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: anet,
    sessionTypes: "In-person & Online Sessions",
  },
  {
    id: 22,
    name: "Ria Mary",
    qualification: "M.Phil, M.Sc (Clinical Psychology)",
    designation: "Clinical Psychologist, Licensed by RCI",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Trauma", "Family Therapy"],
    location: "Kochi",
    language: ["Malayalam", "English"],
    price: "₹1600/session",
    image: ria,
    sessionTypes: "In-person & Online Consultations",
  },

  // ============ MUMBAI DOCTORS ============
  {
    id: 23,
    name: "Dhruvi Kiklawala",
    qualification: "M.Sc, M.Phil",
    designation: "Clinical Psychologist",
    experience: "3+ years",
    expertise: ["Anxiety", "Depression", "Stress", "Relationships"],
    location: "Mumbai",
    language: ["English", "Hindi", "Marathi"],
    price: "₹1600/session",
    image: drDhruvi,
    sessionTypes: "In-person & Online Sessions",
  },
];
