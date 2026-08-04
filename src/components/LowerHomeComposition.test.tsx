import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/lib/i18n";
import { homeExperiences, education } from "@/data/portfolio";
import { homeCredentials } from "@/data/credentials";
import { featuredCaseStudies } from "@/data/caseStudies";
import ExperienceSection from "./ExperienceSection";
import Capabilities from "./Capabilities";
import CredentialsPreview from "./CredentialsPreview";
import FeaturedWork from "./FeaturedWork";

const renderWithRouter = (component: React.ReactNode) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
});

describe("recruiter-focused lower-home composition", () => {
  it("shows one strongest outcome per preview role while keeping dates and stacks", () => {
    renderWithRouter(<ExperienceSection />);

    for (const role of homeExperiences) {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: new RegExp(role.company, "i"),
      });
      const row = heading.closest("li");
      expect(row).not.toBeNull();
      const scoped = within(row!);

      expect(scoped.getByText(role.period)).toBeInTheDocument();
      expect(scoped.getByText(i18n.t(role.achievementKeys[0]))).toBeInTheDocument();
      if (role.achievementKeys[1]) {
        expect(scoped.queryByText(i18n.t(role.achievementKeys[1]))).toBeNull();
      }
      for (const tag of role.tags) {
        expect(scoped.getByText(tag)).toBeInTheDocument();
      }
      if (role.current) {
        expect(scoped.getByText(i18n.t("experience.current"))).toBeInTheDocument();
      }
    }
  });

  it("renders the five evidence-backed capability rows without proficiency UI", () => {
    const { container } = render(<Capabilities />);
    const capabilityIds = ["fullstack", "backend", "ai", "data", "quality"] as const;

    for (const id of capabilityIds) {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: i18n.t(`capabilities.${id}.title`),
      });
      const row = heading.closest("li");
      expect(row).not.toBeNull();
      expect(within(row!).getByText(i18n.t(`capabilities.${id}.body`))).toBeInTheDocument();
    }

    expect(container.querySelector('[role="progressbar"]')).toBeNull();
  });

  it("keeps all curated credentials and both education records in the split preview", () => {
    renderWithRouter(<CredentialsPreview />);

    for (const credential of homeCredentials) {
      expect(screen.getByText(credential.title)).toBeInTheDocument();
    }
    for (const entry of education) {
      expect(screen.getByText(entry.degree)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(entry.institution))).toBeInTheDocument();
    }
  });

  it("keeps Pokédex as the lead artifact and bounds all three supporting projects", () => {
    renderWithRouter(<FeaturedWork />);

    expect(screen.getByRole("figure")).toHaveTextContent(featuredCaseStudies[0].project);
    for (const study of featuredCaseStudies.slice(1)) {
      const heading = screen.getByRole("heading", { level: 3, name: study.project });
      const card = heading.closest("li");
      expect(card).not.toBeNull();
      expect(card).toHaveClass("depth-hover", "rounded-xl", "border");
      expect(card).toHaveTextContent(study.metrics[0].value);
      expect(
        within(card!).getByRole("link", {
          name: new RegExp(i18n.t("home.work.viewCase"), "i"),
        }),
      ).toBeVisible();
    }
  });
});
