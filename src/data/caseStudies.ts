import type { ProjectCategory } from "./portfolio";

/**
 * Case-study content model.
 *
 * Long-form body copy is intentionally English-only (rendered with
 * lang="en" when the UI locale differs); short chrome around it — section
 * labels, summaries — lives in the locale files. Body copy is derived from
 * the verified project blurbs and research achievements in portfolio.ts;
 * no metric appears here that is not already claimed there.
 */

export interface CaseMetric {
  value: string;
  label: string;
  direction?: "up" | "down";
}

export interface CaseMedia {
  src: string;
  alt: string;
  caption?: string;
}

export interface CaseLinks {
  repo?: string;
  live?: string;
  paper?: string;
}

export interface CaseStudy {
  slug: string;
  /** Title written as the claim the case study proves. */
  title: string;
  /** Product / paper name. */
  project: string;
  category: ProjectCategory;
  role: string;
  timeframe?: string;
  stack: string[];
  links: CaseLinks;
  /** Monospace metadata line shown under the title. */
  evidence: string;
  metrics: CaseMetric[];
  /** Locale key for the one-line summary (translated in all locales). */
  summaryKey: string;
  context: string[];
  problem: string[];
  approach: string[];
  shipped: string[];
  retro: string[];
  /** Screenshots / recordings. Rendered only when present. */
  media: CaseMedia[];
}

/**
 * Definitions stay in their original order so the sitemap generator's
 * textual slug scan is unaffected. Presentation order is applied below.
 */
