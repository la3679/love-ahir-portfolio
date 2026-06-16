/**
 * Single source of truth for all portfolio content.
 * Pure data + pure helpers — intentionally free of React so the logic
 * can be unit-tested in isolation.
 */

export type ProjectCategory =
  | "Web App"
  | "Mobile App"
  | "Machine Learning"
  | "Data Analysis"
  | "Publication";

export interface Profile {
  name: string;
  shortName: string;
  roles: string[];
  headline: string;
  summary: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Education {
  institution: string;
  degree: string;
  gpa: string;
  period: string;
  location: string;
  highlight: string;
  documentLink: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  achievements: string[];
  tags: string[];
  link: string;
}

export interface Project {
  title: string;
  category: ProjectCategory;
  blurb: string;
  stack: string[];
  link: string;
  featured?: boolean;
}

export interface SkillGroup {
  title: string;
  accent: "violet" | "cyan" | "magenta" | "emerald";
  skills: string[];
}

export interface Expertise {
  title: string;
  description: string;
  accent: "violet" | "cyan" | "magenta" | "emerald";
}

export interface Certification {
  title: string;
  provider: string;
  date: string;
  link: string;
}

export const profile: Profile = {
  name: "Love Jayesh Ahir",
  shortName: "Love Ahir",
  roles: [
    "Software Engineer",
    "Privacy Researcher",
    "Full-Stack Developer",
    "AI / ML Engineer",
    "Data Analyst",
  ],
  headline: "I build software where craft, data, and privacy meet.",
  summary:
    "Master's-trained software engineer and published privacy researcher. I design full-stack products, ship AI-driven features, and dig into the data most people never read — like the 86 million Android log entries behind my EASE 2026 paper.",
  location: "Rochester, NY",
  email: "lahir1269@gmail.com",
  github: "https://github.com/la3679",
  linkedin: "https://www.linkedin.com/in/love-jayesh-ahir-188356290/",
  resumeUrl:
    "https://drive.google.com/uc?export=download&id=1gq8PAz8M2m6MWuEKePDAYdVyaoAR-JUV",
};

export const stats: Stat[] = [
  { value: "3.94", label: "Graduate GPA at RIT" },
  { value: "EASE '26", label: "Peer-reviewed publication" },
  { value: "86M+", label: "Log entries analyzed" },
  { value: "20+", label: "Shipped projects" },
];

export const education: Education[] = [
  {
    institution: "Rochester Institute of Technology",
    degree: "M.S. in Computer Software Engineering",
    gpa: "3.94 / 4.0",
    period: "Aug 2023 — Dec 2025",
    location: "Rochester, NY",
    highlight:
      "Graduate research in software quality and privacy. Coursework spanning software architecture, cloud systems, model-driven development, and data science.",
    documentLink:
      "https://www.parchment.com/u/award/b3ea5556e3cd2c64abb71e9d3c8c6b6c",
  },
  {
    institution: "LJ Institute of Engineering and Technology",
    degree: "B.E. in Electronics & Communication",
    gpa: "3.81 / 4.0",
    period: "Aug 2019 — May 2023",
    location: "Ahmedabad, India",
    highlight:
      "Foundations in systems, networks, and programming — where the engineering habit of building things that actually work first took hold.",
    documentLink:
      "https://drive.google.com/file/d/1ZyMmLlJTjPd_heem7WerJjiDMulvqedz/view?usp=sharing",
  },
];

export const experiences: Experience[] = [
  {
    role: "Teaching Assistant — Software Quality Assurance",
    company: "Rochester Institute of Technology",
    location: "Rochester, NY",
    period: "Aug 2025 — Dec 2025",
    current: true,
    summary:
      "Supported graduate instruction for SWEN 777 under Dr. Xueling Zhang, mentoring students through testing methodology and research-paper seminars.",
    achievements: [
      "Mentored graduate students through software testing methodology, raising assignment quality and class satisfaction.",
      "Led seminars dissecting 25+ research papers, sharpening critical reading and discussion across the cohort.",
      "Ran weekly office hours across Slack, email, and Zoom to unblock students on assignments and research.",
    ],
    tags: ["Testing", "Mentorship", "Research"],
    link: "https://www.rit.edu/",
  },
  {
    role: "Graduate Research Assistant — Privacy & Security",
    company: "Rochester Institute of Technology",
    location: "Rochester, NY",
    period: "Aug 2024 — Dec 2025",
    current: true,
    summary:
      "Co-authored an EASE 2026 paper measuring the gap between what Android apps promise in their privacy policies and what they actually log.",
    achievements: [
      "Published in the EASE 2026 Research Track, analyzing 86M+ real log entries against stated privacy policies.",
      "Built Python tooling for automated app exploration and behavioral analysis using ADB, Monkey, and logcat.",
      "Surfaced that 67.6% of studied apps leaked sensitive data never disclosed in their policies.",
    ],
    tags: ["Python", "Android", "Empirical Research", "ADB"],
    link: "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-",
  },
  {
    role: "Software Engineer Intern",
    company: "Axisray Pvt Ltd",
    location: "Ahmedabad, India",
    period: "Jan 2023 — May 2023",
    summary:
      "Hardened Java microservices and shipped ML-backed features that improved reliability and accelerated delivery.",
    achievements: [
      "Refactored Spring Boot microservices, improving reliability and cutting feature delivery time by 20%.",
      "Built and integrated ML models in Python and Java, lifting recommendation accuracy by 30%.",
      "Modernized legacy JSP applications into Spring Boot for richer data visualization.",
    ],
    tags: ["Java", "Spring Boot", "Python", "ML"],
    link: "https://drive.google.com/file/d/1y6q0oPhLX4bjA9EYl9T6jEtiki8fRQOw/view?usp=sharing",
  },
  {
    role: "Data Science & AI/ML Engineering Intern",
    company: "Moon Technolabs Pvt Ltd",
    location: "Ahmedabad, India",
    period: "May 2022 — Oct 2022",
    summary:
      "Led a SaaS supply-chain resiliency initiative, building data pipelines and AI-driven optimization across HRMS and CRM systems.",
    achievements: [
      "Drove a supply-chain resiliency project that raised operational efficiency by 30%.",
      "Designed scalable data pipelines and AI solutions powering adaptive operations.",
      "Tuned ML models for resource allocation, reducing operational cost by 15%.",
    ],
    tags: ["Data Science", "AI/ML", "Pipelines"],
    link: "https://drive.google.com/file/d/1NSkvGMOANb5-mr1zKGDQZNfSDczWdcZj/view?usp=sharing",
  },
];

export const projects: Project[] = [
  {
    title: "Privacy Policies vs. the Logs",
    category: "Publication",
    blurb:
      "EASE 2026 empirical study of 1,000 Android apps and 86M+ log entries, exposing that only 0.4% of apps truly align their privacy policies with what they actually log.",
    stack: ["Python", "ADB", "Monkey", "Empirical SE"],
    link: "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-",
    featured: true,
  },
  {
    title: "AR Gesture Lab",
    category: "Mobile App",
    blurb:
      "An augmented-reality test harness that bridges 3D world coordinates to 2D screen pixels, enabling Appium to automate tap, drag, and pinch gestures on live AR objects at 60fps.",
    stack: ["React", "Three.js", "R3F", "Appium", "Python"],
    link: "https://github.com/la3679/ARLabs",
    featured: true,
  },
  {
    title: "VidKing — AI Streaming Platform",
    category: "Web App",
    blurb:
      "A cinematic, full-stack streaming experience with Gemini-powered recommendations, real-time search across TMDB, and cross-device watchlists synced through Firestore.",
    stack: ["React 19", "TypeScript", "Firebase", "Gemini"],
    link: "https://github.com/la3679/VidKing-AI-Streaming",
    featured: true,
  },
  {
    title: "AURA-GRID — 3D Strategy Engine",
    category: "Machine Learning",
    blurb:
      "A competitive 3D strategy game on a custom deterministic engine, with frame-perfect replays, GLSL-driven visuals, and an RL opponent that adapts to how you play.",
    stack: ["React", "Three.js", "GLSL", "Gemini AI"],
    link: "https://github.com/la3679/AURA-GRID",
    featured: true,
  },
  {
    title: "ResuMatch AI — Recruitment Suite",
    category: "Web App",
    blurb:
      "Automates resume screening with an LLM-embedding matcher that scores candidates against job descriptions far beyond keyword overlap, then explains the gaps.",
    stack: ["FastAPI", "React", "PostgreSQL", "Gemini"],
    link: "https://github.com/la3679/ResuMatch-AI",
    featured: true,
  },
  {
    title: "Pokédex MongoDB Platform",
    category: "Web App",
    blurb:
      "A full-stack Pokédex with a turn-based battle game and a real-world sightings map, backed by 296k+ geospatial records using MongoDB 2dsphere indexing and GridFS.",
    stack: ["Flask", "React", "MongoDB", "Maps API"],
    link: "https://github.com/la3679/Pok-dex",
    featured: true,
  },
  {
    title: "Aequitas Intelligence",
    category: "Data Analysis",
    blurb:
      "A financial analysis dashboard with a 'neural scanner' for real-time news sentiment, interactive D3 stock charts, and Gemini-generated executive market summaries.",
    stack: ["Next.js", "Python", "Firebase", "D3.js"],
    link: "https://github.com/la3679/Aequitas-Intelligence",
  },
  {
    title: "NutriAI — Vision Nutrition Tracker",
    category: "Web App",
    blurb:
      "Point your camera at a meal and get an instant nutritional breakdown via Gemini Vision, plus an AI coach that reasons over your long-term dietary trends.",
    stack: ["React", "Firebase", "Gemini Vision"],
    link: "https://github.com/la3679/NutriAI---Intelligent-Nutrition-Tracker",
  },
  {
    title: "FinAI Core — Lending Simulator",
    category: "Data Analysis",
    blurb:
      "A credit-risk analyzer with 'what-if' loan simulators and Gemini explanations of the 'why' behind every risk score and approval decision.",
    stack: ["TypeScript", "Firebase", "Gemini", "Recharts"],
    link: "https://github.com/la3679/FinAI-Core",
  },
  {
    title: "Price Compare Plus",
    category: "Mobile App",
    blurb:
      "A cross-platform app that aggregates and compares live prices across Amazon, Walmart, and eBay, backed by tested Flask REST APIs and PostgreSQL.",
    stack: ["React Native", "Flask", "PostgreSQL"],
    link: "https://github.com/la3679/Price-Compare-Plus",
  },
  {
    title: "Car Sales Network Graph",
    category: "Data Analysis",
    blurb:
      "Visualizes 1M+ car-sales records as an interactive graph of buyers, cars, and countries using Neo4j and custom D3.js Cypher-query exploration.",
    stack: ["Neo4j", "D3.js", "Python"],
    link: "https://github.com/la3679/Car-Sales-Network-Visualization",
  },
  {
    title: "Sentiment Analysis Engine",
    category: "Machine Learning",
    blurb:
      "Real-time sentiment evaluation of Amazon product reviews powered by AWS Comprehend, surfaced through an interactive Flask dashboard.",
    stack: ["AWS Comprehend", "Flask", "JavaScript"],
    link: "https://github.com/la3679/AmazonProduct-Review-Sentiment-Analysis",
  },
  {
    title: "Power BI Dashboard Collection",
    category: "Data Analysis",
    blurb:
      "A portfolio of executive dashboards across retail, streaming, and finance — from profit snapshots and KPI drill-downs to geo-sales heatmaps.",
    stack: ["Power BI", "DAX", "Business Intelligence"],
    link: "https://github.com/la3679/PowerBI",
  },
  {
    title: "NutriKit — Diet Manager",
    category: "Web App",
    blurb:
      "Personalized meal planning and nutritional analysis that cut planning time by 75% with a responsive React interface over a Flask API.",
    stack: ["React", "Flask", "PostgreSQL"],
    link: "https://github.com/la3679/Nutrikit",
  },
  {
    title: "ECtHR Vote Prediction",
    category: "Publication",
    blurb:
      "An ML pipeline predicting pro-government votes in the European Court of Human Rights, where ensemble XGBoost reached 95.9% validation accuracy on legal text embeddings.",
    stack: ["XGBoost", "SVM", "NLP", "Python"],
    link: "https://drive.google.com/file/d/1GwFkSXXzZVmZUP4OLoB1I1YckQn8rmcv/view?usp=sharing",
  },
  {
    title: "CodeGuard — Automated Review",
    category: "Publication",
    blurb:
      "A research approach to autonomous code review, using ML to enforce quality and security standards while removing the subjectivity of human-only reviews.",
    stack: ["Machine Learning", "Static Analysis"],
    link: "https://drive.google.com/file/d/1QzUBYsAAjvPtdxV4EGMflthzZUCvTPKa/view?usp=sharing",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Core",
    accent: "violet",
    skills: [
      "Python",
      "Java",
      "TypeScript",
      "JavaScript",
      "C / C++",
      "SQL",
      "R",
      "Data Structures",
      "Algorithms",
      "OOP",
    ],
  },
  {
    title: "Frameworks & Web",
    accent: "cyan",
    skills: [
      "React",
      "React Native",
      "Next.js",
      "Node.js",
      "Flask",
      "FastAPI",
      "Spring Boot",
      "TailwindCSS",
      "D3.js",
      "REST & GraphQL",
    ],
  },
  {
    title: "Data & AI/ML",
    accent: "magenta",
    skills: [
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Gemini / LLMs",
      "AWS Comprehend",
      "Power BI",
      "Tableau",
      "EDA",
      "Time-Series",
    ],
  },
  {
    title: "Data Engineering",
    accent: "emerald",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Firebase",
      "Neo4j",
      "Redis",
      "DynamoDB",
      "GridFS",
      "Pipelines",
    ],
  },
  {
    title: "Cloud & DevOps",
    accent: "violet",
    skills: [
      "AWS (Lambda, S3)",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "CI/CD",
    ],
  },
  {
    title: "Craft & Tools",
    accent: "cyan",
    skills: [
      "Git",
      "Figma",
      "Agile / Scrum",
      "Testing & QA",
      "Appium",
      "Android Studio",
      "VS Code",
    ],
  },
];

