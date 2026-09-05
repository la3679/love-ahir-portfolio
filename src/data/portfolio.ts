/**
 * Single source of truth for all portfolio content.
 * Pure data + pure helpers — intentionally free of React so the logic
 * can be unit-tested in isolation.
 *
 * Experience prose (role, focus, summary, achievements) lives in the locale
 * dictionaries, not here: this file holds the structural facts (company,
 * dates, location, grouping, stack tags) and points at translation keys, so
 * the same canonical dataset renders correctly in all eight locales. The
 * `TranslationKey` import is type-only — no runtime dependency is added.
 */

import type { TranslationKey } from "@/lib/locales/en-US";

export type ProjectCategory =
  | "Web App"
  | "Mobile App"
  | "Machine Learning"
  | "Data Analysis"
  | "Publication"
  | "Game Development"
  | "Automation";

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

export interface Education {
  institution: string;
  degree: string;
  gpa: string;
  period: string;
  location: string;
  highlight: string;
  documentLink: string;
}

/**
 * Presentational grouping only. It never changes the real chronology —
 * every entry always renders its own dates and location.
 */
export type ExperienceGroup = "industry" | "research-teaching";

export interface Experience {
  /** Stable id; also the namespace of this role's translation keys. */
  id: string;
  group: ExperienceGroup;
  company: string;
  location: string;
  period: string;
  /** True only while the role is ongoing. */
  current?: boolean;
  /** Official job title. */
  roleKey: TranslationKey;
  /** Optional descriptive focus, kept separate from the official title. */
  focusKey?: TranslationKey;
  summaryKey: TranslationKey;
  /** Strongest outcome first — the home page shows the leading one. */
  achievementKeys: TranslationKey[];
  tags: string[];
  /** Public artifact for the role, when one exists. Never invented. */
  link?: string;
}

