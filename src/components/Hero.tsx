import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowDown, Github, Linkedin, Mail, Download, Code, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import TypingAnimation from "./TypingAnimation";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);

  const scrollToProjects = () => {
    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
      projectsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Create fewer floating tech icons for better performance
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      icon: [Code, Github, Sparkles, Zap][i % 4],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.8,
      duration: 6 + Math.random() * 2,
      scale: 0.9 + Math.random() * 0.2
    }));
    setFloatingElements(elements);

    const handleMouseMove = (e) => {
      // Throttle mouse movement for better performance
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent-bright/10 overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating tech elements */}
        {floatingElements.map((element) => {
          const IconComponent = element.icon;
          return (
            <div
              key={element.id}
              className="absolute opacity-30 animate-float hover:opacity-60 transition-opacity duration-300"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`,
                transform: `scale(${element.scale})`,
                willChange: 'transform, opacity'
              }}
            >
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
          );
        })}
        
        {/* Optimized gradient orbs */}
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-primary/20 to-tech-cyan/20 blur-2xl transition-transform duration-700 ease-out"
          style={{
            left: mousePosition.x * 0.02 + '%',
            top: mousePosition.y * 0.02 + '%',
            transform: `translate(-50%, -50%)`,
            willChange: 'transform'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-tech-pink/15 to-accent-bright/15 blur-2xl transition-transform duration-1000 ease-out"
          style={{
            right: mousePosition.x * 0.015 + '%',
            bottom: mousePosition.y * 0.015 + '%',
            transform: `translate(50%, 50%)`,
            willChange: 'transform'
          }}
        />
        
        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary/30 rotate-45 animate-spin-slow opacity-20" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-tech-cyan/40 animate-bounce-slow opacity-30" />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-accent-bright/20 to-tech-pink/20 rounded-full animate-orbit" />
        
        {/* Floating code snippets with glow */}
        <div className="absolute top-20 left-10 opacity-15 animate-float font-mono text-sm text-primary animate-glow">
          const passion = "unlimited";
        </div>
        <div className="absolute bottom-20 right-10 opacity-15 animate-float font-mono text-sm text-tech-cyan animate-glow" style={{ animationDelay: '1s' }}>
          while(coding) inspire();
        </div>
        <div className="absolute top-1/2 left-5 opacity-15 animate-float font-mono text-sm text-accent-bright animate-glow" style={{ animationDelay: '2s' }}>
          {"{ innovation: 'always' }"}
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-15 animate-float font-mono text-sm text-tech-pink animate-glow" style={{ animationDelay: '3s' }}>
          async function dream() {`{ await reality; }`}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Profile Image */}
          <div className="w-36 h-36 mx-auto mb-8 rounded-full bg-gradient-to-r from-accent-bright to-tech-cyan p-1 animate-zoom-in animate-glow relative">
            <div className="w-full h-full rounded-full relative overflow-hidden">
              <img 
                src={profilePhoto} 
                alt="Love Jayesh Ahir" 
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-spin-slow" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-tech-cyan rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-accent-bright rounded-full -translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-foreground">
              {t('hero.title')}
            </span>
          </h1>
          
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up animation-delay-200">
            <span>I'm a </span>
            <TypingAnimation 
              words={t('hero.roles', { returnObjects: true }) as string[]}
              typeSpeed={150}
              deleteSpeed={100}
              delayBetweenWords={2000}
            />
          </div>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-300">
            {t('hero.description')}
          </p>

          {/* Enhanced Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slide-up animation-delay-400">
            <a href="mailto:lahir1269@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-accent-bright transition-all duration-300 hover:scale-110 animate-glow">
              <Mail className="h-5 w-5" />
              lahir1269@gmail.com
            </a>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up animation-delay-500">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-accent-bright to-tech-cyan hover:from-accent-bright/80 hover:to-tech-cyan/80 text-white shadow-neon hover:shadow-glow transition-all duration-300 hover:scale-105 animate-glow relative overflow-hidden group"
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://drive.google.com/uc?export=download&id=1parlrLtVSyYPkcCMVykO-SaqH-JHRLsM';
                link.download = 'Love_Jayesh_Ahir_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Download className="mr-2 h-5 w-5" />
              {t('hero.downloadResume')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToProjects}
              className="border-accent-bright text-accent-bright hover:bg-accent-bright hover:text-white transition-all duration-300 hover:scale-105 animate-glow"
            >
              {t('hero.viewProjects')}
            </Button>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex justify-center gap-6 animate-slide-up animation-delay-600">
            <a href="https://github.com/la3679" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent-bright/50 hover:shadow-glow transition-all duration-300 group hover:scale-110 animate-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-bright/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Github className="h-6 w-6 text-muted-foreground group-hover:text-accent-bright transition-colors relative z-10" />
            </a>
            <a href="https://www.linkedin.com/in/love-jayesh-ahir-188356290/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-tech-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 group hover:scale-110 animate-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-tech-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-tech-cyan transition-colors relative z-10" />
            </a>
            <a href="mailto:lahir1269@gmail.com" className="p-4 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-tech-pink/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-300 group hover:scale-110 animate-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-tech-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Mail className="h-6 w-6 text-muted-foreground group-hover:text-tech-pink transition-colors relative z-10" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;