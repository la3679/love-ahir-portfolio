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