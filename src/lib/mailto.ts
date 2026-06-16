export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

/**
 * Pure helper: build a safe mailto: URL from contact-form fields.
 * Extracted from the UI so it can be unit-tested in isolation.
 */
export function buildMailtoUrl(to: string, form: ContactForm): string {
  const subject = encodeURIComponent(
    `Portfolio inquiry from ${form.name || "a visitor"}`,
  );
  const body = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
