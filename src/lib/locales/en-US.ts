/**
 * Canonical translation dictionary (English — United States).
 *
 * Every other locale implements this exact key set, so the `Translation`
 * type derived from here keeps all locales structurally in sync at compile
 * time. Keys are flat + dotted (i18n is configured with keySeparator: false)
 * so the dots are literal, not nesting.
 *
 * Proper nouns (RIT, EASE 2026, React, GPA, AI/ML/LLM, tech names, and the
 * published paper's title) are left untranslated on purpose — they read the
 * same across locales. Long-form case-study body copy lives in
 * src/data/caseStudies.ts and is English-only by design (rendered with
 * lang="en"); each case's one-line summary IS translated here.
 */
const enUS = {
  brand: "Love Ahir",

  // Navigation
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.work": "Work",
  "nav.research": "Research",
  "nav.skills": "Skills",
  "nav.expertise": "Expertise",
  "nav.contact": "Contact",
  "nav.resume": "Resume",
  "nav.downloadResume": "Download Resume",
  "nav.skipToContent": "Skip to content",

  // Hero
  "hero.badge": "Software Engineer · Full-Stack · Backend · Applied AI",
  "hero.statement": "I build reliable full-stack products and applied AI systems.",
  "hero.roles":
    "Software engineer with 3+ years building backend services, full-stack applications, distributed data pipelines, and agentic AI workflows for data platform and enterprise SaaS products.",
  "hero.seeWork": "View work",
  "hero.resume": "Resume",
  "hero.transformScene": "Transform voxel scene",
  "hero.formation.identity": "Identity",
  "hero.formation.architecture": "Architecture",
  "hero.formation.throughput": "Throughput",
  "hero.monogramAlt": "Love Ahir monogram",
  "hero.sceneDisclaimer": "shape only — not live telemetry.",

  // Hero — ivory engineering stage (an architecture diagram, never a mockup)
  "hero.stage.label": "Architecture summary",
  "hero.stage.step.client": "Recruiters upload resumes and define the role.",
  "hero.stage.step.api": "Serves the scoring pipeline end to end.",
  "hero.stage.step.match": "Ranks candidates on meaning, not keyword overlap.",
  "hero.stage.step.explain": "Returns the gaps behind every score, in plain language.",
  "hero.stage.store": "PostgreSQL stores candidates, jobs, and scores.",
  "hero.stage.disclaimer":
    "A system-flow diagram of a real project I built — not a product screenshot.",
  "hero.stage.cta": "Read the case study",

  // Home — credibility strip
  "home.proof.eyebrow": "Track record",
  "home.proof.yearsLabel": "Years of professional engineering experience",
  "home.proof.recordsLabel": "Records per run through Spark and Delta Lake pipelines",
  "home.proof.tracesLabel": "Agent traces evaluated before automating engineering tasks",
  "home.proof.apisLabel": "REST APIs delivered for multi-tenant SaaS modules",

  // Home — selected work
  "home.work.eyebrow": "Selected work",
  "home.work.title": "Built, measured, shipped",
  "home.work.description":
    "Projects with the full story — context, decisions, and outcomes. The rest live in the index.",
  "home.work.viewCase": "Read the case study",
  "home.work.viewAll": "All {{count}} projects",
  "home.work.built": "Built",
  "home.work.stack": "Stack",
  "home.work.outcome": "Outcome",
  "home.work.repo": "Repository",

  // Home — experience preview (three curated roles; all five live on /about)
  "home.experience.eyebrow": "Experience",
  "home.experience.title": "3+ years of production engineering",
  "home.experience.description":
    "Backend services, full-stack applications, data pipelines, and agentic AI across data platform and enterprise SaaS products. Three roles shown here; the full history is on the About page.",
  "home.experience.cta": "Full experience and education",

  // Home — research note
  "home.research.eyebrow": "Research",
  "home.research.title": "Do privacy policies match the logs?",
  "home.research.finding":
    "67.6% of 1,000 studied Android apps logged sensitive data their privacy policies never disclosed.",
  "home.research.venue": "EASE 2026 · Research Track",
  "home.research.cta": "Read the research",

  // Home — about teaser
  "home.about.cta": "More about me",
  "home.about.photoAlt": "Love Ahir",
  "home.about.nowLabel": "Now",
  "home.about.basedLabel": "Based",
  "home.about.studiedLabel": "Studied",

  // Home — lead-project systems artifact (TradeOps Copilot).
  // An abstract architecture diagram, never a product screenshot.
  "artifact.label": "Lead project · systems architecture",
  "artifact.stagesLabel": "Explore the architecture",
  "artifact.stage.interface": "Exception queues, evidence, and review controls.",
  "artifact.stage.services": "Typed investigations with an explicit review interrupt.",
  "artifact.stage.data": "Workflow state and searchable evidence.",
  "artifact.stage.systems": "Reviewer authorization and an append-only audit trail.",
  "artifact.outcomeLabel": "Verified outcome",
  "artifact.disclaimer":
    "An abstract systems diagram of a project I built — not a product screenshot, and not a live view of the data.",
  "artifact.cta": "Read the case study",
  "artifact.repo": "Repository",

  // Home — technical capabilities
  "capabilities.eyebrow": "Capabilities",
  "capabilities.title": "What I actually work on",
  "capabilities.description":
    "Six areas, each backed by a shipped project or a dated role — not a self-assessment.",
  "capabilities.languages.title": "Languages & frameworks",
  "capabilities.languages.body":
    "Production services and interfaces across JVM, Python, TypeScript, mobile, and 3D web stacks.",
  "capabilities.cloud.title": "Cloud & DevOps",
  "capabilities.cloud.body":
    "Containerized delivery on AWS and GCP, with CI/CD pipelines and observability that keep releases repeatable.",
  "capabilities.databases.title": "Databases",
  "capabilities.databases.body":
    "Relational, document, graph, cache, and media-storage systems chosen for the shape of the data.",
  "capabilities.ai.title": "Data & AI",
  "capabilities.ai.body":
    "Governed agent workflows with tool calling and MLflow Tracing, large-scale Spark pipelines, and applied machine learning.",
  "capabilities.testing.title": "Testing & QA",
  "capabilities.testing.body":
    "Unit, integration, and UI test automation that gates releases from development through production.",
  "capabilities.practices.title": "Practices",
  "capabilities.practices.body":
    "Event-driven architecture, idempotent processing, retrieval patterns, and embeddings, applied where the system needs them.",
  "capabilities.footnote":
    "Each technology listed above appears in a project or role that actually used it.",

  // About
  "about.eyebrow": "About",
  "about.title": "Engineer who ships — with research-grade rigor when it counts",
  "about.description":
    "I care about the unglamorous middle of software — the place where a clean interface meets data that doesn't behave. That's where the interesting problems live.",
  "about.p1":
    "I'm a software engineer with 3+ years of production experience across data platform and enterprise SaaS products. Most of my work sits in the backend — Python and Java services, multi-tenant REST APIs, PostgreSQL performance tuning, and Spark pipelines that process 10M+ records per run — plus the testing and CI/CD that keep all of it releasable.",
  "about.p2":
    "The other half is what people actually touch: React and TypeScript interfaces, reusable UI components, and agentic AI workflows that earn their place through evaluation rather than demos. I measure the work the same way on either side of the stack — latency, reliability, and whether the numbers moved.",
  "about.p3":
    "The rigor comes from research. At RIT I built Python tooling that drove 1,000 Android apps automatically and analyzed 86M+ log entries against their stated privacy policies, published in the EASE 2026 Research Track. Large-scale automation, careful validation, and writing up results honestly are habits I brought straight back into engineering.",
  "about.education": "Education",
  "about.gpa": "GPA",

  // Experience
  "experience.eyebrow": "Experience",
  "experience.title": "Three-plus years across backend, data, full-stack, and applied AI",
  "experience.description":
    "Production systems for data platform and enterprise SaaS products, alongside graduate research and teaching at RIT. Dates and locations as they happened.",
  "experience.current": "Current",
  "experience.group.industry": "Industry engineering",
  "experience.group.research-teaching": "Research & teaching",

  // Experience — Databricks
  "exp.databricks.role": "Software Engineer, AI Platform",
  "exp.databricks.focus": "Agentic AI and Data Platform Engineering",
  "exp.databricks.summary":
    "Builds governed agentic workflows, backend services, large-scale Spark pipelines, and full-stack platform features for developer and data workflows.",
  "exp.databricks.a1":
    "Integrated a governed agentic AI workflow using Databricks Agent Framework, tool calling, and MLflow Tracing, automating 4 recurring engineering tasks per sprint after evaluating 1,000+ agent traces.",
  "exp.databricks.a2":
    "Developed Python backend services and Java SDK integrations for workspace, job, and metadata operations, adding caching, validation, and fault handling that reduced failed service calls by 18%.",
  "exp.databricks.a3":
    "Built PySpark and SQL pipelines on Apache Spark and Delta Lake to process 10M+ records per run, using incremental loads and Unity Catalog governance to reduce runtime from 2.5 hours to 40 minutes.",
  "exp.databricks.a4":
    "Engineered full-stack platform features using Python, FastAPI, React, and TypeScript, building REST APIs, asynchronous workflows, and reusable UI components across 10+ developer and data workflows.",
  "exp.databricks.a5":
    "Productionized services using pytest, integration testing, Git, Bazel, and automated CI/CD pipelines, maintaining 150+ automated checks across development, staging, and production releases.",
  "exp.databricks.a6":
    "Partnered with frontend, platform, data, and SRE engineers to design APIs, resolve distributed system failures, and deliver 8+ production workflows with stronger observability and release readiness.",

  // Experience — Neon IT Systems, Software Engineer II
  "exp.neon-software-engineer-2.role": "Software Engineer II",
  "exp.neon-software-engineer-2.summary":
    "Architected multi-tenant SaaS modules, tuned PostgreSQL performance, and hardened releases for an enterprise SaaS platform.",
  "exp.neon-software-engineer-2.a1":
    "Architected multi-tenant SaaS modules using Java, Spring Boot, Python, and React, delivering 20+ REST APIs for tenant configuration, access control, notifications, and customer-facing administration.",
  "exp.neon-software-engineer-2.a2":
    "Optimized PostgreSQL using query tuning, indexing, and connection pooling, reducing p95 latency from 2.1 seconds to 480 ms across services handling 250K+ records and ML prediction data.",
  "exp.neon-software-engineer-2.a3":
    "Decoupled long-running operations from customer-facing services by building Python background jobs for scheduled processing and bulk data loads, reducing API timeout errors by 24%.",
  "exp.neon-software-engineer-2.a4":
    "Hardened production releases with JUnit, pytest, Docker, Git, Jenkins, and AWS deployment workflows, resolving API and database defects while supporting 12 application releases across SaaS environments.",
  "exp.neon-software-engineer-2.a5":
    "Mentored 3 junior engineers through code reviews, debugging sessions, API design guidance, and testing practices, while coordinating technical tasks and enforcing reusable backend and database development standards.",

  // Experience — Neon IT Systems, Associate Software Engineer
  "exp.neon-associate-software-engineer.role": "Associate Software Engineer",
  "exp.neon-associate-software-engineer.summary":
    "Built enterprise SaaS workflow features, REST APIs, and Python automation for user, approval, reporting, and administrative workflows.",
  "exp.neon-associate-software-engineer.a1":
    "Developed enterprise SaaS workflow features using React.js, Java, Spring Boot, and PostgreSQL, building responsive interfaces and 15+ REST APIs for user, approval, reporting, and administrative workflows, deployed through Jenkins pipelines to reduce manual processing and improve user efficiency.",
  "exp.neon-associate-software-engineer.a2":
    "Automated data validation, scheduled reporting, and file processing with Python scripts handling 100K+ business records, saving the support team 7 hours per week.",
  "exp.neon-associate-software-engineer.a3":
    "Collaborated with senior engineers, QA, and product teams to write JUnit and pytest integration tests and resolve 18+ production defects across sprint releases.",

  // Experience — RIT Graduate Research Assistant
  "exp.rit-research-assistant.role": "Graduate Research Assistant — Privacy & Security",
  "exp.rit-research-assistant.summary":
    "Co-authored an EASE 2026 paper measuring the gap between what Android apps promise in their privacy policies and what they actually log.",
  "exp.rit-research-assistant.a1":
    "Published in the EASE 2026 Research Track, analyzing 86M+ real log entries against stated privacy policies.",
  "exp.rit-research-assistant.a2":
    "Built Python tooling for automated app exploration and behavioral analysis using ADB, Monkey, and logcat.",
  "exp.rit-research-assistant.a3":
    "Surfaced that 67.6% of studied apps leaked sensitive data never disclosed in their policies.",

  // Experience — RIT Teaching Assistant
  "exp.rit-teaching-assistant.role": "Teaching Assistant — Software Quality Assurance",
  "exp.rit-teaching-assistant.summary":
    "Supported graduate instruction for SWEN 777 under Dr. Xueling Zhang, mentoring students through testing methodology and research-paper seminars.",
  "exp.rit-teaching-assistant.a1":
    "Mentored graduate students through software testing methodology, raising assignment quality and class satisfaction.",
  "exp.rit-teaching-assistant.a2":
    "Led seminars dissecting 25+ research papers, sharpening critical reading and discussion across the cohort.",
  "exp.rit-teaching-assistant.a3":
    "Ran weekly office hours across Slack, email, and Zoom to unblock students on assignments and research.",

  // Work index
  "work.eyebrow": "Index",
  "work.title": "All work",
  "work.description": "{{count}} projects across product, research, and data — {{studies}} detailed case studies.",
  "work.featuredHeading": "Case studies",
  "work.archiveHeading": "More projects",
  "work.caseStudy": "Case study",
  "work.external": "External link",
  "category.Web App": "Web App",
  "category.Mobile App": "Mobile App",
  "category.Machine Learning": "Machine Learning",
  "category.Data Analysis": "Data Analysis",
  "case.tradeops-copilot.summary": "Investigate synthetic trade exceptions with retrieved evidence and mandatory human review.",
  "case.sentinelflow.summary": "Trace synthetic transactions through reliable event delivery, risk scoring, and analyst investigation.",
  "case.navisight.summary": "Explore historical vessel movements through maps, analytics, and a copilot with visible evidence.",
  "case.webops-commander.summary": "Investigate a simulated incident through browser-native tools and approve recovery before execution.",
  "category.Game Development": "Game Development",
  "category.Automation": "Automation",
  "category.Publication": "Publication",

  // Case-study template
  "case.eyebrow": "Case study",
  "case.context": "Context",
  "case.problem": "Problem",
  "case.approach": "Approach",
  "case.shipped": "What shipped",
  "case.retro": "What I'd do differently",
  "case.metrics": "Outcomes",
  "case.stack": "Stack",
  "case.role": "Role",
  "case.timeframe": "Timeframe",
  "case.viewRepo": "View repository",
  "case.viewPaper": "View paper",
  "case.viewLive": "View live",
  "case.next": "Next case study",
  "case.prev": "Previous case study",
  "case.backToIndex": "Back to all work",

  // Case-study summaries (one line each; bodies stay English by design)
  "case.privacy-policies-vs-logs.summary":
    "An EASE 2026 empirical study measuring whether 1,000 Android apps actually do what their privacy policies claim.",
  "case.ar-gesture-lab.summary":
    "A test harness that projects 3D world coordinates to screen pixels so Appium can automate gestures on live AR objects.",
  "case.vidking-ai-streaming.summary":
    "A full-stack streaming platform with Gemini-powered recommendations, live TMDB search, and cross-device watchlists.",
  "case.aura-grid.summary":
    "A competitive 3D strategy game on a deterministic engine, with frame-perfect replays and an RL opponent that adapts.",
  "case.resumatch-ai.summary":
    "Resume screening on LLM embeddings that scores candidates semantically and explains every gap behind the score.",
  "case.pokedex-mongodb.summary":
    "A full-stack platform serving 296k+ geospatial records through MongoDB 2dsphere indexes, with a battle game on top.",

  // Research page
  "research.eyebrow": "Research",
  "research.title": "Do Privacy Policies Match with the Logs?",
  "research.subtitle": "An Empirical Study of Privacy Disclosure in Android Apps",
  "research.venue": "EASE 2026 · Research Track",
  "research.abstractHeading": "Abstract",
  "research.abstract":
    "Privacy policies are the promises apps make about user data — but do runtime behaviors keep them? This study analyzes 86M+ real log entries from 1,000 Android apps, driving each app with automated exploration and matching observed data flows against the app's stated policy. The result: 67.6% of studied apps logged sensitive data their policies never disclosed, and only 0.4% fully aligned policy with practice.",
  "research.findingsHeading": "Key findings",
  "research.finding1":
    "67.6% of studied apps logged sensitive data never disclosed in their privacy policies.",
  "research.finding2":
    "Only 0.4% of apps fully aligned their privacy policy with what they actually log.",
  "research.finding3":
    "86M+ log entries from 1,000 Android apps were analyzed with automated exploration tooling built on ADB, Monkey, and logcat.",
  "research.methodHeading": "Method",
  "research.method":
    "Python tooling drove each app automatically: ADB and Monkey explored the UI, logcat captured runtime output, and an analysis pipeline matched observed sensitive-data flows against the claims in each app's privacy policy.",
  "research.citationHeading": "Cite this work",
  "research.copyBibtex": "Copy BibTeX",
  "research.copied": "Copied!",
  "research.viewOnConf": "View at EASE 2026",
  "research.vizCaption":
    "Of 1,000 studied apps: the share leaking undisclosed sensitive data versus the share fully aligned with their policy.",
  "research.vizTableCaption": "Key findings as data",

  // Skills
  "skills.eyebrow": "Toolkit",
  "skills.title": "The stack I reach for",
  "skills.description":
    "Languages, frameworks, and platforms I've used to ship real things — grouped by where they live in the stack.",

  // Expertise
  "expertise.eyebrow": "What I do",
  "expertise.title": "Six things I'm genuinely good at",
  "expertise.description":
    "The areas where I add the most value, from the front-end pixels all the way down to the research methodology.",

  // Certifications
  // Credentials and continued learning. Deliberately never called
  // "certifications": none of these is a professional certification.
  "credentials.eyebrow": "Credentials",
  "credentials.title": "Credentials and continued learning",
  "credentials.description":
    "Completed coursework and learning paths, listed with their exact titles and award types. Each one links to the issuer's certificate.",
  "credentials.aboutDescription":
    "Every credential below is a completed course or learning path rather than a professional certification, and is labelled as such. Each links to the certificate issued for it.",
  "credentials.viewAll": "All {{total}} credentials",
  "credentials.viewCertificate": "View certificate",
  "credentials.type.course-completion": "Course completion",
  "credentials.type.learning-path": "Learning path",
  "credentials.type.certificate": "Certificate",
  "credentials.type.professional-certification": "Professional certification",
  "credentials.note.examPrep":
    "Exam preparation course — not a Microsoft or Azure certification.",

  // Contact
  "contact.eyebrow": "Contact",
  "contact.title": "Let's build something worth shipping",
  "contact.description":
    "I'm open to Software Engineer, Full-Stack, and Backend roles, and always happy to talk through an interesting problem.",
  "contact.openTo": "Open to",
  "contact.openToText":
    "Software Engineer, Full-Stack, and Backend roles — plus AI engineering work where retrieval, agents, or applied ML are part of the product rather than the pitch.",
  "contact.copyEmail": "Copy email",
  "contact.copied": "Copied!",
  "contact.link.email": "Email",
  "contact.link.github": "GitHub",
  "contact.link.linkedin": "LinkedIn",
  "contact.link.location": "Location",

  // 404
  "notfound.title": "This page doesn't exist",
  "notfound.description": "Nothing at this route. Let's get you back to the work.",
  "notfound.home": "Back home",

  // Footer
  "footer.tagline": "Software engineer — full-stack, backend & applied AI",
  "footer.builtWith": "Designed & built with React, Tailwind, and Framer Motion.",
  "footer.source": "View source on GitHub",

  // Controls
  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "language.label": "Language",
} as const;

export type TranslationKey = keyof typeof enUS;
export type Translation = Record<TranslationKey, string>;

export default enUS;
