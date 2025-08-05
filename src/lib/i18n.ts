import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "about": "About",
      "experience": "Experience", 
      "projects": "Projects",
      "skills": "Skills",
      "certifications": "Certifications",
      "hobbies": "Hobbies",
      "contact": "Contact",
      
      // Hero section
      "hero.title": "Love Jayesh Ahir",
      "hero.roles": ["Software Engineer", "Data Analyst", "Full Stack Developer", "UI/UX Designer", "Programmer"],
      "hero.description": "Graduate Assistant in Software Engineering at RIT, specializing in privacy leak detection, mobile app security, and full-stack development with machine learning integration.",
      "hero.downloadResume": "Download Resume",
      "hero.viewProjects": "View Projects",
      
      // Experience section
      "experience.title": "Experience",
      "experience.subtitle": "Professional journey in software engineering, research, and machine learning",
      "experience.achievements": "Key Achievements:",
      
      // Projects section  
      "projects.title": "Featured Projects",
      "projects.subtitle": "Showcasing innovative solutions across web, mobile, and machine learning domains",
      "projects.allCategory": "All",
      "projects.webApp": "Web App",
      "projects.mobileApp": "Mobile App",
      "projects.machineLearning": "Machine Learning",
      "projects.dataAnalysis": "Data Analysis",
      "projects.publication": "Publication",
      "projects.features": "Key Features:",
      
      // Skills section
      "skills.title": "Technical Skills",
      "skills.programming": "Programming Languages & Concepts",
      "skills.dataScience": "Data Science & Analytics", 
      "skills.databases": "Databases & Data Engineering",
      "skills.frameworks": "Frameworks & Technologies",
      "skills.cloud": "Cloud & DevOps",
      "skills.tools": "Tools & Platforms",
      
      // About section
      "about.title": "About Me",
      "about.subtitle": "Passionate software engineer with expertise in full-stack development, data science, and machine learning",
      "about.currentFocus": "Current Focus",
      "about.focusDescription": "Graduate studies in Software Engineering with research in privacy leak detection and AI applications",
      "about.education": "Education",
      "about.educationSubtitle": "Academic journey in engineering and computer science",
      "about.relevantCoursework": "Relevant Coursework:",
      "about.gpa": "GPA:",
      
      // Certifications section
      "certifications.title": "Certifications",
      "certifications.subtitle": "Continuous learning and professional development in cutting-edge technologies",
      "certifications.completed": "Completed",
      "certifications.inProgress": "In Progress",
      
      // Hobbies section
      "hobbies.title": "Hobbies & Interests",
      "hobbies.subtitle": "Beyond coding, I enjoy exploring creativity and learning through various activities",
      
      // Contact section
      "contact.title": "Get In Touch",
      "contact.subtitle": "Currently seeking opportunities in software engineering, data science, and machine learning. Let's connect!",
      "contact.letsConnect": "Let's Connect",
      "contact.description": "I'm actively seeking opportunities where I can grow as a software engineer while contributing to cutting-edge projects in full-stack development, AI/ML, or cloud computing. Currently working on privacy research at RIT and always excited to discuss new opportunities and collaborations.",
      "contact.currentStatus": "Current Status",
      "contact.available": "Available for full-time opportunities",
      "contact.currentRole": "Graduate Assistant at RIT (Current)",
      "contact.graduation": "Master's in Software Engineering (Dec 2025)",
      "contact.sendMessage": "Send a Message",
      "contact.firstName": "First Name",
      "contact.lastName": "Last Name",
      "contact.email": "Email",
      "contact.subject": "Subject",
      "contact.message": "Message",
      "contact.messagePlaceholder": "Tell me about your project or opportunity...",
      "contact.sendButton": "Send Message",
      "contact.firstNamePlaceholder": "Your first name",
      "contact.lastNamePlaceholder": "Your last name",
      "contact.emailPlaceholder": "your.email@example.com",
      "contact.subjectPlaceholder": "What's this about?",
      
      // Common
      "language": "Language",
      "theme": "Theme",
      "light": "Light",
      "dark": "Dark"
    }
  },
  es: {
    translation: {
      // Navigation
      "about": "Acerca de",
      "experience": "Experiencia",
      "projects": "Proyectos", 
      "skills": "Habilidades",
      "certifications": "Certificaciones",
      "hobbies": "Pasatiempos",
      "contact": "Contacto",
      
      // Hero section
      "hero.title": "Love Jayesh Ahir",
      "hero.roles": ["Ingeniero de Software", "Analista de Datos", "Desarrollador Full Stack", "Ingeniero de ML", "Investigador de Privacidad", "Solucionador de Problemas"],
      "hero.description": "Asistente de Posgrado en Ingeniería de Software en RIT, especializado en detección de fugas de privacidad, seguridad de aplicaciones móviles y desarrollo full-stack con integración de aprendizaje automático.",
      "hero.downloadResume": "Descargar CV",
      "hero.viewProjects": "Ver Proyectos",
      
      // Experience section
      "experience.title": "Experiencia",
      "experience.subtitle": "Trayectoria profesional en ingeniería de software, investigación y aprendizaje automático",
      "experience.achievements": "Logros Clave:",
      
      // Projects section
      "projects.title": "Proyectos Destacados",
      "projects.subtitle": "Mostrando soluciones innovadoras en dominios web, móviles y de aprendizaje automático",
      "projects.allCategory": "Todos",
      "projects.webApp": "Aplicación Web",
      "projects.mobileApp": "Aplicación Móvil",
      "projects.machineLearning": "Aprendizaje Automático",
      "projects.dataAnalysis": "Análisis de Datos",
      "projects.publication": "Publicación",
      "projects.features": "Características Clave:",
      
      // Skills section
      "skills.title": "Habilidades Técnicas",
      "skills.programming": "Lenguajes de Programación y Conceptos",
      "skills.dataScience": "Ciencia de Datos y Análisis",
      "skills.databases": "Bases de Datos e Ingeniería de Datos",
      "skills.frameworks": "Frameworks y Tecnologías",
      "skills.cloud": "Nube y DevOps",
      "skills.tools": "Herramientas y Plataformas",
      
      // About section
      "about.title": "Acerca de Mí",
      "about.subtitle": "Ingeniero de software apasionado con experiencia en desarrollo full-stack, ciencia de datos y aprendizaje automático",
      "about.currentFocus": "Enfoque Actual",
      "about.focusDescription": "Estudios de posgrado en Ingeniería de Software con investigación en detección de fugas de privacidad y aplicaciones de IA",
      "about.education": "Educación",
      "about.educationSubtitle": "Trayectoria académica en ingeniería y ciencias de la computación",
      "about.relevantCoursework": "Cursos Relevantes:",
      "about.gpa": "GPA:",
      
      // Certifications section
      "certifications.title": "Certificaciones",
      "certifications.subtitle": "Aprendizaje continuo y desarrollo profesional en tecnologías de vanguardia",
      "certifications.completed": "Completado",
      "certifications.inProgress": "En Progreso",
      
      // Hobbies section
      "hobbies.title": "Pasatiempos e Intereses",
      "hobbies.subtitle": "Más allá de la programación, disfruto explorando la creatividad y aprendiendo a través de varias actividades",
      
      // Contact section
      "contact.title": "Ponte en Contacto",
      "contact.subtitle": "Actualmente buscando oportunidades en ingeniería de software, ciencia de datos y aprendizaje automático. ¡Conectemos!",
      "contact.letsConnect": "Conectemos",
      "contact.description": "Estoy buscando activamente oportunidades donde pueda crecer como ingeniero de software mientras contribuyo a proyectos de vanguardia en desarrollo full-stack, AI/ML o computación en la nube. Actualmente trabajando en investigación de privacidad en RIT y siempre emocionado de discutir nuevas oportunidades y colaboraciones.",
      "contact.currentStatus": "Estado Actual",
      "contact.available": "Disponible para oportunidades de tiempo completo",
      "contact.currentRole": "Asistente de Posgrado en RIT (Actual)",
      "contact.graduation": "Maestría en Ingeniería de Software (Dic 2025)",
      "contact.sendMessage": "Enviar un Mensaje",
      "contact.firstName": "Nombre",
      "contact.lastName": "Apellido",
      "contact.email": "Correo",
      "contact.subject": "Asunto",
      "contact.message": "Mensaje",
      "contact.messagePlaceholder": "Cuéntame sobre tu proyecto u oportunidad...",
      "contact.sendButton": "Enviar Mensaje",
      "contact.firstNamePlaceholder": "Tu nombre",
      "contact.lastNamePlaceholder": "Tu apellido",
      "contact.emailPlaceholder": "tu.correo@ejemplo.com",
      "contact.subjectPlaceholder": "¿De qué se trata?",
      
      // Common
      "language": "Idioma",
      "theme": "Tema",
      "light": "Claro",
      "dark": "Oscuro"
    }
  },
  fr: {
    translation: {
      // Navigation
      "about": "À propos",
      "experience": "Expérience",
      "projects": "Projets",
      "skills": "Compétences", 
      "certifications": "Certifications",
      "hobbies": "Loisirs",
      "contact": "Contact",
      
      // Hero section
      "hero.title": "Love Jayesh Ahir",
      "hero.roles": ["Ingénieur Logiciel", "Analyste de Données", "Développeur Full Stack", "Ingénieur ML", "Chercheur en Confidentialité", "Résolveur de Problèmes"],
      "hero.description": "Assistant Diplômé en Génie Logiciel au RIT, spécialisé dans la détection de fuites de confidentialité, la sécurité des applications mobiles et le développement full-stack avec intégration d'apprentissage automatique.",
      "hero.downloadResume": "Télécharger CV",
      "hero.viewProjects": "Voir Projets",
      
      // Experience section
      "experience.title": "Expérience",
      "experience.subtitle": "Parcours professionnel en génie logiciel, recherche et apprentissage automatique",
      "experience.achievements": "Réalisations Clés:",
      
      // Projects section
      "projects.title": "Projets Vedettes",
      "projects.subtitle": "Présentation de solutions innovantes dans les domaines web, mobile et d'apprentissage automatique",
      "projects.allCategory": "Tous",
      "projects.webApp": "Application Web",
      "projects.mobileApp": "Application Mobile",
      "projects.machineLearning": "Apprentissage Automatique",
      "projects.dataAnalysis": "Analyse de Données",
      "projects.publication": "Publication",
      "projects.features": "Caractéristiques Clés:",
      
      // Skills section
      "skills.title": "Compétences Techniques",
      "skills.programming": "Langages de Programmation et Concepts",
      "skills.dataScience": "Science des Données et Analyse",
      "skills.databases": "Bases de Données et Ingénierie des Données",
      "skills.frameworks": "Frameworks et Technologies",
      "skills.cloud": "Cloud et DevOps",
      "skills.tools": "Outils et Plateformes",
      
      // About section
      "about.title": "À Propos de Moi",
      "about.subtitle": "Ingénieur logiciel passionné avec expertise en développement full-stack, science des données et apprentissage automatique",
      "about.currentFocus": "Focus Actuel",
      "about.focusDescription": "Études supérieures en Génie Logiciel avec recherche en détection de fuites de confidentialité et applications IA",
      "about.education": "Éducation",
      "about.educationSubtitle": "Parcours académique en ingénierie et informatique",
      "about.relevantCoursework": "Cours Pertinents:",
      "about.gpa": "GPA:",
      
      // Certifications section
      "certifications.title": "Certifications",
      "certifications.subtitle": "Apprentissage continu et développement professionnel dans les technologies de pointe",
      "certifications.completed": "Terminé",
      "certifications.inProgress": "En Cours",
      
      // Hobbies section
      "hobbies.title": "Loisirs et Intérêts",
      "hobbies.subtitle": "Au-delà de la programmation, j'aime explorer la créativité et apprendre à travers diverses activités",
      
      // Contact section
      "contact.title": "Entrer en Contact",
      "contact.subtitle": "Actuellement à la recherche d'opportunités en génie logiciel, science des données et apprentissage automatique. Connectons-nous!",
      "contact.letsConnect": "Connectons-nous",
      "contact.description": "Je recherche activement des opportunités où je peux grandir en tant qu'ingénieur logiciel tout en contribuant à des projets de pointe en développement full-stack, AI/ML ou cloud computing. Travaillant actuellement sur la recherche en confidentialité au RIT et toujours excité de discuter de nouvelles opportunités et collaborations.",
      "contact.currentStatus": "Statut Actuel",
      "contact.available": "Disponible pour des opportunités à temps plein",
      "contact.currentRole": "Assistant Diplômé au RIT (Actuel)",
      "contact.graduation": "Master en Génie Logiciel (Déc 2025)",
      "contact.sendMessage": "Envoyer un Message",
      "contact.firstName": "Prénom",
      "contact.lastName": "Nom",
      "contact.email": "Email",
      "contact.subject": "Sujet",
      "contact.message": "Message",
      "contact.messagePlaceholder": "Parlez-moi de votre projet ou opportunité...",
      "contact.sendButton": "Envoyer Message",
      "contact.firstNamePlaceholder": "Votre prénom",
      "contact.lastNamePlaceholder": "Votre nom",
      "contact.emailPlaceholder": "votre.email@exemple.com",
      "contact.subjectPlaceholder": "De quoi s'agit-il?",
      
      // Common
      "language": "Langue",
      "theme": "Thème", 
      "light": "Clair",
      "dark": "Sombre"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;