const caseStudyDefinitions: CaseStudy[] = [
  {
    slug: "privacy-policies-vs-logs",
    title: "Do apps do what their privacy policies say? Across 86 million log entries: mostly no.",
    project: "Privacy Policies vs. the Logs",
    category: "Publication",
    role: "Co-author · Graduate Research Assistant",
    timeframe: "Aug 2024 — Dec 2025",
    stack: ["Python", "ADB", "Monkey", "logcat", "Empirical SE"],
    links: {
      paper:
        "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-",
    },
    evidence: "N=1,000 apps · 86M+ log entries · EASE 2026 Research Track",
    metrics: [
      { value: "67.6%", label: "of studied apps leaked sensitive data never disclosed in their policies" },
      { value: "0.4%", label: "of apps fully aligned their privacy policy with what they actually log" },
      { value: "86M+", label: "real log entries analyzed against stated policies" },
    ],
    summaryKey: "case.privacy-policies-vs-logs.summary",
    context: [
      "Privacy policies are the legal promise an app makes about your data. At RIT, working as a graduate research assistant in privacy and security under Dr. Xueling Zhang, I helped ask a deceptively simple question: does anyone check whether apps keep that promise at runtime?",
    ],
    problem: [
      "Manually auditing even one app against its policy takes hours of reading and instrumentation. At ecosystem scale — a thousand apps, tens of millions of log lines — no manual process survives. The gap between what apps say and what they do had never been measured at this scale.",
    ],
    approach: [
      "I built Python tooling that drives each app automatically: ADB and Monkey explore the UI, logcat captures everything the app emits, and an analysis pipeline matches logged data flows against the claims in each app's privacy policy.",
      "The pipeline processed over 86 million real log entries across 1,000 Android apps, classifying each sensitive disclosure and checking whether the policy ever mentioned it.",
    ],
    shipped: [
      "The study was published in the EASE 2026 Research Track. The headline findings: 67.6% of studied apps leaked sensitive data never disclosed in their policies, and only 0.4% fully aligned their stated policy with their actual logging behavior.",
    ],
    retro: [
      "The matching between policy language and log behavior is the hardest part — policy text is vague by design. Given another iteration, I would invest in deeper semantic matching of policy clauses and extend the corpus beyond the initial thousand apps.",
    ],
    media: [],
  },
  {
    slug: "ar-gesture-lab",
    title: "Making augmented reality testable: a bridge from 3D worlds to 2D automation.",
    project: "AR Gesture Lab",
    category: "Mobile App",
    role: "Sole developer",
    stack: ["React", "Three.js", "R3F", "Appium", "Python"],
    links: { repo: "https://github.com/la3679/ARLabs" },
    evidence: "3D→2D coordinate bridge · 60fps · Appium-driven gestures",
    metrics: [
      { value: "60fps", label: "live automated gestures on AR objects" },
      { value: "3D→2D", label: "world-coordinate to screen-pixel projection layer" },
    ],
    summaryKey: "case.ar-gesture-lab.summary",
    context: [
      "UI test automation assumes a flat screen: you find an element, you get a rectangle, you tap it. Augmented reality breaks that assumption — the things you need to tap live in a 3D world and move with the camera.",
    ],
    problem: [
      "Appium and similar drivers can only inject touches at screen pixels. AR objects don't have screen pixels — they have world coordinates that change every frame. Without a bridge between the two, AR interfaces simply can't be regression-tested.",
    ],
    approach: [
      "AR Gesture Lab is a test harness that projects 3D world coordinates into 2D screen space in real time, exposing each AR object's current screen position to the automation layer.",
      "A React + Three.js (R3F) scene renders the AR objects; a Python-driven Appium client consumes the projected coordinates to fire taps, drags, and pinches at the right pixels at the right moment.",
    ],
    shipped: [
      "The harness automates tap, drag, and pinch gestures against live AR objects at 60fps — turning previously untestable AR interactions into scriptable, repeatable test cases.",
    ],
    retro: [
      "The current harness owns its own scene. The natural next step is pointing the same projection bridge at third-party AR apps, where object positions must be inferred rather than known.",
    ],
    media: [],
  },
  {
    slug: "vidking-ai-streaming",
    title: "A streaming experience where the recommendations actually know you.",
    project: "VidKing — AI Streaming Platform",
    category: "Web App",
    role: "Sole developer",
    stack: ["React 19", "TypeScript", "Firebase", "Gemini", "TMDB"],
    links: { repo: "https://github.com/la3679/VidKing-AI-Streaming" },
    evidence: "React 19 · Gemini recommendations · TMDB live search · Firestore sync",
    metrics: [
      { value: "Real-time", label: "search across the TMDB catalog" },
      { value: "Cross-device", label: "watchlists synced through Firestore" },
    ],
    summaryKey: "case.vidking-ai-streaming.summary",
    context: [
      "Streaming UIs are a solved-looking problem with an unsolved core: discovery. I built VidKing to explore what a streaming front-end feels like when a language model, not a static algorithm, drives the recommendations.",
    ],
    problem: [
      "Classic recommendation rows are opaque and slow to adapt. The challenge was to make suggestions feel personal and explainable while keeping the interface as fast as the big platforms users compare everything against.",
    ],
    approach: [
      "VidKing is a full-stack React 19 + TypeScript app: real-time search across TMDB, Gemini-powered recommendations that reason over your taste, and watchlists that follow you across devices through Firestore.",
      "The UI is deliberately cinematic — large artwork, smooth transitions — because the bar for a streaming interface is set by the products people already use daily.",
    ],
    shipped: [
      "A working streaming platform: live TMDB search, AI recommendations, and cross-device watchlist sync, shipped end-to-end as a solo project.",
    ],
    retro: [
      "Recommendation quality depends heavily on how much taste signal the app has collected; the next iteration would make that cold-start phase smarter and cheaper.",
    ],
    media: [],
  },
  {
    slug: "aura-grid",
    title: "A competitive 3D strategy engine with an opponent that adapts to how you play.",
    project: "AURA-GRID — 3D Strategy Engine",
    category: "Machine Learning",
    role: "Sole developer",
    stack: ["React", "Three.js", "GLSL", "Gemini AI"],
    links: { repo: "https://github.com/la3679/AURA-GRID" },
    evidence: "Custom deterministic engine · frame-perfect replays · GLSL · RL opponent",
    metrics: [
      { value: "Frame-perfect", label: "replays from a fully deterministic simulation" },
      { value: "Adaptive", label: "reinforcement-learning opponent that learns your style" },
    ],
    summaryKey: "case.aura-grid.summary",
    context: [
      "Most browser games hide their non-determinism behind visual noise. I wanted the opposite: a strategy engine rigorous enough that any match can be replayed frame-perfectly from its inputs alone.",
    ],
    problem: [
      "Determinism, visual quality, and a competent opponent pull in different directions. Floating-point drift breaks replays; heavy shaders break frame budgets; and a scripted AI gets boring the moment you find its pattern.",
    ],
    approach: [
      "AURA-GRID runs on a custom deterministic simulation core, so a match is just its input log — replays are exact by construction.",
      "Visuals are GLSL-driven on top of Three.js, and the opponent uses reinforcement-learning techniques to adapt to the player's strategy rather than following a fixed script.",
    ],
    shipped: [
      "A playable competitive 3D strategy game with exact replays and an opponent that changes as you do — engine, visuals, and AI shipped as one solo project.",
    ],
    retro: [
      "The deterministic core makes networked multiplayer (lockstep) the obvious next milestone; the engine was designed for it, but the netcode is still future work.",
    ],
    media: [],
  },
  {
    slug: "resumatch-ai",
    title: "Resume screening that reads for meaning, not keywords — and explains the gaps.",
    project: "ResuMatch AI — Recruitment Suite",
    category: "Web App",
    role: "Sole developer",
    stack: ["FastAPI", "React", "PostgreSQL", "Gemini"],
    links: { repo: "https://github.com/la3679/ResuMatch-AI" },
    evidence: "LLM-embedding matcher · gap explanations · FastAPI + PostgreSQL",
    metrics: [
      { value: "Semantic", label: "candidate–job matching via LLM embeddings, beyond keyword overlap" },
      { value: "Explained", label: "every score comes with the gaps that produced it" },
    ],
    summaryKey: "case.resumatch-ai.summary",
    context: [
      "Keyword-based resume screening fails in both directions: strong candidates phrased differently get filtered out, and keyword-stuffed resumes sail through. Having been on the candidate side of that pipeline, I built the tool I wished recruiters used.",
    ],
    problem: [
      "The hard part isn't ranking resumes — it's ranking them for reasons a human can verify. A score without an explanation just moves the black box.",
    ],
    approach: [
      "ResuMatch embeds both resumes and job descriptions with an LLM and scores candidates on semantic similarity, so 'built distributed data pipelines' matches 'ETL at scale' even with zero shared keywords.",
      "For every score, Gemini generates a plain-language explanation of where the candidate is strong and what's missing — the gaps, not just the grade. FastAPI serves the pipeline; PostgreSQL stores candidates, jobs, and scores; React fronts it for recruiters.",
    ],
    shipped: [
      "An end-to-end recruitment suite: upload resumes, define a role, and get ranked candidates with explanations a recruiter can defend to a hiring manager.",
    ],
    retro: [
      "Embedding-based scoring inherits the biases of its models; a production deployment would need bias evaluation and calibration against real hiring outcomes before being trusted with decisions.",
    ],
    media: [],
  },
  {
    slug: "pokedex-mongodb",
    title: "296,000 geospatial records, one playful proof of full-stack range.",
    project: "Pokédex MongoDB Platform",
    category: "Web App",
    role: "Sole developer",
    stack: ["Flask", "React", "MongoDB", "GridFS", "Maps API"],
    links: { repo: "https://github.com/la3679/Pok-dex" },
    evidence: "296k+ geospatial records · MongoDB 2dsphere · GridFS media",
    metrics: [
      { value: "296k+", label: "geospatial sighting records served through 2dsphere indexes" },
      { value: "Full-stack", label: "REST API, battle game, and map UI shipped together" },
    ],
    summaryKey: "case.pokedex-mongodb.summary",
    context: [
      "A Pokédex is a deliberately fun wrapper around genuinely hard data problems: media storage, geospatial queries at scale, and game logic — the same shapes that show up in serious logistics or mapping products.",
    ],
    problem: [
      "Serving map queries over hundreds of thousands of location records is where naive database schemas fall over. The project's real goal was to make those queries fast and the architecture clean, then keep the product playful.",
    ],
    approach: [
      "The platform stores 296k+ real-world sighting records in MongoDB behind 2dsphere geospatial indexes, so 'what's been seen near me' stays a fast, indexed query. GridFS handles media assets.",
      "A Flask REST API feeds a React front-end with three faces: an encyclopedia, a turn-based battle game, and an interactive sightings map.",
    ],
    shipped: [
      "A complete full-stack platform — data model, indexed geospatial API, media pipeline, game logic, and map UI — demonstrating the whole stack in one artifact.",
    ],
    retro: [
      "The battle engine and the data platform grew in one codebase; splitting them into services would let each evolve at its own pace.",
    ],
    media: [],
  },
];

