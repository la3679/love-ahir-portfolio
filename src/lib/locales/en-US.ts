/**
 * Canonical translation dictionary (English — United States).
 *
 * Every other locale implements this exact key set, so the `Translation`
 * type derived from here keeps all locales structurally in sync at compile
 * time. Keys are flat + dotted (i18n is configured with keySeparator: false)
 * so the dots are literal, not nesting.
 *
 * Proper nouns (RIT, EASE 2026, React, GPA, AI/ML/LLM, tech names) are left
 * untranslated on purpose — they read the same across locales.
 */
const enUS = {
  brand: "Love Ahir",

  // Navigation
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.work": "Work",
  "nav.skills": "Skills",
  "nav.expertise": "Expertise",
  "nav.contact": "Contact",
  "nav.resume": "Resume",
  "nav.downloadResume": "Download Resume",

  // Hero
  "hero.badge": "Open to software & research roles",
  "hero.intro": "I'm a",
  "hero.explore": "Explore my work",
  "hero.resume": "Resume",

  // About
  "about.eyebrow": "About",
  "about.title": "Engineer by training, researcher by curiosity",
  "about.description":
    "I care about the unglamorous middle of software — the place where a clean interface meets data that doesn't behave. That's where the interesting problems live.",
  "about.p1":
    "I recently completed my M.S. in Computer Software Engineering at RIT with a 3.94 GPA. Along the way I worked as both a teaching and research assistant — teaching software quality to graduate students while running large-scale privacy experiments of my own.",
  "about.p2":
    "My research asked a deceptively simple question: do apps actually do what their privacy policies say? The answer, across 86 million log entries, was mostly no — and that work is now published in the EASE 2026 Research Track.",
  "about.p3":
    "Outside research, I ship product. I've built AI streaming platforms, recruitment engines, and 3D strategy games — usually full-stack, usually with an LLM doing something genuinely useful rather than decorative.",
  "about.education": "Education",
  "about.gpa": "GPA",

  // Experience
  "experience.eyebrow": "Experience",
  "experience.title": "A track record across teaching, research, and industry",
  "experience.description":
    "From mentoring graduate students to shipping ML-backed features in production, the through-line is the same: rigor that holds up under scrutiny.",
  "experience.current": "Current",

  // Projects
  "projects.eyebrow": "Selected Work",
  "projects.title": "Things I've designed, built, and shipped",
  "projects.description":
    "A mix of production products, research, and ambitious side projects — filter by what you care about.",
  "projects.featured": "Featured",
  "projects.viewProject": "View project",
  "category.All": "All",
  "category.Web App": "Web App",
  "category.Mobile App": "Mobile App",
  "category.Machine Learning": "Machine Learning",
  "category.Data Analysis": "Data Analysis",
  "category.Publication": "Publication",

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
  "certifications.eyebrow": "Credentials",
  "certifications.title": "Always learning, on the record",
  "certifications.description":
    "A sample of the certifications I've earned while keeping pace with a fast-moving field.",

  // Contact
  "contact.eyebrow": "Contact",
  "contact.title": "Let's build something worth shipping",
  "contact.description":
    "I'm open to software engineering and research roles, and always happy to talk through an interesting problem.",
  "contact.availableNow": "Available now",
  "contact.availableText":
    "Recently completed my M.S. at RIT (Dec 2025). Seeking full-time roles in software engineering, applied AI, and privacy research.",
  "contact.name": "Name",
  "contact.email": "Email",
  "contact.message": "Message",
  "contact.namePlaceholder": "Your name",
  "contact.emailPlaceholder": "you@example.com",
  "contact.messagePlaceholder": "Tell me about the role or project…",
  "contact.send": "Send message",
  "contact.link.email": "Email",
  "contact.link.github": "GitHub",
  "contact.link.linkedin": "LinkedIn",
  "contact.link.location": "Location",

  // Footer
  "footer.tagline": "Software engineer & privacy researcher",
  "footer.builtWith": "Designed & built with React, Tailwind, and Framer Motion.",

  // Controls
  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "language.label": "Language",
} as const;

export type TranslationKey = keyof typeof enUS;
export type Translation = Record<TranslationKey, string>;

export default enUS;