export const expertise: Expertise[] = [
  {
    title: "Full-Stack Engineering",
    description:
      "End-to-end products — from React and React Native front-ends to Flask, FastAPI, and Spring Boot services backed by relational and NoSQL data.",
    accent: "violet",
  },
  {
    title: "Applied AI & LLMs",
    description:
      "Shipping real features on Gemini and classic ML — semantic matching, vision, recommendations, and natural-language insight generation.",
    accent: "cyan",
  },
  {
    title: "Privacy & Security Research",
    description:
      "Empirical, large-scale analysis of mobile app behavior and privacy disclosure, with published, peer-reviewed results.",
    accent: "magenta",
  },
  {
    title: "Data Engineering & Analytics",
    description:
      "Turning millions of messy records into pipelines, geospatial graphs, and executive dashboards that drive decisions.",
    accent: "emerald",
  },
  {
    title: "Software Quality & Testing",
    description:
      "Test strategy, automation, and QA — from unit and integration suites to automated UI testing with Appium.",
    accent: "violet",
  },
  {
    title: "Systems & Architecture",
    description:
      "Designing maintainable systems: microservices, clean API boundaries, and architecture that survives real-world change.",
    accent: "cyan",
  },
];

export const certifications: Certification[] = [
  {
    title: "Microsoft Azure Fundamentals (AZ-900) Prep",
    provider: "Microsoft · LinkedIn Learning",
    date: "Jun 2025",
    link: "https://www.linkedin.com/learning/certificates/53b8f4559dd722ff7fb5e3a6438894f33da0e7cb07636ca3936ff99f150ab5bc",
  },
  {
    title: "Career Essentials in Data Analysis",
    provider: "Microsoft · LinkedIn",
    date: "Jun 2025",
    link: "https://www.linkedin.com/learning/certificates/b7e85032290a4f063ef4905f75d28d23df2ef7d98a738df62e79268b6ce3eb14",
  },
  {
    title: "Learning Data Analytics: Foundations",
    provider: "LinkedIn Learning",
    date: "Jun 2025",
    link: "https://www.linkedin.com/learning/certificates/b3e66a7d7344afa613aea09e7dba21533b25eb62d2d6506917ca3e6f1f6ca3f3",
  },
  {
    title: "Python Essential Training",
    provider: "LinkedIn Learning",
    date: "May 2025",
    link: "https://www.linkedin.com/learning/certificates/4c32a950aef5b51ab3e526d3daa47af2bdb69bc99c58400c61d4fb4243674cce",
  },
  {
    title: "Data Analytics Part 2: Applying Core Knowledge",
    provider: "LinkedIn Learning",
    date: "Jun 2025",
    link: "https://www.linkedin.com/learning/certificates/83056fccabeba7e7f5127c74177147622ced93f8e9d1cdc5f202a62bb7b046f1",
  },
  {
    title: "C Programming",
    provider: "CDAC",
    date: "2022",
    link: "https://drive.google.com/file/d/1RT9VAduDF422qZg2ho9nak0OUSkk7BL4/view?usp=sharing",
  },
];

export const projectCategories: (ProjectCategory | "All")[] = [
  "All",
  "Web App",
  "Mobile App",
  "Machine Learning",
  "Data Analysis",
  "Publication",
];

/**
 * Pure helper: filter projects by category.
 * "All" (or an empty value) returns every project unchanged.
 */
export function filterProjects(
  list: Project[],
  category: ProjectCategory | "All",
): Project[] {
  if (category === "All") return list;
  return list.filter((project) => project.category === category);
}

/** Count of projects in each category, used for filter badges. */
export function countByCategory(
  list: Project[],
): Record<ProjectCategory | "All", number> {
  const counts = { All: list.length } as Record<ProjectCategory | "All", number>;
  for (const project of list) {
    counts[project.category] = (counts[project.category] ?? 0) + 1;
  }
  return counts;
}
