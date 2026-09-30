import type { Translation } from "./en-US";

/** German (Deutsch). */
const de: Translation = {
  brand: "Love Ahir",

  "nav.about": "Über mich",
  "nav.experience": "Erfahrung",
  "nav.work": "Projekte",
  "nav.research": "Forschung",
  "nav.skills": "Fähigkeiten",
  "nav.expertise": "Expertise",
  "nav.contact": "Kontakt",
  "nav.resume": "Lebenslauf",
  "nav.downloadResume": "Lebenslauf herunterladen",
  "nav.skipToContent": "Zum Inhalt springen",

  "hero.badge": "Software Engineer · Full-Stack · Backend · Angewandte KI",
  "hero.statement": "Ich baue verlässliche Full-Stack-Produkte und angewandte KI-Systeme.",
  "hero.roles":
    "Software-Ingenieur mit über 3 Jahren Erfahrung im Bau von Backend-Diensten, Full-Stack-Anwendungen, verteilten Datenpipelines und agentischen KI-Workflows für Datenplattform- und Enterprise-SaaS-Produkte.",
  "hero.seeWork": "Meine Arbeit ansehen",
  "hero.resume": "Lebenslauf",
  "hero.transformScene": "Voxelszene umformen",
  "hero.formation.identity": "Identität",
  "hero.formation.architecture": "Architektur",
  "hero.formation.throughput": "Durchsatz",
  "hero.monogramAlt": "Love-Ahir-Monogramm",
  "hero.sceneDisclaimer": "nur eine Form — keine Live-Telemetrie.",

  "hero.stage.label": "Architekturüberblick",
  "hero.stage.step.client":
    "Recruiter laden Lebensläufe hoch und definieren die Stelle.",
  "hero.stage.step.api": "Bedient die Bewertungs-Pipeline von Anfang bis Ende.",
  "hero.stage.step.match":
    "Ordnet Kandidaten nach Bedeutung, nicht nach Stichwortübereinstimmung.",
  "hero.stage.step.explain":
    "Liefert die Lücken hinter jeder Bewertung in klarer Sprache.",
  "hero.stage.store": "PostgreSQL speichert Kandidaten, Stellen und Bewertungen.",
  "hero.stage.disclaimer":
    "Ablaufdiagramm eines realen Projekts von mir — kein Produkt-Screenshot.",
  "hero.stage.cta": "Fallstudie lesen",

  "home.proof.eyebrow": "Bilanz",
  "home.proof.yearsLabel": "Jahre professionelle Engineering-Erfahrung",
  "home.proof.recordsLabel": "Datensätze pro Lauf in Spark- und Delta-Lake-Pipelines",
  "home.proof.tracesLabel":
    "Ausgewertete Agent-Traces vor der Automatisierung von Engineering-Aufgaben",
  "home.proof.apisLabel": "REST-APIs für mandantenfähige SaaS-Module",

  "home.work.eyebrow": "Ausgewählte Arbeiten",
  "home.work.title": "Gebaut, gemessen, ausgeliefert",
  "home.work.description":
    "Projekte mit der ganzen Geschichte — Kontext, Entscheidungen und Ergebnisse. Der Rest lebt im Index.",
  "home.work.viewCase": "Fallstudie lesen",
  "home.work.viewAll": "Alle {{count}} Projekte",
  "home.work.built": "Umsetzung",
  "home.work.stack": "Stack",
  "home.work.outcome": "Ergebnis",
  "home.work.repo": "Repository",

  "home.experience.eyebrow": "Erfahrung",
  "home.experience.title": "Über 3 Jahre Produktions-Engineering",
  "home.experience.description":
    "Backend-Dienste, Full-Stack-Anwendungen, Datenpipelines und agentische KI für Datenplattform- und Enterprise-SaaS-Produkte. Hier sind drei Stationen zu sehen; der vollständige Werdegang steht auf der Über-mich-Seite.",
  "home.experience.cta": "Vollständige Erfahrung und Ausbildung",

  "home.research.eyebrow": "Forschung",
  "home.research.title": "Passen Datenschutzrichtlinien zu den Logs?",
  "home.research.finding":
    "67,6 % der 1.000 untersuchten Android-Apps protokollierten sensible Daten, die ihre Datenschutzrichtlinien nie offengelegt haben.",
  "home.research.venue": "EASE 2026 · Research Track",
  "home.research.cta": "Zur Forschung",

  "home.about.cta": "Mehr über mich",
  "home.about.photoAlt": "Love Ahir",
  "home.about.nowLabel": "Aktuell",
  "home.about.basedLabel": "Standort",
  "home.about.studiedLabel": "Studium",

  "artifact.label": "Leitprojekt · Systemarchitektur",
  "artifact.stagesLabel": "Architektur erkunden",
  "artifact.stage.interface": "Ausnahmewarteschlangen, Belege und Prüfsteuerung.",
  "artifact.stage.services": "Typisierte Untersuchungen mit ausdrücklicher Prüfunterbrechung.",
  "artifact.stage.data": "Workflow-Zustand und durchsuchbare Belege.",
  "artifact.stage.systems": "Prüferberechtigung und nur ergänzbares Audit-Protokoll.",
  "artifact.outcomeLabel": "Verifiziertes Ergebnis",
  "artifact.disclaimer":
    "Ein abstraktes Systemdiagramm eines Projekts, das ich gebaut habe — kein Produkt-Screenshot und keine Live-Ansicht der Daten.",
  "artifact.cta": "Fallstudie lesen",
  "artifact.repo": "Repository",

  "capabilities.eyebrow": "Fähigkeiten",
  "capabilities.title": "Woran ich tatsächlich arbeite",
  "capabilities.description":
    "Sechs Bereiche, jeder belegt durch ein ausgeliefertes Projekt oder eine datierte Rolle — keine Selbsteinschätzung.",
  "capabilities.languages.title": "Sprachen & Frameworks",
  "capabilities.languages.body":
    "Produktionsdienste und Oberflächen für JVM-, Python-, TypeScript-, Mobile- und 3D-Web-Stacks.",
  "capabilities.cloud.title": "Cloud & DevOps",
  "capabilities.cloud.body":
    "Containerisierte Auslieferung auf AWS und GCP mit CI/CD-Pipelines und Observability, die Releases wiederholbar machen.",
  "capabilities.databases.title": "Datenbanken",
  "capabilities.databases.body":
    "Relationale, Dokument-, Graph-, Cache- und Medienspeichersysteme, passend zur Struktur der Daten.",
  "capabilities.ai.title": "Daten & KI",
  "capabilities.ai.body":
    "Kontrollierte Agenten-Workflows mit Tool-Calling und MLflow Tracing, groß angelegte Spark-Pipelines und angewandtes maschinelles Lernen.",
  "capabilities.testing.title": "Tests & Qualitätssicherung",
  "capabilities.testing.body":
    "Automatisierte Unit-, Integrations- und UI-Tests, die Releases von der Entwicklung bis zur Produktion absichern.",
  "capabilities.practices.title": "Arbeitsweisen",
  "capabilities.practices.body":
    "Ereignisgetriebene Architektur, idempotente Verarbeitung, Retrieval-Muster und Embeddings – dort eingesetzt, wo das System sie braucht.",
  "capabilities.footnote":
    "Jede oben genannte Technologie stammt aus einem Projekt oder einer Rolle, in der sie tatsächlich eingesetzt wurde.",

  "about.eyebrow": "Über mich",
  "about.title": "Ingenieur, der ausliefert — mit Forschungssorgfalt, wo sie zählt",
  "about.description":
    "Mich interessiert die unglamouröse Mitte der Software — dort, wo eine saubere Oberfläche auf Daten trifft, die sich nicht benehmen. Genau dort leben die spannenden Probleme.",
  "about.p1":
    "Ich bin Software-Ingenieur mit über 3 Jahren Produktionserfahrung in Datenplattform- und Enterprise-SaaS-Produkten. Der Großteil meiner Arbeit liegt im Backend: Python- und Java-Dienste, mandantenfähige REST-APIs, PostgreSQL-Performance-Tuning und Spark-Pipelines mit über 10 Mio. Datensätzen pro Lauf – dazu die Tests und CI/CD, die all das auslieferbar halten.",
  "about.p2":
    "Die andere Hälfte ist das, womit Menschen tatsächlich arbeiten: React- und TypeScript-Oberflächen, wiederverwendbare UI-Komponenten und agentische KI-Workflows, die sich durch Evaluierung statt durch Demos bewähren. Ich messe die Arbeit auf beiden Seiten des Stacks gleich – Latenz, Zuverlässigkeit und ob sich die Zahlen bewegt haben.",
  "about.p3":
    "Die Sorgfalt kommt aus der Forschung. Am RIT habe ich Python-Werkzeuge gebaut, die 1.000 Android-Apps automatisch steuerten, und über 86 Millionen Log-Einträge gegen ihre angegebenen Datenschutzrichtlinien analysiert — veröffentlicht im EASE 2026 Research Track. Automatisierung im großen Maßstab, sorgfältige Validierung und das ehrliche Aufschreiben von Ergebnissen sind Gewohnheiten, die ich direkt ins Engineering mitgenommen habe.",
  "about.education": "Ausbildung",
  "about.gpa": "Note",

  "experience.eyebrow": "Erfahrung",
  "experience.title": "Über drei Jahre zwischen Backend, Daten, Full-Stack und angewandter KI",
  "experience.description":
    "Produktionssysteme für Datenplattform- und Enterprise-SaaS-Produkte, dazu Forschung und Lehre im Masterprogramm am RIT. Daten und Orte so, wie sie waren.",
  "experience.current": "Aktuell",
  "experience.group.industry": "Engineering in der Industrie",
  "experience.group.research-teaching": "Forschung & Lehre",

  "exp.databricks.role": "Software Engineer, AI Platform",
  "exp.databricks.focus": "Agentische KI und Datenplattform-Engineering",
  "exp.databricks.summary":
    "Entwickelt kontrollierte agentische Workflows, Backend-Dienste, groß angelegte Spark-Pipelines und Full-Stack-Plattformfunktionen für Entwickler- und Daten-Workflows.",
  "exp.databricks.a1":
    "Integrierte einen kontrollierten agentischen KI-Workflow mit Databricks Agent Framework, Tool-Calling und MLflow Tracing und automatisierte nach der Auswertung von über 1.000 Agent-Traces 4 wiederkehrende Engineering-Aufgaben pro Sprint.",
  "exp.databricks.a2":
    "Entwickelte Python-Backend-Dienste und Java-SDK-Integrationen für Workspace-, Job- und Metadatenoperationen und ergänzte Caching, Validierung und Fehlerbehandlung, wodurch fehlgeschlagene Dienstaufrufe um 18 % sanken.",
  "exp.databricks.a3":
    "Baute PySpark- und SQL-Pipelines auf Apache Spark und Delta Lake, die über 10 Mio. Datensätze pro Lauf verarbeiten, und senkte die Laufzeit mit inkrementellen Loads und Unity-Catalog-Governance von 2,5 Stunden auf 40 Minuten.",
  "exp.databricks.a4":
    "Entwickelte Full-Stack-Plattformfunktionen mit Python, FastAPI, React und TypeScript – REST-APIs, asynchrone Workflows und wiederverwendbare UI-Komponenten für über 10 Entwickler- und Daten-Workflows.",
  "exp.databricks.a5":
    "Brachte Dienste mit pytest, Integrationstests, Git, Bazel und automatisierten CI/CD-Pipelines in Produktion und pflegte über 150 automatisierte Prüfungen über Entwicklungs-, Staging- und Produktions-Releases hinweg.",
  "exp.databricks.a6":
    "Arbeitete mit Frontend-, Plattform-, Daten- und SRE-Ingenieuren zusammen, um APIs zu entwerfen, Fehler in verteilten Systemen zu beheben und über 8 Produktions-Workflows mit besserer Observability und Release-Reife auszuliefern.",

  "exp.neon-software-engineer-2.role": "Software Engineer II",
  "exp.neon-software-engineer-2.summary":
    "Konzipierte mandantenfähige SaaS-Module, optimierte die PostgreSQL-Performance und härtete Releases für eine Enterprise-SaaS-Plattform.",
  "exp.neon-software-engineer-2.a1":
    "Konzipierte mandantenfähige SaaS-Module mit Java, Spring Boot, Python und React und lieferte über 20 REST-APIs für Mandantenkonfiguration, Zugriffskontrolle, Benachrichtigungen und kundenseitige Administration.",
  "exp.neon-software-engineer-2.a2":
    "Optimierte PostgreSQL durch Query-Tuning, Indizierung und Connection-Pooling und senkte die p95-Latenz von 2,1 Sekunden auf 480 ms bei Diensten mit über 250.000 Datensätzen und ML-Vorhersagedaten.",
  "exp.neon-software-engineer-2.a3":
    "Entkoppelte lang laufende Vorgänge von kundenseitigen Diensten durch Python-Hintergrundjobs für geplante Verarbeitung und Massendatenladungen und reduzierte API-Timeout-Fehler um 24 %.",
  "exp.neon-software-engineer-2.a4":
    "Härtete Produktions-Releases mit JUnit, pytest, Docker, Git, Jenkins und AWS-Deployment-Workflows, behob API- und Datenbankfehler und begleitete 12 Anwendungs-Releases über SaaS-Umgebungen hinweg.",
  "exp.neon-software-engineer-2.a5":
    "Betreute 3 Junior-Ingenieure durch Code-Reviews, Debugging-Sitzungen, API-Design-Beratung und Testpraktiken, koordinierte technische Aufgaben und setzte wiederverwendbare Backend- und Datenbankstandards durch.",

  "exp.neon-associate-software-engineer.role": "Associate Software Engineer",
  "exp.neon-associate-software-engineer.summary":
    "Entwickelte Enterprise-SaaS-Workflow-Funktionen, REST-APIs und Python-Automatisierung für Benutzer-, Genehmigungs-, Reporting- und Verwaltungsabläufe.",
  "exp.neon-associate-software-engineer.a1":
    "Entwickelte Enterprise-SaaS-Workflow-Funktionen mit React.js, Java, Spring Boot und PostgreSQL – responsive Oberflächen und über 15 REST-APIs für Benutzer-, Genehmigungs-, Reporting- und Verwaltungsabläufe, ausgeliefert über Jenkins-Pipelines, um manuellen Aufwand zu senken und die Effizienz der Nutzer zu steigern.",
  "exp.neon-associate-software-engineer.a2":
    "Automatisierte Datenvalidierung, geplantes Reporting und Dateiverarbeitung mit Python-Skripten für über 100.000 Geschäftsdatensätze und sparte dem Support-Team 7 Stunden pro Woche.",
  "exp.neon-associate-software-engineer.a3":
    "Schrieb gemeinsam mit Senior-Ingenieuren, QA und Produktteams JUnit- und pytest-Integrationstests und behob über 18 Produktionsfehler über Sprint-Releases hinweg.",

  "exp.rit-research-assistant.role": "Wissenschaftlicher Mitarbeiter (Master) — Datenschutz & Sicherheit",
  "exp.rit-research-assistant.summary":
    "Mitautor einer EASE-2026-Arbeit, die die Lücke zwischen den Versprechen von Android-Apps in ihren Datenschutzrichtlinien und dem, was sie tatsächlich protokollieren, misst.",
  "exp.rit-research-assistant.a1":
    "Im EASE 2026 Research Track veröffentlicht; über 86 Millionen echte Log-Einträge gegen die angegebenen Datenschutzrichtlinien analysiert.",
  "exp.rit-research-assistant.a2":
    "Python-Werkzeuge für automatisierte App-Exploration und Verhaltensanalyse mit ADB, Monkey und logcat gebaut.",
  "exp.rit-research-assistant.a3":
    "Aufgedeckt, dass 67,6 % der untersuchten Apps sensible Daten preisgaben, die in ihren Richtlinien nie offengelegt wurden.",

  "exp.rit-teaching-assistant.role": "Lehrassistent — Softwarequalitätssicherung",
  "exp.rit-teaching-assistant.summary":
    "Unterstützte die Masterlehre in SWEN 777 bei Dr. Xueling Zhang und begleitete Studierende durch Testmethodik und Seminare zu Forschungsarbeiten.",
  "exp.rit-teaching-assistant.a1":
    "Masterstudierende in Softwaretestmethodik betreut; die Qualität der Abgaben und die Zufriedenheit im Kurs erhöht.",
  "exp.rit-teaching-assistant.a2":
    "Seminare zur Analyse von über 25 Forschungsarbeiten geleitet; kritisches Lesen und Diskussion im gesamten Jahrgang geschärft.",
  "exp.rit-teaching-assistant.a3":
    "Wöchentliche Sprechstunden über Slack, E-Mail und Zoom angeboten, um Studierende bei Aufgaben und Forschung zu entlasten.",

  "work.eyebrow": "Index",
  "work.title": "Alle Arbeiten",
  "work.description": "{{count}} Projekte aus Produktentwicklung, Forschung und Datenanalyse — {{studies}} ausführliche Fallstudien.",
  "work.featuredHeading": "Fallstudien",
  "work.archiveHeading": "Weitere Projekte",
  "work.caseStudy": "Fallstudie",
  "work.external": "Externer Link",
  "category.Web App": "Web-App",
  "category.Mobile App": "Mobile App",
  "category.Machine Learning": "Maschinelles Lernen",
  "category.Data Analysis": "Datenanalyse",
  "case.tradeops-copilot.summary": "Untersuchen Sie synthetische Handelsausnahmen mit abgerufenen Belegen und verpflichtender menschlicher Prüfung.",
  "case.sentinelflow.summary": "Verfolgen Sie synthetische Transaktionen über zuverlässige Ereignisse, Risikobewertung und Untersuchung.",
  "case.navisight.summary": "Erkunden Sie historische Schiffsbewegungen mit Karten, Analysen und einem Copilot mit sichtbaren Belegen.",
  "case.webops-commander.summary": "Untersuchen Sie einen simulierten Vorfall mit Browser-Tools und genehmigen Sie die Wiederherstellung vor der Ausführung.",
  "category.Game Development": "Spieleentwicklung",
  "category.Automation": "Automatisierung",
  "category.Publication": "Publikation",

  "case.eyebrow": "Fallstudie",
  "case.context": "Kontext",
  "case.problem": "Problem",
  "case.approach": "Vorgehen",
  "case.shipped": "Was ausgeliefert wurde",
  "case.retro": "Was ich anders machen würde",
  "case.metrics": "Ergebnisse",
  "case.stack": "Stack",
  "case.role": "Rolle",
  "case.timeframe": "Zeitraum",
  "case.viewRepo": "Repository ansehen",
  "case.viewPaper": "Paper ansehen",
  "case.viewLive": "Live ansehen",
  "case.next": "Nächste Fallstudie",
  "case.prev": "Vorherige Fallstudie",
  "case.backToIndex": "Zurück zu allen Arbeiten",

  "case.privacy-policies-vs-logs.summary":
    "Eine empirische EASE-2026-Studie, die misst, ob 1.000 Android-Apps wirklich tun, was ihre Datenschutzrichtlinien behaupten.",
  "case.ar-gesture-lab.summary":
    "Ein Test-Harness, das 3D-Weltkoordinaten auf Bildschirmpixel projiziert, damit Appium Gesten auf live AR-Objekten automatisieren kann.",
  "case.vidking-ai-streaming.summary":
    "Eine Full-Stack-Streaming-Plattform mit Gemini-Empfehlungen, TMDB-Livesuche und geräteübergreifenden Merklisten.",
  "case.aura-grid.summary":
    "Ein kompetitives 3D-Strategiespiel auf einer deterministischen Engine, mit exakten Replays und einem lernenden RL-Gegner.",
  "case.resumatch-ai.summary":
    "Lebenslauf-Screening auf LLM-Embeddings, das Kandidaten semantisch bewertet und jede Lücke hinter dem Score erklärt.",
  "case.pokedex-mongodb.summary":
    "Eine Full-Stack-Plattform, die 296k+ Geodatensätze über MongoDB-2dsphere-Indizes ausliefert — mit einem Kampfspiel obendrauf.",

  "research.eyebrow": "Forschung",
  "research.title": "Do Privacy Policies Match with the Logs?",
  "research.subtitle": "Eine empirische Studie zur Datenschutz-Offenlegung in Android-Apps",
  "research.venue": "EASE 2026 · Research Track",
  "research.abstractHeading": "Abstract",
  "research.abstract":
    "Datenschutzrichtlinien sind die Versprechen, die Apps über Nutzerdaten geben — aber hält das Laufzeitverhalten sie ein? Diese Studie analysiert über 86 Millionen echte Log-Einträge aus 1.000 Android-Apps, steuert jede App automatisiert und gleicht beobachtete Datenflüsse mit der erklärten Richtlinie ab. Das Ergebnis: 67,6 % der untersuchten Apps protokollierten sensible Daten, die ihre Richtlinien nie offengelegt haben, und nur 0,4 % brachten Richtlinie und Praxis vollständig in Einklang.",
  "research.findingsHeading": "Zentrale Ergebnisse",
  "research.finding1":
    "67,6 % der untersuchten Apps protokollierten sensible Daten, die in ihren Datenschutzrichtlinien nie offengelegt wurden.",
  "research.finding2":
    "Nur 0,4 % der Apps brachten ihre Datenschutzrichtlinie vollständig mit dem tatsächlichen Logging in Einklang.",
  "research.finding3":
    "Über 86 Millionen Log-Einträge aus 1.000 Android-Apps wurden mit automatisierten Explorationswerkzeugen auf Basis von ADB, Monkey und logcat analysiert.",
  "research.methodHeading": "Methode",
  "research.method":
    "Python-Werkzeuge steuerten jede App automatisch: ADB und Monkey erkundeten die Oberfläche, logcat erfasste die Laufzeitausgabe, und eine Analyse-Pipeline glich beobachtete sensible Datenflüsse mit den Aussagen jeder Datenschutzrichtlinie ab.",
  "research.citationHeading": "Diese Arbeit zitieren",
  "research.copyBibtex": "BibTeX kopieren",
  "research.copied": "Kopiert!",
  "research.viewOnConf": "Bei EASE 2026 ansehen",
  "research.vizCaption":
    "Von 1.000 untersuchten Apps: der Anteil, der nicht offengelegte sensible Daten preisgibt, gegenüber dem Anteil, der vollständig mit seiner Richtlinie übereinstimmt.",
  "research.vizTableCaption": "Zentrale Ergebnisse als Daten",

  "skills.eyebrow": "Werkzeugkasten",
  "skills.title": "Der Stack, zu dem ich greife",
  "skills.description":
    "Sprachen, Frameworks und Plattformen, mit denen ich echte Dinge ausgeliefert habe — gruppiert nach ihrem Platz im Stack.",

  "expertise.eyebrow": "Was ich tue",
  "expertise.title": "Sechs Dinge, in denen ich wirklich gut bin",
  "expertise.description":
    "Die Bereiche, in denen ich den meisten Mehrwert schaffe, von den Pixeln des Frontends bis hinunter zur Forschungsmethodik.",

  "credentials.eyebrow": "Qualifikationen",
  "credentials.title": "Qualifikationen und laufende Weiterbildung",
  "credentials.description":
    "Abgeschlossene Kurse und Lernpfade, mit ihrem exakten Titel und ihrer Art. Jeder Eintrag verlinkt auf die Bescheinigung des Anbieters.",
  "credentials.aboutDescription":
    "Jeder Eintrag unten ist ein abgeschlossener Kurs oder Lernpfad, keine Berufszertifizierung — und ist genau so gekennzeichnet. Jeder verlinkt auf die ausgestellte Bescheinigung.",
  "credentials.viewAll": "Alle {{total}} Qualifikationen",
  "credentials.viewCertificate": "Bescheinigung ansehen",
  "credentials.type.course-completion": "Kursabschluss",
  "credentials.type.learning-path": "Lernpfad",
  "credentials.type.certificate": "Bescheinigung",
  "credentials.type.professional-certification": "Berufszertifizierung",
  "credentials.note.examPrep":
    "Kurs zur Prüfungsvorbereitung — keine Microsoft- oder Azure-Zertifizierung.",

  "contact.eyebrow": "Kontakt",
  "contact.title": "Lass uns etwas bauen, das es wert ist, ausgeliefert zu werden",
  "contact.description":
    "Ich bin offen für Rollen als Software Engineer, im Full-Stack und im Backend und freue mich immer, ein interessantes Problem zu besprechen.",
  "contact.openTo": "Offen für",
  "contact.openToText":
    "Rollen als Software Engineer, im Full-Stack und im Backend — dazu KI-Engineering, wenn Retrieval, Agenten oder angewandtes ML Teil des Produkts sind und nicht der Verkaufsrede.",
  "contact.copyEmail": "E-Mail kopieren",
  "contact.copied": "Kopiert!",
  "contact.link.email": "E-Mail",
  "contact.link.github": "GitHub",
  "contact.link.linkedin": "LinkedIn",
  "contact.link.location": "Standort",

  "notfound.title": "Diese Seite existiert nicht",
  "notfound.description": "Unter dieser Adresse liegt nichts. Zurück zur Arbeit.",
  "notfound.home": "Zur Startseite",

  "footer.tagline": "Software-Ingenieur — Full-Stack, Backend & angewandte KI",
  "footer.builtWith": "Entworfen und gebaut mit React, Tailwind und Framer Motion.",
  "footer.source": "Quellcode auf GitHub ansehen",

  "theme.label": "Design",
  "theme.light": "Hell",
  "theme.dark": "Dunkel",
  "language.label": "Sprache",
};

export default de;