/**
 * Display order across the site: engineering and applied-AI systems lead,
 * the publication closes. Drives the home feature grid, the /work listing,
 * and prev/next navigation, so all three stay coherent.
 */
const displayOrder = [
  "resumatch-ai",
  "vidking-ai-streaming",
  "pokedex-mongodb",
  "aura-grid",
  "ar-gesture-lab",
  "privacy-policies-vs-logs",
] as const;

export const caseStudies: CaseStudy[] = [
  ...displayOrder.flatMap((slug) =>
    caseStudyDefinitions.filter((study) => study.slug === slug),
  ),
  // Anything not named above still ships, after the curated order.
  ...caseStudyDefinitions.filter(
    (study) => !displayOrder.includes(study.slug as (typeof displayOrder)[number]),
  ),
];

/**
 * The four case studies the home page features. Explicit curation rather
 * than a slice, so reordering the list never silently changes the feature
 * set — and the publication is never the lead card.
 */
/**
 * Homepage featured order (IMPLEMENTATION.md §31.3).
 *
 * Pokédex leads: it is the lead visual and interactive project, and receives
 * the large systems-artifact treatment. ResuMatch remains a normal featured
 * card and keeps its full case study and project-index entry — its data is
 * unchanged. The publication is deliberately absent from the featured four and
 * still appears on /work.
 */
export const featuredSlugs = [
  "pokedex-mongodb",
  "resumatch-ai",
  "vidking-ai-streaming",
  "aura-grid",
] as const;

/** The featured case studies, in featuredSlugs order. */
export const featuredCaseStudies: CaseStudy[] = featuredSlugs.flatMap((slug) =>
  caseStudies.filter((study) => study.slug === slug),
);

/** Look up a case study by slug; undefined for unknown slugs (→ 404). */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Previous/next case studies in display order, wrapping at the ends. */
export function adjacentCaseStudies(slug: string): {
  prev: CaseStudy;
  next: CaseStudy;
} {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const n = caseStudies.length;
  const index = i === -1 ? 0 : i;
  return {
    prev: caseStudies[(index - 1 + n) % n],
    next: caseStudies[(index + 1) % n],
  };
}
