
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
  // --- Bengaluru Team ---
  {
    id: 1,
    name: "Dr. Jini K. Gopinath",
    qualification: "Ph.D., Clinical Psychology",
    designation: "Senior Clinical Psychologist",
    experience: "17+ years",
    expertise: ["Clinical Hypnotherapy", "Psychotherapy", "Clinical Psychology"],
    location: "Bengaluru",
    language: ["English", "Malayalam", "Hindi"],
    price: "₹1000",
    image: "https://mibocare.in/wp-content/uploads/2024/03/Dr.-Jini-K-Gopinath.png",
  },
  {
    id: 2,
    name: "Ashir Sahal K. T",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4 years",
    expertise: ["Cognitive Behavioral Therapy", "Adolescent Therapy", "Anxiety"],
    location: "Bengaluru",
    language: ["English", "Malayalam"],
    price: "₹1500",
    image: "https://mibocare.in/wp-content/uploads/2025/04/Mr.-Ashir-Sahal-01-1-1536x1240.png",
  },
  {
    id: 3,
    name: "Dr. Srinivas Reddy",
    qualification: "MBBS, MRCPsych",
    designation: "Consultant Psychiatrist",
    experience: "30+ years",
    expertise: ["Depression", "Anxiety Disorders", "Bipolar Disorder", "Schizophrenia"],
    location: "Bengaluru",
    language: ["English", "Kannada", "Hindi"],
    price: "₹2000",
    image: "https://mibocare.in/wp-content/uploads/2024/03/Dr.-Srinivas-Reddy.png",
  },
  {
    id: 4,
    name: "Dr. Muhammed Sadik T. M",
    qualification: "Ph.D., M.Phil (Clinical Psychology)",
    designation: "Director of Psychology Services",
    experience: "10+ years",
    expertise: ["Psychotherapy", "Academic Counseling", "Mental Health Management"],
    location: "Bengaluru",
    language: ["English", "Malayalam", "Hindi"],
    price: "Enquire for rates",
    image: "https://mibocare.in/wp-content/uploads/2025/10/Dr.-Muhammed-Sadik-scaled.png",
  },
   {
    id: 5,
    name: "Dr. Vishakh Biradar",
    qualification: "MD (Psychiatry), Postdoctoral Fellowship in Child & Adolescent Psychiatry",
    designation: "",
    experience: "5+ years",
    expertise: ["Child & Adolescent Psychiatry"],
    image: "https://mibocare.in/wp-content/uploads/2025/09/Noel--1536x1486.png",
    location: "Bengaluru",
    language: [],
    price: "₹1000",
  },
  {
    id: 6,
    name: "Dr. Sowmyashree Narayan",
    qualification: "MD Psychiatry,",
    designation: "",
    experience: "10+ years",
    expertise: ["ADHD", "Childhood Disorders", "Substance Use Disorders", "Developmental Disorders"],
    location: "Bengaluru",
    language: ["English", "Kannada", "Hindi"],
    price: "₹1000",
    image: "https://mibocare.in/wp-content/uploads/2024/08/Somaya-01.png",
  },
   
  
  {
    id: 7,
    name: "Hridya V. M",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Head of the Department",
    experience: "5 years",
    expertise: ["Depression", "Anxiety", "Emotional Dysregulation", "Psychological Wellness"],
    location: "Bengaluru",
    language: ["English", "Malayalam"],
    price: "₹1000–2000",
    image: "https://mibocare.in/wp-content/uploads/2024/03/Dr.-Hridya-1.png",
  },
  {
    id: 8,
    name: "Dr. Miller A. M",
    qualification: "MBBS, MD (Psychiatry), PDF",
    designation: "Consultant Psychiatrist",
    experience: "5+ years",
    expertise: ["Emergency Psychiatry", "Acute Care", "Mood Disorders"],
    location: "Bengaluru",
    language: ["English", "Hindi"],
    price: "₹1000–2000/hr",
    image: "https://mibocare.in/wp-content/uploads/2025/08/Dr.Miller-01-1536x1240.png",
  },

  // --- Kochi Team ---
  {
    id: 9,
    name: "Dr. Thomas Mathai",
    qualification: "MBBS, DPM, DNB",
    designation: "Consultant Psychiatrist",
    experience: "6 years",
    expertise: ["Couple Therapy", "Emotional Wellness", "Patient-Centered Care"],
    location: "Kochi",
    language: ["English", "Malayalam"],
    price: "2000/hr",
    image: "https://mibocare.in/wp-content/uploads/2023/11/thomas-mathai.png",
  },
 
  {
    id: 10,
    name: "Shamroz Abdu",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "5 years",
    expertise: ["Anxiety", "Depression", "Drug Abuse", "Learning Disabilities", "CBT"],
    location: "Kochi / Bengaluru",
    language: ["English", "Hindi", "Malayalam", "Tamil"],
    price: "₹1500–2500/hr",
    image: "https://mibocare.in/wp-content/uploads/2023/11/shamroz-abdu.png",
  },
  {
    id: 11,
    name: "Dr. Sangeetha O. S",
    qualification: "MBBS, MD (Psychiatry)",
    designation: "Consultant Psychiatrist",
    experience: "2 years",
    expertise: ["Child and Adolescent Psychiatry", "Depression", "Anxiety", "Schizophrenia"],
    location: "Kochi",
    language: ["English", "Malayalam"],
    price: "₹1000–2000/hr",
    image: "https://mibocare.in/wp-content/uploads/2023/11/sangeetha.png",
  },
    {
  id: 12,
  name: "Dr. Anu Sobha Jose",
  qualification: "MBBS, DPM (Psychiatry), PGDFM",
  designation: "Consultant Psychiatrist",
  experience: "7+ years",
  expertise: [
    "Psychiatric Medicine", 
    "Child Psychiatry", 
    "De-addiction Treatment", 
    "Mental Health Management", 
    "Behavior Modification"
  ],
  location: "Kochi",
  language: ["English", "Malayalam"],
  price: "₹1000–2000/hr",
  image: "https://mibocare.in/wp-content/uploads/2023/11/Member_10.png",
},
 /*  {
    id: 18,
    name: "Anoop B. S",
    qualification: "M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "5+ years",
    expertise: ["Addiction", "Personality Disorders", "CBT", "DBT"],
    location: "Kochi",
    language: ["English", "Malayalam", "Tamil"],
    price: "Enquire for rates",
    image: "https://mibocare.in/wp-content/uploads/2023/05/Anoop-BS.jpg",
  }, */

   {
    id: 13,
    name: "Dr. Prajwal Devurkar",
    qualification: "",
    designation: "Medical Director, Head of Operations",
    experience: "",
    expertise: ["Operations & Management in Mental Health"],
    image: "https://mibocare.in/wp-content/uploads/2023/09/Member_9.png",
    location: "Bengaluru",
    language: [],
    price: "₹1000–2000",
  },
  /* {
    id: 8,
    name: "Rachi Jain",
    qualification: "M.Sc (Psychology)",
    designation: "Counselling Psychologist",
    experience: "",
    expertise: [],
    image: "",
    location: "Bengaluru",
    language: [],
    price: "",
  }, */
 
  {
    id: 14,
    name: "Jerry P Mathew",
    qualification: "M.Sc, M.Phil (Clinical Psychology)",
    designation: "Clinical Psychologist",
    experience: "4 years",
    expertise: ["Clinical Psychologist"],
    image: "https://mibocare.in/wp-content/uploads/2024/03/Dr.-Jerry-picture-01.png",
    location: "Bengaluru",
    language: [],
    price: "₹1000–2000/hr",
  },

  {
    id: 15,
    name: "Yashaswini R S",
    qualification: "M.Phil Clinical Psychology",
    designation: "Clinical Psychologist",
    experience: "2 years",
    expertise: ["Clinical Psychologist"],
    image: "https://mibocare.in/wp-content/uploads/2025/03/Yashaswini-01-1536x1240.png",
    location: "Bengaluru",
    language: ["Kannada", "English", "Hindi"], // from profile context
    price: "₹1000",
  },
   {
    id: 16,
    name: "Ajay Siby",
    qualification: "M.Sc Clinical Psychology",
    designation: "Counselling Psychologist",
    experience: "",
    expertise: ["Counselling", "Psychologist"],
    image: "https://mibocare.in/wp-content/uploads/2024/04/Ajay-w-01-01.png",
    location: "Bengaluru",
    language: [],
    price: "₹1000",
  },
  
];