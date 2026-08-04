import { useEffect } from "react";

export const SITE_URL = "https://loveahir.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/preview.png`;

/**
 * Brand assets declared in index.html. Listed here so a test can assert every
 * referenced file actually exists in public/ and nothing silently 404s.
 */
export const BRAND_ASSETS = [
  "/favicon.svg",
  "/favicon-32.png",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/preview.png",
  "/twitter_preview.png",
] as const;

interface SeoProps {
  /** Page title; the site suffix is appended automatically. */
  title: string;
  /** Meta + OG description. Kept in English — the canonical SEO locale. */
  description: string;
  /** Route path starting with "/", used for the canonical + og:url. */
  path: string;
  /** Absolute URL of the OG image; falls back to the site-wide preview. */
  ogImage?: string;
  /** Optional JSON-LD payload rendered as a script tag. */
  jsonLd?: object;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Injects a JSON-LD script identified by `id`, replacing any previous one.
 * Returns a cleanup that removes it again.
 */
export function injectJsonLd(id: string, payload: object): () => void {
  document.getElementById(id)?.remove();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(payload);
  document.head.appendChild(script);
  return () => script.remove();
}

/**
 * Per-route document metadata, written directly to <head>. Every page
 * renders exactly one <Seo>; the static tags in index.html act as the
 * server-rendered defaults and are updated in place on navigation.
 */
const Seo = ({ title, description, path, ogImage, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const fullTitle = path === "/" ? title : `${title} — Love Ahir`;

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertLink("canonical", url);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:image", ogImage ?? DEFAULT_OG_IMAGE);
    upsertMeta("name", "twitter:card", "summary_large_image");

    if (jsonLd) {
      return injectJsonLd("seo-page-jsonld", jsonLd);
    }
    document.getElementById("seo-page-jsonld")?.remove();
  }, [fullTitle, description, url, ogImage, jsonLd]);

  return null;
};

/** Site-wide Person schema, injected once from the layout. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Love Jayesh Ahir",
  alternateName: "Love Ahir",
  url: SITE_URL,
  jobTitle: "Software Engineer",
  description:
    "Software engineer with 4+ years building production backend, full-stack, and applied AI systems across financial services and enterprise platforms.",
  // Only technologies with a documented work or project achievement behind
  // them. Skills-list-only tools stay out of the structured data.
  knowsAbout: [
    "Software Engineering",
    "Backend Development",
    "Full-Stack Development",
    "Python",
    "Java",
    "TypeScript",
    "FastAPI",
    "Spring Boot",
    "React",
    "PostgreSQL",
    "Apache Kafka",
    "AWS",
    "Google Cloud Platform",
    "CI/CD",
    "Retrieval-Augmented Generation",
    "Applied Machine Learning",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Rochester Institute of Technology",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "LJ Institute of Engineering and Technology",
    },
  ],
  sameAs: [
    "https://github.com/la3679",
    "https://www.linkedin.com/in/love-jayesh-ahir-188356290/",
  ],
};

export default Seo;
