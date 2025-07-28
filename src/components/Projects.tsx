import { Github, ExternalLink, Calendar, Code, Smartphone, Globe, Brain, BarChart3, FolderOpen, Filter, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(new Set());
  const projectRefs = useRef([]);

  const projectCategories = {
    "Web App": { icon: Globe, color: "tech-cyan", bgColor: "bg-tech-cyan/10" },
    "Mobile App": { icon: Smartphone, color: "tech-pink", bgColor: "bg-tech-pink/10" },
    "Machine Learning": { icon: Brain, color: "accent-bright", bgColor: "bg-accent-bright/10" },
    "Data Analysis": { icon: BarChart3, color: "neon-green", bgColor: "bg-neon-green/10" },
    "Publication": { icon: BookOpen, color: "primary", bgColor: "bg-primary/10" }
  };

  const projects = [
     {
      title: "AR Application Testing Automation Tool",
      period: "Appium (Python/JavaScript), iOS, Android",
      github: "", // GitHub URL not specified in the chat
      description: "Developing a tool to automate testing for Augmented Reality (AR) applications. It focuses on checking how AR objects behave during user interactions across different apps, automating dragging, dropping, and pinching AR objects to test their movement, placement, and resizing. It supports real devices, emulators, custom test scenarios, and integration with tools like BrowserStack for enhanced testing. Initial progress includes successfully automating basic interactions within an AR application, connecting to the app, navigating initial menus, and dismissing on-screen advice. This project is currently in progress.",
      features: [
        "Automates dragging, dropping, and pinching AR objects.",
        "Tests movement, placement, and resizing of AR objects.",
        "Supports AR apps on both iOS and Android platforms.",
        "Compatible with real devices and emulators.",
        "Enables custom test scenarios and integration with tools like BrowserStack.",
        "Successfully connected to an AR app, navigated initial menus, and dismissed on-screen advice using Appium."
      ],
      type: "Machine Learning"
    },
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
      period: "AWS Comprehend, Flask, HTML, CSS, JavaScript",
      github: "https://github.com/la3679/AmazonProduct-Review-Sentiment-Analysis",
      description: "Developed a sophisticated platform for real-time sentiment evaluation of Amazon product reviews, empowering users with actionable insights.",
      features: [
        "Integrated AWS Comprehend for advanced text analysis.",
        "Frontend built with HTML, CSS, JavaScript, and Bootstrap for interactive dashboards.",
        "Backend powered by Python Flask.",
        "Analyzes sentiment (positive, negative, neutral) from product reviews."
      ],
      type: "Machine Learning"
    },
    {
      title: "Car Sales Network Visualization",
      period: "Neo4j, D3.js, Python",
      github: "https://github.com/la3679/Car-Sales-Network-Visualization", // Assuming a GitHub repo based on the name format
      description: "A project focused on visualizing a large car sales network using Neo4j and D3.js, representing relationships between Buyers, Cars, and Countries. The data includes over 1 million records.",
      features: [
        "Cleaned and loaded over 1M records into Neo4j, ensuring uniqueness constraints for Buyers, Cars, and Countries.",
        "Created a D3.js based frontend for dynamic graph visualization and custom Cypher queries.",
        "Demonstrates complex relationships such as buyers linked through cars sold in the same country."
      ],
      type: "Web App"
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
    },
    {
      title: "RIT Apiary Project",
      period: "MongoDB, Python",
      github: "https://github.com/la3679/RIT-Apiary-Project", // Assuming a GitHub repo based on the name format
      description: "A project focused on loading and managing apiary data into a MongoDB time series collection for analysis. It handles data cleaning, missing values, and efficient storage.",
      features: [
        "Script to clean column names, handle missing values, and store data as a time series collection in MongoDB.",
        "Connects to MongoDB and creates a time series collection with `timestamp` and `metadata.hive_id`.",
        "Processes multiple CSV files, cleaning and importing data efficiently."
      ],
      type: "Data Analysis"
    },
    {
      title: "RIT Library Service Tracker",
      period: "Java, Design Patterns (Visitor)",
      github: "https://github.com/la3679/LibraryServiceTrackerRIT",
      description: "This application demonstrates the usage of the Visitor pattern to model various library services offered at the Rochester Institute of Technology (RIT), allowing users to interact and view detailed information.",
      features: [
        "Showcases the Visitor design pattern for flexible and extensible service management.",
        "Separates service actions from service objects, simplifying modifications and additions.",
        "Provides detailed information about each library service."
      ],
      type: "Web App" // Categorized as Web App since it's an application showcasing functionality.
    },
    {
      title: "Weather Forecast Project",
      period: "OpenWeatherMap API, Python",
      github: "https://github.com/la3679/Weather-Forecast-Project", // Assuming a GitHub repo based on the name format
      description: "A project that generates daily weather forecasts for selected cities in the UK, India, and the US by retrieving real-time data from the OpenWeatherMap API and visualizing it.",
      features: [
        "Retrieves real-time temperature and humidity data for predefined cities.",
        "Visualizes weather forecasts in a well-designed image format.",
        "Outputs are saved as both PNG and PDF files for sharing and archiving."
      ],
      type: "Data Analysis" // Categorized as Data Analysis due to focus on data retrieval and visualization/reporting.
    },
    {
      title: "Meme Analyzer",
      period: "Flask, HTML, CSS, JavaScript, EasyOCR, Google GenAI",
      github: "https://github.com/la3679/Meme-Analyzer", // Assuming a GitHub repo based on the name format
      description: "A fun and interactive web application that allows users to upload a meme image and a chat file to analyze the meme using OCR and Google GenAI for detailed explanations.",
      features: [
        "Extracts text from meme images using EasyOCR.",
        "Analyzes memes using Google GenAI to determine meme type, sentiment, and generate humorous explanations.",
        "User-friendly interface for uploading images and chat files."
      ],
      type: "Machine Learning"
    },

    {
      title: "CodeGuard: Automated Review Solution",
      period: "Research Project",
      github: "https://drive.google.com/file/d/1UgmPaxPO00T3QkmT6q7O4NUmrp3UcC2m/view?usp=sharing", // Retaining original GitHub if no new one is provided in the PDF
      description: "Introduces a transformative approach to the traditional code review process within software development by integrating advanced machine learning algorithms and automated tools. It aims to autonomously analyze source code, rigorously ensuring code quality and security compliance while proactively identifying and addressing vulnerabilities and errors.",
      features: [
        "Significantly enhances the speed, accuracy, and consistency of code reviews.",
        "Optimizes developer productivity and reduces error rates.",
        "Aims to mitigate the subjectivity associated with human reviews and to standardize the assessment criteria across different development teams and projects."
      ],
      type: "Publication"
    },
     {
      title: "Automated Test Oracle Generation using Neural Methods",
      period: "Research Paper",
      github: "https://github.com/pateljheel/swen777-rp-toga", // No GitHub provided in the PDF
      description: "Addresses the significant challenge of automated test oracle generation in software testing. It uses advanced machine learning techniques (TOGA) to create test oracles that help detect bugs by predicting the expected behavior of the software under test. The paper replicates the original TOGA approach and introduces an enhancement by including the method implementations during the training process of assertion oracle inference.",
      features: [
        "Replicates the original TOGA approach to make a strong baseline for future improvements.",
        "Investigates whether having access to more detailed information about the methods can lead to better test oracle predictions and improved bug detection.",
        "Uses a transformer-based model to generate two types of test oracles: exceptional oracles and assertion oracles."
      ],
      type: "Publication"
    },
    {
      title: "An In-Depth Analysis of the Failure of the London Ambulance Service's Computer-Aided Dispatch System",
      period: "Research Case Study, 1992 (Failure Year)",
      github: "https://drive.google.com/file/d/1ubVAt6MUKOvj-QRprD8_JI5fafnaTs1J/view?usp=sharing", // No GitHub provided in the PDF
      description: "This case study provides an in-depth analysis of the failure that occurred in the London Ambulance Service Computer-Aided Despatch (LASCAD) system in 1992. The LASCAD project was delayed by 9 months and failed within 2 weeks. The analysis identifies absent practices, poor design decisions, and architectural approaches that could have been implemented differently to prevent the failure.",
      features: [
        "Provides an overview of LASCAD from an architectural perspective and explains which architectural decisions contributed to the system's failure.",
        "Identifies absent practices, poor design decisions, and architectural approaches that could have been implemented differently to prevent the failure.",
        "Discusses improvements in software development workflows that aim to enhance outcomes for businesses and customers.",
        "Highlights the importance of studying software system failures to gain critical insights and improve the reliability of software systems."
      ],
      type: "Publication"
    },
    {
      title: "Comprehensive Analysis of Pro-Government Vote Prediction in ECtHR Using Machine Learning",
      period: "Research Paper",
      github: "https://drive.google.com/file/d/1iid_soqeaXz8JJlYstiQIq-jKYuM33BQ/view?usp=sharing", // No GitHub provided in the PDF
      description: "This study presents a comprehensive machine learning pipeline to predict pro-government votes in the European Court of Human Rights (ECtHR). It combines structured metadata and semantic legal text embeddings.",
      features: [
        "Applies four classification algorithms: Logistic Regression, Support Vector Machines (SVM), Random Forest, and XGBoost.",
        "Ensemble XGBoost models significantly outperform others, achieving a validation accuracy of 95.93% and test accuracy of over 90.53%.",
        "Provides detailed data analysis, explains modeling techniques, and evaluates model performance."
      ],
      type: "Publication"
    },
    {
      title: "Supermarket Sales Data Analysis",
      period: "Power BI, Data Analysis",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A comprehensive Power BI dashboard providing insights into supermarket sales data, offering analysis of sales trends and product performance.",
      features: [
        "Analyzes sales trends and product performance.",
        "Part of a diverse collection of Power BI dashboards and projects."
      ],
      type: "Data Analysis"
    },
    {
      title: "Profit Dashboard",
      period: "Power BI, Financial Analysis",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "An executive-level financial snapshot dashboard focusing on gross profit analysis and sales trends within Power BI.",
      features: [
        "Focuses on gross profit analysis and sales trends.",
        "Provides an executive-level financial overview."
      ],
      type: "Data Analysis"
    },
    {
      title: "KPI Drill-Down Dashboard",
      period: "Power BI, Performance Metrics",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A Power BI KPI drill-down dashboard presenting detailed metrics and performance indicators for in-depth analysis.",
      features: [
        "Presents detailed metrics and performance indicators.",
        "Designed for in-depth analysis."
      ],
      type: "Data Analysis"
    },
    {
      title: "Revenue Trend Analyzer",
      period: "Power BI, Revenue Analysis",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A Power BI dashboard that visualizes revenue growth and patterns over time, serving as a revenue trend analyzer.",
      features: [
        "Visualizes revenue growth and patterns over time.",
        "Analyzes revenue trends."
      ],
      type: "Data Analysis"
    },
    {
      title: "GeoSales Sales Heatmap",
      period: "Power BI, Geographic Data",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "This Power BI sales heatmap visualizer uses geographic data to display sales density and distribution.",
      features: [
        "Uses geographic data to display sales density and distribution.",
        "Provides a visual representation of sales hotspots."
      ],
      type: "Data Analysis"
    },
    {
      title: "HumanDev Global Progress Insight",
      period: "Power BI, Development Indicators",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A Power BI global progress insight tool showcasing development indicators across different regions.",
      features: [
        "Showcases development indicators across different regions.",
        "Provides global progress insights."
      ],
      type: "Data Analysis"
    },
    {
      title: "BlinkIt Sales Operations Intelligence",
      period: "Power BI, Grocery Operations",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A Power BI grocery operations intelligence dashboard tracking sales and performance metrics for BlinkIt.",
      features: [
        "Tracks sales and performance metrics for BlinkIt.",
        "Provides intelligence on grocery operations."
      ],
      type: "Data Analysis"
    },
    {
      title: "Prime Video Streaming Content Analyzer",
      period: "Power BI, Streaming Analytics",
      github: "https://github.com/la3679/PowerBI", // Assuming this is part of the broader data analytics repo
      description: "A Power BI streaming content analyzer dashboard providing insights into titles, genres, and user engagement on Prime Video.",
      features: [
        "Provides insights into titles, genres, and user engagement.",
        "Analyzes streaming content on Prime Video."
      ],
      type: "Data Analysis"
    },
    {
      title: "Indian College Recommendation System",
      period: "Internship Project (Java), Jan-May 2023",
      github: "",
      description: "An internship project that involved understanding programming languages, tools, and technologies, along with working on and implementing various modules of a larger project. This work was submitted as part of the requirements for a Bachelor of Engineering degree in Electronics & Communication Engineering.",
      features: [
        "Involved understanding a programming language (Java) and relevant tools & technology.",
        "Worked on different modules of a project.",
        "Implemented project components based on acquired knowledge."
      ],
      type: "Machine Learning"
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
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${categoryConfig.color}/3 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;