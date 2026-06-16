import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/portfolio";
import { buildMailtoUrl, type ContactForm } from "@/lib/mailto";

export { buildMailtoUrl };
export type { ContactForm };

const links = [
  { icon: Mail, label: "Email", value: "lahir1269@gmail.com", href: "mailto:lahir1269@gmail.com" },
  { icon: Github, label: "GitHub", value: "github.com/la3679", href: "https://github.com/la3679" },
  { icon: Linkedin, label: "LinkedIn", value: "Love Jayesh Ahir", href: "https://www.linkedin.com/in/love-jayesh-ahir-188356290/" },
  { icon: MapPin, label: "Location", value: "Rochester, NY", href: "#" },
];

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailtoUrl(profile.email, form);
  };

  const field =
    "w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-aurora-violet/60";

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something worth shipping"
          description="I'm open to software engineering and research roles, and always happy to talk through an interesting problem."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="space-y-3"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card-glow group flex items-center gap-4 rounded-2xl glass p-4"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-aurora-violet/10 text-aurora-violet">
                  <l.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {l.label}
                  </div>
                  <div className="text-sm font-medium text-foreground transition-colors group-hover:text-aurora-violet">
                    {l.value}
                  </div>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-colors group-hover:text-aurora-violet" />
              </a>
            ))}

            <div className="rounded-2xl border border-aurora-emerald/25 bg-aurora-emerald/5 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-aurora-emerald">
                <span className="h-2 w-2 animate-pulse-ring rounded-full bg-aurora-emerald" />
                Available now
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Recently completed my M.S. at RIT (Dec 2025). Seeking full-time
                roles in software engineering, applied AI, and privacy research.
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="space-y-4 rounded-2xl glass-strong p-6"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the role or project…"
                className={`${field} resize-none`}
              />
            </div>
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-6 py-3 text-sm font-semibold text-background shadow-glow transition-transform hover:scale-[1.01]"
            >
              <Send className="h-4 w-4" />
              Send message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
