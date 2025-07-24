import { Code, Database, Cloud, Wrench, Brain, Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Skills = () => {
  const [visibleCategories, setVisibleCategories] = useState(new Set());
  const categoryRefs = useRef([]);

  const skillCategories = [
    {
      title: "Programming Languages & Concepts",
      skills: ["Python", "Java", "C", "C++", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3", "R", "MATLAB", "Data Structures", "Algorithms", "OOP", "Full Stack Development", "JSON", "XML", "API Design", "Web Scraping", "Agile Methodologies", "Scrum Framework", "UI/UX Principles"],
      color: "tech-cyan",
      icon: Code
    },
    {
      title: "Data Science & Analytics",
      skills: ["Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn", "Power BI", "Tableau", "Jupyter Notebooks", "AWS Comprehend", "Elasticsearch", "Data Visualization", "Data Cleaning", "EDA", "A/B Testing", "Regression Modeling", "Time Series Forecasting", "Data Mining"],
      color: "accent-bright",
      icon: Brain
    },
    {
      title: "Databases & Data Engineering",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "DynamoDB", "Neo4j", "Redis", "GraphQL", "GridFS", "Database Replication", "2dsphere Indexing", "Data Pipeline Automation"],
      color: "tech-pink",
      icon: Database
    },
    {
      title: "Frameworks & Technologies",
      skills: ["React.js", "React Native", "Flask", "Node.js", "Spring Boot", "Bootstrap", "D3.js", "TailwindCSS", "jQuery", "REST APIs", "GraphQL APIs", "WebSockets", "AWS Lambda", "S3", "Docker", "GitHub", "GitLab", "CI/CD Pipelines", "Android SDK"],
      color: "tech-cyan",
      icon: Wrench
    },
    {
      title: "Cloud & DevOps",
      skills: ["AWS Lambda", "AWS S3", "AWS DynamoDB", "AWS Comprehend", "Google Cloud Platform", "GCP Maps API", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Infrastructure as Code", "Monitoring and Logging", "Cloud Security"],
      color: "accent-bright",
      icon: Cloud
    },
    {
      title: "Tools & Platforms",
      skills: ["Figma", "Adobe After Effects", "Microsoft Excel", "Trello", "Notion", "VS Code", "IntelliJ IDEA", "Android Studio", "Visual Studio", "AutoCAD", "Microsoft PowerPoint", "OneDrive"],
      color: "tech-pink",
      icon: Palette
    }
  ];

  useEffect(() => {
    const observers = new Map();
    
    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleCategories(prev => new Set([...prev, index]));
                }, index * 200);
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(ref);
        observers.set(index, observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-muted/20 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            Technical Skills
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            const isVisible = visibleCategories.has(categoryIndex);
            return (
              <div 
                key={category.title}
                ref={el => categoryRefs.current[categoryIndex] = el}
                className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-700 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-105 group ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-${category.color}/20 group-hover:bg-${category.color}/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <IconComponent className={`h-6 w-6 text-${category.color} transition-transform duration-500 group-hover:scale-110`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 bg-${category.color}/10 text-${category.color} rounded-lg text-sm font-medium border border-${category.color}/20 hover:bg-${category.color}/20 hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--${category.color})/0.4)] transition-all duration-300 cursor-default transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ 
                        animationDelay: `${categoryIndex * 200 + skillIndex * 100}ms`,
                        transitionDelay: isVisible ? `${skillIndex * 50}ms` : '0ms'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;