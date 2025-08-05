import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#", key: "home" },
    { name: t("about"), href: "#about", key: "about" },
    { name: t("experience"), href: "#experience", key: "experience" },
    { name: t("projects"), href: "#projects", key: "projects" },
    { name: t("skills"), href: "#skills", key: "skills" },
    { name: "Expertise", href: "#expertise", key: "expertise" },
    { name: t("certifications"), href: "#certifications", key: "certifications" },
    { name: t("hobbies"), href: "#hobbies", key: "hobbies" },
    { name: t("contact"), href: "#contact", key: "contact" }
  ];

  const scrollToSection = (href: string) => {
    if (href === "#") {
      // Use requestAnimationFrame for smoother scrolling to top
      const startPosition = window.pageYOffset;
      const duration = Math.min(startPosition / 3, 1000); // Max 1s
      let start = null;

      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        // Easing function for smoother animation
        const easeInOutCubic = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition * (1 - easeInOutCubic));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
    } else {
      const element = document.querySelector(href);
      if (element) {
        const offsetTop = (element as HTMLElement).offsetTop - 80; // Account for fixed navbar
        
        // Use requestAnimationFrame for smoother scrolling
        const startPosition = window.pageYOffset;
        const distance = offsetTop - startPosition;
        const duration = Math.min(Math.abs(distance) / 3, 1000); // Max 1s, faster for shorter distances
        let start = null;

        function animate(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          
          // Ultra smooth easing function
          const easeInOutQuint = progress < 0.5 
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;
          
          window.scrollTo(0, startPosition + distance * easeInOutQuint);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }
        
        requestAnimationFrame(animate);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border/50" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
              Love Ahir
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-accent-bright transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-bright transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-muted-foreground hover:text-accent-bright transition-colors duration-300 w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;