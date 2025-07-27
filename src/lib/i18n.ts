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
      "hero.roles": ["Software Engineer", "Data Analyst", "Full Stack Developer", "Machine Learning Engineer", "Privacy Researcher", "Problem Solver"],
      "hero.description": "Graduate Assistant in Software Engineering at RIT, specializing in privacy leak detection, mobile app security, and full-stack development with machine learning integration.",
      "hero.downloadResume": "Download Resume",
      "hero.viewProjects": "View Projects",
      
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