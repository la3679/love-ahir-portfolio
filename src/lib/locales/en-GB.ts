import type { Translation } from "./en-US";

/**
 * English — United Kingdom. Mirrors en-US with British spellings
 * ("rigour", "specialising", "behaviour") and date/phrasing conventions.
 */
const enGB: Translation = {
  brand: "Love Ahir",

  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.work": "Work",
  "nav.research": "Research",
  "nav.skills": "Skills",
  "nav.expertise": "Expertise",
  "nav.contact": "Contact",
  "nav.resume": "CV",
  "nav.downloadResume": "Download CV",
  "nav.skipToContent": "Skip to content",

  "hero.badge": "Software Engineer · Full-Stack · Backend · Applied AI",
  "hero.statement": "I build reliable full-stack products and applied AI systems.",
  "hero.roles":
    "Software engineer with 4+ years building production backends, full-stack interfaces, data systems, and applied AI across financial services and enterprise platforms.",
  "hero.seeWork": "View work",
  "hero.resume": "CV",
  "hero.transformScene": "Transform voxel scene",
  "hero.formation.identity": "Identity",
  "hero.formation.architecture": "Architecture",
  "hero.formation.throughput": "Throughput",
  "hero.monogramAlt": "Love Ahir monogram",
  "hero.sceneDisclaimer": "shape only — not live telemetry.",

  "hero.stage.label": "Architecture summary",
  "hero.stage.step.client": "Recruiters upload CVs and define the role.",
  "hero.stage.step.api": "Serves the scoring pipeline end to end.",
  "hero.stage.step.match": "Ranks candidates on meaning, not keyword overlap.",
  "hero.stage.step.explain": "Returns the gaps behind every score, in plain language.",
  "hero.stage.store": "PostgreSQL stores candidates, jobs, and scores.",
  "hero.stage.disclaimer":
    "A system-flow diagram of a real project I built — not a product screenshot.",
  "hero.stage.cta": "Read the case study",

  "home.proof.eyebrow": "Track record",
  "home.proof.yearsLabel": "Years of professional engineering experience",
  "home.proof.uptimeLabel": "Uptime across eight production FastAPI services",
  "home.proof.transactionsLabel": "Daily transactions supported by event-driven services",
  "home.proof.documentsLabel": "Documents in a production retrieval pipeline",

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

  "home.experience.eyebrow": "Experience",
  "home.experience.title": "4+ years of production engineering",
  "home.experience.description":
    "Backend services, full-stack interfaces, data systems, and applied AI across financial services and enterprise platforms. Three roles shown here; the full history is on the About page.",
  "home.experience.cta": "Full experience and education",

  "home.research.eyebrow": "Research",
  "home.research.title": "Do privacy policies match the logs?",
  "home.research.finding":
    "67.6% of 1,000 studied Android apps logged sensitive data their privacy policies never disclosed.",
  "home.research.venue": "EASE 2026 · Research Track",
  "home.research.cta": "Read the research",

  "home.about.cta": "More about me",
  "home.about.photoAlt": "Love Ahir",
  "home.about.nowLabel": "Now",
  "home.about.basedLabel": "Based",
  "home.about.studiedLabel": "Studied",

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

  "capabilities.eyebrow": "Capabilities",
  "capabilities.title": "What I actually work on",
  "capabilities.description":
    "Six areas, each backed by a shipped project or a dated role — not a self-assessment.",
  "capabilities.languages.title": "Languages & frameworks",
  "capabilities.languages.body":
    "Production services and interfaces across JVM, Python, TypeScript, mobile, and 3D web stacks.",
  "capabilities.cloud.title": "Cloud & DevOps",
  "capabilities.cloud.body":
    "Cloud delivery and observability across AWS and GCP, backed by repeatable automation.",
  "capabilities.databases.title": "Databases",
  "capabilities.databases.body":
    "Relational, document, graph, cache, and media-storage systems chosen for the shape of the data.",
  "capabilities.ai.title": "Data & AI",
  "capabilities.ai.body":
    "Agent workflows and production retrieval alongside semantic matching and classic machine learning.",
  "capabilities.testing.title": "Testing & QA",
  "capabilities.testing.body":
    "Automated UI and service-level quality gates that keep releases repeatable.",
  "capabilities.practices.title": "Practices",
  "capabilities.practices.body":
    "Event-driven architecture, retrieval patterns, embeddings, and delivery pipelines measured in production.",
  "capabilities.footnote":
    "Each technology listed above appears in a project or role that actually used it.",

  "about.eyebrow": "About",
  "about.title": "Engineer who ships — with research-grade rigour when it counts",
  "about.description":
    "I care about the unglamorous middle of software — the place where a clean interface meets data that doesn't behave. That's where the interesting problems live.",
  "about.p1":
    "I'm a software engineer with 4+ years of production experience across financial services and enterprise platforms. Most of my work sits in the backend — event-driven Python and Java services, relational data models, caching, authorisation, and the delivery pipelines that keep all of it releasable.",
  "about.p2":
    "The other half is what people actually touch: React and TypeScript interfaces built on real-time data, and applied AI features where retrieval, agents, or classic ML earn their place in the product rather than decorate it. I measure the work the same way either side of the stack — latency, reliability, and whether the numbers moved.",
  "about.p3":
    "The rigour comes from research. At RIT I built Python tooling that drove 1,000 Android apps automatically and analysed 86M+ log entries against their stated privacy policies, published in the EASE 2026 Research Track. Large-scale automation, careful validation, and writing up results honestly are habits I brought straight back into engineering.",
  "about.education": "Education",
  "about.gpa": "GPA",

  "experience.eyebrow": "Experience",
  "experience.title": "Four-plus years across backend, full-stack, and applied AI",
  "experience.description":
    "Production systems in financial services and enterprise platforms, alongside postgraduate research and teaching at RIT. Dates and locations as they happened.",
  "experience.current": "Current",
  "experience.group.industry": "Industry engineering",
  "experience.group.research-teaching": "Research & teaching",

  "exp.morgan-stanley.role": "Software Engineer",
  "exp.morgan-stanley.focus": "Agentic AI and Full-Stack Systems",
  "exp.morgan-stanley.summary":
    "Builds event-driven backend services, real-time trading interfaces, document-retrieval workflows, and delivery tooling for fixed-income operations.",
  "exp.morgan-stanley.a1":
    "Architected eight event-driven FastAPI services on AWS ECS/Fargate with Redis caching, OAuth2/JWT, and asynchronous task queues, achieving 99.97% uptime across the eight services.",
  "exp.morgan-stanley.a2":
    "Shipped React 18 and TypeScript dashboards with D3.js and WebSocket feeds, reducing trader decision latency by 45% for more than 200 fixed-income users.",
  "exp.morgan-stanley.a3":
    "Designed multi-agent LangGraph workflows with tool-calling, controlled agent memory, and AWS Bedrock to automate trade-exception handling, reducing manual intervention by 65% and eliminating an estimated $2.4M in annual manual-processing costs.",
  "exp.morgan-stanley.a4":
    "Implemented a retrieval-augmented generation pipeline with LangChain, FAISS, OpenAI Embeddings, and prompt engineering over 10M+ documents, cutting analyst lookup time from 8 minutes to under 90 seconds.",
  "exp.morgan-stanley.a5":
    "Fine-tuned BERT with spaCy for entity extraction and trade-memo anomaly detection, improving precision by 38% against the rule-based baseline.",
  "exp.morgan-stanley.a6":
    "Built delivery pipelines with GitHub Actions and AWS CodePipeline, backed by Datadog LLM traces, SonarQube, and pytest quality gates, reducing deployment cycle time by 50%.",

  "exp.sage-software-engineer-2.role": "Software Engineer 2",
  "exp.sage-software-engineer-2.summary":
    "Owned backend architecture, frontend foundations, database performance, machine-learning integration, and observability for a high-volume enterprise platform.",
  "exp.sage-software-engineer-2.a1":
    "Architected Java Spring Boot REST microservices with Kafka event streaming for a platform handling more than 500K daily transactions, cutting API response time by 40% through connection pooling.",
  "exp.sage-software-engineer-2.a2":
    "Optimised PostgreSQL schemas and complex joins with Flyway migrations on GCP CloudSQL, reducing report generation from 14 seconds to 2.1 seconds — an 85% improvement.",
  "exp.sage-software-engineer-2.a3":
    "Built a reusable React 17 and Redux Toolkit component library with Material UI and Jest, delivering 10 features across four sprints and reducing the QA bug cycle by 45%.",
  "exp.sage-software-engineer-2.a4":
    "Deployed a scikit-learn anomaly-detection service behind a Python REST wrapper on GCP Cloud Run, processing more than 1M events per day and reducing fraud false positives by 30%.",
  "exp.sage-software-engineer-2.a5":
    "Served as technical lead for a five-member Agile squad, mentored three engineers, reviewed more than 120 pull requests, and expanded Grafana and Prometheus observability, reducing incident MTTR by 32%.",

  "exp.axisray.role": "Software Engineer Intern",
  "exp.axisray.summary":
    "Hardened Java microservices and shipped ML-backed features that improved reliability and accelerated delivery.",
  "exp.axisray.a1":
    "Refactored Spring Boot microservices, improving reliability and cutting feature delivery time by 20%.",
  "exp.axisray.a2":
    "Built and integrated ML models in Python and Java, lifting recommendation accuracy by 30%.",
  "exp.axisray.a3":
    "Modernised legacy JSP applications into Spring Boot for richer data visualisation.",

  "exp.moon-technolabs.role": "Data Science & AI/ML Engineering Intern",
  "exp.moon-technolabs.summary":
    "Led a SaaS supply-chain resiliency initiative, building data pipelines and AI-driven optimisation across HRMS and CRM systems.",
  "exp.moon-technolabs.a1":
    "Drove a supply-chain resiliency project that raised operational efficiency by 30%.",
  "exp.moon-technolabs.a2":
    "Designed scalable data pipelines and AI solutions powering adaptive operations.",
  "exp.moon-technolabs.a3":
    "Tuned ML models for resource allocation, reducing operational cost by 15%.",

  "exp.sage-associate-developer.role": "Associate Developer",
  "exp.sage-associate-developer.summary":
    "Built customer-onboarding APIs, improved internal-portal performance, and automated a MySQL-to-PostgreSQL migration.",
  "exp.sage-associate-developer.a1":
    "Built Java Spring Boot APIs processing more than 10K daily records and fixed more than 40 bugs, using the ELK Stack for logging and troubleshooting to improve endpoint reliability by 22%.",
  "exp.sage-associate-developer.a2":
    "Implemented React functional components and React Router across a three-module internal portal, applying lazy loading and code splitting to reduce page-load time by 30%, validated with Lighthouse audits.",
  "exp.sage-associate-developer.a3":
    "Automated MySQL-to-PostgreSQL migration with Python scripts, validating more than 500K records for schema compliance and creating runbooks adopted by the infrastructure team.",

  "exp.rit-research-assistant.role": "Postgraduate Research Assistant — Privacy & Security",
  "exp.rit-research-assistant.summary":
    "Co-authored an EASE 2026 paper measuring the gap between what Android apps promise in their privacy policies and what they actually log.",
  "exp.rit-research-assistant.a1":
    "Published in the EASE 2026 Research Track, analysing 86M+ real log entries against stated privacy policies.",
  "exp.rit-research-assistant.a2":
    "Built Python tooling for automated app exploration and behavioural analysis using ADB, Monkey, and logcat.",
  "exp.rit-research-assistant.a3":
    "Surfaced that 67.6% of studied apps leaked sensitive data never disclosed in their policies.",

  "exp.rit-teaching-assistant.role": "Teaching Assistant — Software Quality Assurance",
  "exp.rit-teaching-assistant.summary":
    "Supported postgraduate instruction for SWEN 777 under Dr Xueling Zhang, mentoring students through testing methodology and research-paper seminars.",
  "exp.rit-teaching-assistant.a1":
    "Mentored postgraduate students through software testing methodology, raising assignment quality and class satisfaction.",
  "exp.rit-teaching-assistant.a2":
    "Led seminars dissecting 25+ research papers, sharpening critical reading and discussion across the cohort.",
  "exp.rit-teaching-assistant.a3":
    "Ran weekly office hours across Slack, email, and Zoom to unblock students on assignments and research.",

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

  "case.privacy-policies-vs-logs.summary":
    "An EASE 2026 empirical study measuring whether 1,000 Android apps actually do what their privacy policies claim.",
  "case.ar-gesture-lab.summary":
    "A test harness that projects 3D world coordinates to screen pixels so Appium can automate gestures on live AR objects.",
  "case.vidking-ai-streaming.summary":
    "A full-stack streaming platform with Gemini-powered recommendations, live TMDB search, and cross-device watchlists.",
  "case.aura-grid.summary":
    "A competitive 3D strategy game on a deterministic engine, with frame-perfect replays and an RL opponent that adapts.",
  "case.resumatch-ai.summary":
    "CV screening on LLM embeddings that scores candidates semantically and explains every gap behind the score.",
  "case.pokedex-mongodb.summary":
    "A full-stack platform serving 296k+ geospatial records through MongoDB 2dsphere indexes, with a battle game on top.",

  "research.eyebrow": "Research",
  "research.title": "Do Privacy Policies Match with the Logs?",
  "research.subtitle": "An Empirical Study of Privacy Disclosure in Android Apps",
  "research.venue": "EASE 2026 · Research Track",
  "research.abstractHeading": "Abstract",
  "research.abstract":
    "Privacy policies are the promises apps make about user data — but do runtime behaviours keep them? This study analyses 86M+ real log entries from 1,000 Android apps, driving each app with automated exploration and matching observed data flows against the app's stated policy. The result: 67.6% of studied apps logged sensitive data their policies never disclosed, and only 0.4% fully aligned policy with practice.",
  "research.findingsHeading": "Key findings",
  "research.finding1":
    "67.6% of studied apps logged sensitive data never disclosed in their privacy policies.",
  "research.finding2":
    "Only 0.4% of apps fully aligned their privacy policy with what they actually log.",
  "research.finding3":
    "86M+ log entries from 1,000 Android apps were analysed with automated exploration tooling built on ADB, Monkey, and logcat.",
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

  "skills.eyebrow": "Toolkit",
  "skills.title": "The stack I reach for",
  "skills.description":
    "Languages, frameworks, and platforms I've used to ship real things — grouped by where they live in the stack.",

  "expertise.eyebrow": "What I do",
  "expertise.title": "Six things I'm genuinely good at",
  "expertise.description":
    "The areas where I add the most value, from the front-end pixels all the way down to the research methodology.",

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

  "notfound.title": "This page doesn't exist",
  "notfound.description": "Nothing at this route. Let's get you back to the work.",
  "notfound.home": "Back home",

  "footer.tagline": "Software engineer — full-stack, backend & applied AI",
  "footer.builtWith": "Designed & built with React, Tailwind, and Framer Motion.",
  "footer.source": "View source on GitHub",

  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "language.label": "Language",
};

export default enGB;
