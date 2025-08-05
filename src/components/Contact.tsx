import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "lahir1269@gmail.com",
      href: "mailto:lahir1269@gmail.com",
      color: "tech-cyan"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Rochester, NY",
      href: "#",
      color: "accent-bright"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/lovejayesh",
      href: "https://github.com",
      color: "tech-pink"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/lovejayesh",
      href: "https://linkedin.com",
      color: "tech-cyan"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-muted/20 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-accent-bright">{t('contact.letsConnect')}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('contact.description')}
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent-bright/30 transition-all duration-300 hover:shadow-neon hover:scale-105 group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${contact.color}/10 to-${contact.color}/5 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-5 w-5 text-${contact.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{contact.label}</p>
                      <p className="text-muted-foreground group-hover:text-accent-bright transition-colors">
                        {contact.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Current Status */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-bright/10 to-tech-cyan/10 border border-accent-bright/20 animate-slide-up animation-delay-400">
              <h4 className="text-lg font-semibold text-accent-bright mb-3">{t('contact.currentStatus')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{t('contact.available')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-tech-cyan rounded-full"></div>
                  <span>{t('contact.currentRole')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-bright rounded-full"></div>
                  <span>{t('contact.graduation')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up animation-delay-300">
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent-bright/30 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-tech-cyan">{t('contact.sendMessage')}</h3>
              
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const subject = encodeURIComponent(formData.get('subject') as string || 'Contact from Portfolio');
                  const body = encodeURIComponent(
                    `Name: ${formData.get('firstName')} ${formData.get('lastName')}\n` +
                    `Email: ${formData.get('email')}\n\n` +
                    `Message: ${formData.get('message')}`
                  );
                  window.open(`mailto:lahir1269@gmail.com?subject=${subject}&body=${body}`);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.firstName')}
                    </label>
                    <Input 
                      name="firstName"
                      placeholder={t('contact.firstNamePlaceholder')}
                      className="bg-background/50 border-border/50 focus:border-accent-bright"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.lastName')}
                    </label>
                    <Input 
                      name="lastName"
                      placeholder={t('contact.lastNamePlaceholder')}
                      className="bg-background/50 border-border/50 focus:border-accent-bright"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.email')}
                  </label>
                  <Input 
                    name="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    className="bg-background/50 border-border/50 focus:border-accent-bright"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.subject')}
                  </label>
                  <Input 
                    name="subject"
                    placeholder={t('contact.subjectPlaceholder')}
                    className="bg-background/50 border-border/50 focus:border-accent-bright"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.message')}
                  </label>
                  <Textarea 
                    name="message"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    className="bg-background/50 border-border/50 focus:border-accent-bright resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-gradient-to-r from-accent-bright to-tech-cyan hover:from-accent-bright/80 hover:to-tech-cyan/80 text-white shadow-neon"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {t('contact.sendButton')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;