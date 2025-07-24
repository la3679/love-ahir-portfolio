import { Github, ExternalLink, Calendar, Code, Smartphone, Globe, Brain, BarChart3, FolderOpen, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(new Set());
  const projectRefs = useRef([]);

  const projectCategories = {
    "Web App": { icon: Globe, color: "tech-cyan", bgColor: "bg-tech-cyan/10" },
    "Mobile App": { icon: Smartphone, color: "tech-pink", bgColor: "bg-tech-pink/10" },
    "Machine Learning": { icon: Brain, color: "accent-bright", bgColor: "bg-accent-bright/10" },
    "Data Analysis": { icon: BarChart3, color: "neon-green", bgColor: "bg-neon-green/10" }
  };

  const projects = [
    {
      title: "Pokémon MongoDB Web Application",
      period: "Flask, ReactJS, MongoDB, Google Maps API",
      github: "github.com/la3679/Pok-dex",
      description: "Built a full-stack Pokémon web app with a feature-rich Pokédex, turn-based battle game, and real-world sightings map.",
      features: [
        "Implemented Flask REST APIs and MongoDB with 2dsphere indexing for geospatial queries; used GridFS to manage over 296,000 sightings and Pokémon images.",
        "Enhanced user interaction using React components, React Router, and Axios for seamless navigation and dynamic data rendering."
      ],
      type: "Web App"
    },
    {
      title: "Price Compare Plus",
      period: "Flask, React Native, PostgreSQL, ML",
      github: "github.com/la3679/Price-Compare-Plus",
      description: "Co-developed 'Price Compare Plus', a full-stack mobile app that aggregates and compares prices from Amazon, Walmart, and eBay to help users find the best deals.",
      features: [
        "Implemented the backend using Python Flask and PostgreSQL; set up RESTful APIs for product search, user authentication, and category management.",
        "Built the frontend using React Native for cross-platform compatibility and smooth user experience.",
        "Integrated API mocking and unit tests using Python's unittest and unittest.mock, ensuring reliable API response handling and improving test coverage."
      ],
      type: "Mobile App"
    },
    {
      title: "NutriKit – Dietary Management App",
      period: "Python Flask, ReactJS, PostgreSQL",
      github: "https://github.com/la3679/Nutrikit",
      description: "Engineered a feature-rich dietary application for personalized meal planning and nutritional analysis, simplifying meal preparation and fostering healthy eating habits.",
      features: [
        "Leveraged ReactJS for a responsive interface and Flask for robust API integration, achieving a 75% reduction in planning time and a 90% satisfaction rate."
      ],
      type: "Web App"
    },
    {
      title: "Sentiment Analysis App",
      period: "AWS Comprehend, Flask, ReactJS",
      github: "https://github.com/la3679/AmazonProduct-Review-Sentiment-Analysis",
      description: "Developed a sophisticated platform for real-time sentiment evaluation, empowering users with actionable insights from product reviews.",
      features: [
        "Integrated AWS Comprehend for advanced text analysis and ReactJS for interactive dashboards, achieving 95% accuracy and reducing decision-making time by 60%."
      ],
      type: "Machine Learning"
    },
    {
      title: "Analyzing Amazon Sales Data",
      period: "Python, Power BI, Data Science",
      github: "https://github.com/la3679/Data-Analytics-Projects",
      description: "Performed ETL on large Amazon sales datasets and identified sales trends month-wise, year-wise, and year-month-wise.",
      features: [
        "Engineered Power BI dashboards visualizing KPIs like Total Revenue, Total Profit, Unit Sold, and revealing sales insights by region, item type, and order priority.",
        "Conducted in-depth analysis of cost-profit relationships, sales channels, and seasonal patterns, enabling 15% more informed business decisions."
      ],
      type: "Data Analysis"
    }
  ];

  const filterOptions = ["All", ...Object.keys(projectCategories)];
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.type === selectedCategory);

  useEffect(() => {
    const observers = new Map();
    
    projectRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleProjects(prev => new Set([...prev, index]));
              }
            });
          },
          { threshold: 0.1, rootMargin: "50px" }
        );
        observer.observe(ref);
        observers.set(index, observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [filteredProjects]);

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-background to-muted/20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-tech-cyan bg-clip-text text-transparent">
              Featured Projects
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of innovative solutions spanning web development, mobile apps, and machine learning
          </p>
        </div>

        {/* Project Filter Bar */}
        <div className="flex justify-center mb-12">
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-2 shadow-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-primary ml-2" />
              {filterOptions.map((option) => {
                const isActive = selectedCategory === option;
                const config = option === "All" 
                  ? { color: "primary", bgColor: "bg-primary/10" }
                  : projectCategories[option];
                
                return (
                  <button
                    key={option}
                    onClick={() => setSelectedCategory(option)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? `bg-${config.color} text-background shadow-[0_0_20px_hsl(var(--${config.color})/0.5)]` 
                        : `${config.bgColor} text-${config.color} hover:bg-${config.color}/20`
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const categoryConfig = projectCategories[project.type];
            const IconComponent = categoryConfig.icon;
            const isVisible = visibleProjects.has(index);
            
            return (
              <div 
                key={project.title}
                ref={el => projectRefs.current[index] = el}
                className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-${categoryConfig.color}/50 transition-all duration-700 hover:shadow-[0_0_30px_hsl(var(--${categoryConfig.color})/0.3)] hover:scale-105 group ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                {/* Project Type Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryConfig.bgColor} border border-${categoryConfig.color}/30 mb-4`}>
                  <IconComponent className={`h-4 w-4 text-${categoryConfig.color}`} />
                  <span className={`text-sm font-medium text-${categoryConfig.color}`}>{project.type}</span>
                </div>
                
                {/* Project Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-tech-cyan" />
                      <span className="text-tech-cyan font-medium text-sm">{project.period}</span>
                    </div>
                    {project.github && (
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-tech-pink" />
                        <a 
                          href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tech-pink text-sm hover:text-accent-bright transition-colors duration-300 hover:underline"
                        >
                          View Repository
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {project.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {project.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className={`flex items-start gap-2 text-muted-foreground text-xs transition-all duration-300 ${
                          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                        }`}
                        style={{ 
                          transitionDelay: isVisible ? `${featureIndex * 100}ms` : '0ms'
                        }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${categoryConfig.color} mt-1.5 flex-shrink-0`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effects */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${categoryConfig.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;