export interface Project {
  title: string;
  category: ProjectCategory;
  blurb: string;
  stack: string[];
  link: string;
  featured?: boolean;
  /** Slug of the internal case study, when one exists (→ /work/<slug>). */
  slug?: string;
  /** One-line headline outcome, shown on index rows. Metrics only — no adjectives. */
  outcome?: string;
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

// Credentials moved to src/data/credentials.ts at Gate 3: the old
// `Certification` shape could not express award type, date precision,
// instructor attribution, or the "not a Microsoft certification" disclaimer
// the AZ-900 entry requires. See IMPLEMENTATION.md §25.5.

export const profile: Profile = {
  name: "Love Jayesh Ahir",
  shortName: "Love Ahir",
  roles: [
    "Software Engineer",
    "Full-Stack Engineer",
    "Backend Engineer",
    "AI Engineer",
    "Published Software Engineering Researcher",
  ],
  headline: "I build reliable full-stack products and applied AI systems.",
  summary:
    "Software engineer with 4+ years of experience building production backend, full-stack, and applied AI systems across financial services and enterprise platforms. I work across event-driven Python and Java services, React and TypeScript interfaces, relational data systems, cloud delivery, automated quality gates, and AI-powered retrieval workflows — with an emphasis on reliability, speed, and measurable operational impact. My RIT research adds experience in large-scale automation, data processing, and rigorous validation.",
  location: "Phoenix, AZ",
  email: "lahir1269@gmail.com",
  github: "https://github.com/la3679",
  linkedin: "https://www.linkedin.com/in/love-jayesh-ahir-188356290/",
  resumeUrl: "/resume.pdf",
};

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

/**
 * Every role Love has held, newest-ending first inside each group.
 * One canonical dataset — the home summary and the /about timeline both
 * read from here, so the two can never drift apart.
 */
export const experiences: Experience[] = [
  {
    id: "morgan-stanley",
    group: "industry",
    company: "Morgan Stanley",
    location: "Phoenix, AZ",
    period: "Aug 2025 — Present",
    current: true,
    roleKey: "exp.morgan-stanley.role",
    focusKey: "exp.morgan-stanley.focus",
    summaryKey: "exp.morgan-stanley.summary",
    achievementKeys: [
      "exp.morgan-stanley.a1",
      "exp.morgan-stanley.a2",
      "exp.morgan-stanley.a3",
      "exp.morgan-stanley.a4",
      "exp.morgan-stanley.a5",
      "exp.morgan-stanley.a6",
    ],
    tags: [
      "Python",
      "FastAPI",
      "React 18",
      "TypeScript",
      "AWS ECS/Fargate",
      "LangGraph",
      "RAG",
      "CI/CD",
    ],
  },
  {
    id: "sage-software-engineer-2",
    group: "industry",
    company: "Sage Softtech",
    location: "Ahmedabad, India",
    period: "Oct 2021 — Jul 2023",
    roleKey: "exp.sage-software-engineer-2.role",
    summaryKey: "exp.sage-software-engineer-2.summary",
    achievementKeys: [
      "exp.sage-software-engineer-2.a1",
      "exp.sage-software-engineer-2.a2",
      "exp.sage-software-engineer-2.a3",
      "exp.sage-software-engineer-2.a4",
      "exp.sage-software-engineer-2.a5",
    ],
    tags: [
      "Java",
      "Spring Boot",
      "Kafka",
      "PostgreSQL",
      "React 17",
      "GCP",
      "Grafana",
    ],
  },
  {
    id: "axisray",
    group: "industry",
    company: "Axisray Pvt Ltd",
    location: "Ahmedabad, India",
    period: "Jan 2023 — May 2023",
    roleKey: "exp.axisray.role",
    summaryKey: "exp.axisray.summary",
    achievementKeys: ["exp.axisray.a1", "exp.axisray.a2", "exp.axisray.a3"],
    tags: ["Java", "Spring Boot", "Python", "ML"],
    link: "https://drive.google.com/file/d/1y6q0oPhLX4bjA9EYl9T6jEtiki8fRQOw/view?usp=sharing",
  },
  {
    id: "moon-technolabs",
    group: "industry",
    company: "Moon Technolabs Pvt Ltd",
    location: "Ahmedabad, India",
    period: "May 2022 — Oct 2022",
    roleKey: "exp.moon-technolabs.role",
    summaryKey: "exp.moon-technolabs.summary",
    achievementKeys: [
      "exp.moon-technolabs.a1",
      "exp.moon-technolabs.a2",
      "exp.moon-technolabs.a3",
    ],
    tags: ["Data Science", "AI/ML", "Pipelines"],
    link: "https://drive.google.com/file/d/1NSkvGMOANb5-mr1zKGDQZNfSDczWdcZj/view?usp=sharing",
  },
  {
    id: "sage-associate-developer",
    group: "industry",
    company: "Sage Softtech",
    location: "Ahmedabad, India",
    period: "Feb 2021 — Sep 2021",
    roleKey: "exp.sage-associate-developer.role",
    summaryKey: "exp.sage-associate-developer.summary",
    achievementKeys: [
      "exp.sage-associate-developer.a1",
      "exp.sage-associate-developer.a2",
      "exp.sage-associate-developer.a3",
    ],
    tags: ["Java", "Spring Boot", "React", "MySQL", "PostgreSQL", "ELK"],
  },
  {
    id: "rit-research-assistant",
    group: "research-teaching",
    company: "Rochester Institute of Technology",
    location: "Rochester, NY",
    period: "Aug 2024 — Dec 2025",
    roleKey: "exp.rit-research-assistant.role",
    summaryKey: "exp.rit-research-assistant.summary",
    achievementKeys: [
      "exp.rit-research-assistant.a1",
      "exp.rit-research-assistant.a2",
      "exp.rit-research-assistant.a3",
    ],
    tags: ["Python", "Android", "Empirical Research", "ADB"],
    link: "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-",
  },
  {
    id: "rit-teaching-assistant",
    group: "research-teaching",
    company: "Rochester Institute of Technology",
    location: "Rochester, NY",
    period: "Aug 2025 — Dec 2025",
    roleKey: "exp.rit-teaching-assistant.role",
    summaryKey: "exp.rit-teaching-assistant.summary",
    achievementKeys: [
      "exp.rit-teaching-assistant.a1",
      "exp.rit-teaching-assistant.a2",
      "exp.rit-teaching-assistant.a3",
    ],
    tags: ["Testing", "Mentorship", "Research"],
    link: "https://www.rit.edu/",
  },
];

/** Group order used by both the home summary and the /about timeline. */
export const experienceGroups: ExperienceGroup[] = [
  "industry",
  "research-teaching",
];

/** Pure helper: the roles in one group, preserving the canonical order. */
export function experiencesInGroup(
  list: Experience[],
  group: ExperienceGroup,
): Experience[] {
  return list.filter((experience) => experience.group === group);
}

export const projects: Project[] = [
  {
    title: "TradeOps Copilot",
    category: "Web App",
    blurb: "An investigation console for synthetic trade exceptions, combining evidence retrieval, a 13-node LangGraph workflow, human review, and an append-only audit trail.",
    stack: ["React", "TypeScript", "FastAPI", "LangGraph", "FAISS", "PostgreSQL"],
    link: "https://github.com/la3679/tradeops-insight",
    featured: true,
    slug: "tradeops-copilot",
    outcome: "13-node workflow with mandatory human review",
  },
  {
    title: "SentinelFlow",
    category: "Web App",
    blurb: "A transaction-risk operations platform on synthetic data, with a transactional outbox, idempotent Kafka consumers, explainable scoring, and an analyst investigation console.",
    stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "FastAPI", "React"],
    link: "https://github.com/la3679/sentinelflow",
    featured: true,
    slug: "sentinelflow",
    outcome: "At-least-once delivery with idempotent consumers",
  },
  {
    title: "NaviSight",
    category: "Web App",
    blurb: "Explore 5.9M historical AIS vessel observations through a geospatial map, replay, analytics, a 3D inspector, and an optional copilot with a visible evidence trail.",
    stack: ["Next.js", "TypeScript", "FastAPI", "MongoDB", "MapLibre", "Three.js"],
    link: "https://github.com/la3679/navisight",
    featured: true,
    slug: "navisight",
    outcome: "5,928,519 historical observations from 16,294 vessels",
  },
  {
    title: "WebOps Commander",
    category: "Web App",
    blurb: "A browser-native incident simulation that exposes typed WebMCP tools, requires visible human approval for rollback, and records the recovery in a shared audit timeline.",
    stack: ["Next.js", "React", "TypeScript", "WebMCP", "Zustand", "Zod"],
    link: "https://github.com/la3679/webops-commander",
    featured: true,
    slug: "webops-commander",
    outcome: "Human-approved recovery in a deterministic simulation",
  },
  {
    title: "Integration Operations Hub",
    category: "Web App",
    blurb: "An Angular operations dashboard coordinating employee-record synchronization through Express, FastAPI, and ASP.NET Core, with retries, circuit breaking, and partial-success reporting.",
    stack: ["Angular", "RxJS", "Node.js", "FastAPI", "C# / .NET", "PostgreSQL"],
    link: "https://github.com/la3679/integration-operations-hub",
    outcome: "Traceable synchronization across three backend runtimes",
  },
  {
    title: "Yu-Gi-Oh Duel Arena — Rules Engine",
    category: "Game Development",
    blurb: "An in-progress, headless Godot rules engine with deterministic action validation, chain resolution, reusable card mechanics, and regression tests. Card coverage is still growing; a playable UI is future work.",
    stack: ["Godot", "GDScript", "Python", "Automated Testing"],
    link: "https://github.com/la3679/yu-gi-oh-duel-arena-godot",
    outcome: "Deterministic rules and card interactions; in development",
  },
  {
    title: "College Recommendation",
    category: "Web App",
    blurb: "A Java student-record and college-recommendation application with college and dataset management, location filters, and a workflow for submitting and reviewing recommendation results.",
    stack: ["Java", "Spring Boot", "Spring Security", "Hibernate", "MySQL", "JSP"],
    link: "https://github.com/la3679/College-Recommendation",
  },
  {
    title: "Automated Weather Reports",
    category: "Automation",
    blurb: "A Python script that fetches current weather from OpenWeatherMap for selected cities and turns temperature and humidity readings into shareable PNG and PDF reports.",
    stack: ["Python", "Requests", "Pillow", "OpenWeatherMap"],
    link: "https://github.com/la3679/Automate-Weather-Forecast",
    outcome: "Weather API data transformed into PNG and PDF reports",
  },
  {
    title: "Data Analytics Projects",
    category: "Data Analysis",
    blurb: "A collection of SQL analyses, Python notebooks, and Power BI reports exploring Amazon sales and Danny’s Diner, with source data and exported findings.",
    stack: ["SQL", "Python", "Jupyter", "Power BI"],
    link: "https://github.com/la3679/Data-Analytics-Projects",
  },
  {
    title: "Credora AI — Credit Risk Simulator",
    category: "Web App",
    blurb: "An educational credit-risk simulator with deterministic scoring, borrower scenarios, AI explanations, and queued PDF reports. A separate Next.js, Express, MongoDB, and BullMQ application from FinAI-Core.",
    stack: ["Next.js", "Express", "TypeScript", "MongoDB", "Redis", "BullMQ"],
    link: "https://github.com/la3679/AI-Credit-Risk-Analyzer-Loan-Approval-Simulator",
    outcome: "Deterministic scores with AI explanations kept separate",
  },
  {
    title: "Privacy Policies vs. the Logs",
    category: "Publication",
    blurb:
      "EASE 2026 empirical study of 1,000 Android apps and 86M+ log entries, exposing that only 0.4% of apps truly align their privacy policies with what they actually log.",
    stack: ["Python", "ADB", "Monkey", "Empirical SE"],
    link: "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-",
    featured: true,
    slug: "privacy-policies-vs-logs",
    outcome: "67.6% of apps leaked undisclosed data",
  },
  {
    title: "AR Gesture Lab",
    category: "Mobile App",
    blurb:
      "An augmented-reality test harness that bridges 3D world coordinates to 2D screen pixels, enabling Appium to automate tap, drag, and pinch gestures on live AR objects at 60fps.",
    stack: ["React", "Three.js", "R3F", "Appium", "Python"],
    link: "https://github.com/la3679/ARLabs",
    featured: true,
    slug: "ar-gesture-lab",
    outcome: "60fps automated gestures on live AR objects",
  },
  {
    title: "VidKing — AI Streaming Platform",
    category: "Web App",
    blurb:
      "A cinematic, full-stack streaming experience with Gemini-powered recommendations, real-time search across TMDB, and cross-device watchlists synced through Firestore.",
    stack: ["React 19", "TypeScript", "Firebase", "Gemini"],
    link: "https://github.com/la3679/VidKing-AI-Streaming",
    featured: true,
    slug: "vidking-ai-streaming",
    outcome: "Real-time TMDB search with Gemini recommendations",
  },
  {
    title: "AURA-GRID — 3D Strategy Engine",
    category: "Machine Learning",
    blurb:
      "A competitive 3D strategy game on a custom deterministic engine, with frame-perfect replays, GLSL-driven visuals, and an RL opponent that adapts to how you play.",
    stack: ["React", "Three.js", "GLSL", "Gemini AI"],
    link: "https://github.com/la3679/AURA-GRID",
    featured: true,
    slug: "aura-grid",
    outcome: "Frame-perfect replays on a deterministic engine",
  },
  {
    title: "ResuMatch AI — Recruitment Suite",
    category: "Web App",
    blurb:
      "Automates resume screening with an LLM-embedding matcher that scores candidates against job descriptions far beyond keyword overlap, then explains the gaps.",
    stack: ["FastAPI", "React", "PostgreSQL", "Gemini"],
    link: "https://github.com/la3679/ResuMatch-AI",
    featured: true,
    slug: "resumatch-ai",
    outcome: "Semantic matching beyond keyword overlap",
  },
  {
    title: "Pokédex MongoDB Platform",
    category: "Web App",
    blurb:
      "A full-stack Pokédex with a turn-based battle game and a real-world sightings map, backed by 296k+ geospatial records using MongoDB 2dsphere indexing and GridFS.",
    stack: ["Flask", "React", "MongoDB", "Maps API"],
    link: "https://github.com/la3679/Pok-dex",
    featured: true,
    slug: "pokedex-mongodb",
    outcome: "296k+ geospatial records on 2dsphere indexes",
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
    outcome: "1M+ records as an interactive graph",
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
    outcome: "−75% meal-planning time",
  },
  {
    title: "ECtHR Vote Prediction",
    category: "Publication",
    blurb:
      "An ML pipeline predicting pro-government votes in the European Court of Human Rights, where ensemble XGBoost reached 95.9% validation accuracy on legal text embeddings.",
    stack: ["XGBoost", "SVM", "NLP", "Python"],
    link: "https://drive.google.com/file/d/1GwFkSXXzZVmZUP4OLoB1I1YckQn8rmcv/view?usp=sharing",
    outcome: "95.9% validation accuracy",
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
  {
    title: "Privacy & Security Research",
    description:
      "Empirical, large-scale analysis of mobile app behavior and privacy disclosure, with published, peer-reviewed results.",
    accent: "magenta",
  },
];

/**
 * The roles the homepage previews, newest first — explicit curation rather
 * than a slice, so reordering `experiences` never silently changes what a
 * recruiter reads first. Three engineering roles only; `/about#experience`
 * carries all seven with their real dates, locations, and titles.
 */
export const homeExperienceIds = [
  "morgan-stanley",
  "sage-software-engineer-2",
  "moon-technolabs",
] as const;

export const homeExperiences: Experience[] = homeExperienceIds.flatMap((id) =>
  experiences.filter((role) => role.id === id),
);

export const projectCategories: (ProjectCategory | "All")[] = [
  "All",
  "Web App",
  "Mobile App",
  "Machine Learning",
  "Data Analysis",
  "Publication",
  "Game Development",
  "Automation",
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
