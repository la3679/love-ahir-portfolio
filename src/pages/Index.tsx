import Seo from "@/components/Seo";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedWork from "@/components/FeaturedWork";
import Capabilities from "@/components/Capabilities";
import CredentialsPreview from "@/components/CredentialsPreview";
import ResearchNote from "@/components/ResearchNote";
import { LatticeProvider } from "@/components/lattice/LatticeProvider";

/**
 * Home page — integrated "Ember Systems Observatory" (IMPLEMENTATION.md §33).
 *
 * Approved order: hero → proof strip → about with the real photograph →
 * experience → featured projects led by Pokédex → technical capabilities →
 * credentials and education → compact research. Contact and Footer close the
 * page from the Layout shell.
 *
 * Experience deliberately precedes projects: a recruiter reads where the work
 * happened before what was built.
 *
 * `HeroSystemsVideo` is mounted by Hero inside its real observatory stage. It
 * paints its poster frame immediately and needs no capability gate, so no
 * section depends on a renderer for meaning, layout or legibility. The
 * provider stays: the sections below still register with it so the stage's
 * technology rails settle when the reader scrolls past the hero.
 */
const Index = () => {
  return (
    <LatticeProvider>
      <Seo
        title="Love Ahir — Software Engineer | Full-Stack, Backend & Applied AI"
        description="Software engineer with 4+ years building reliable backends, full-stack products, cloud systems, and applied AI across financial services and enterprise platforms."
        path="/"
      />
      <Hero />
      <ProofStrip />
      <AboutSection />
      <ExperienceSection />
      <FeaturedWork />
      <Capabilities />
      <CredentialsPreview />
      <ResearchNote />
    </LatticeProvider>
  );
};

export default Index;
