import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { Newsletter } from "@/components/site/Newsletter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Maison Noir Café" },
      {
        name: "description",
        content: "Find us on Ashwood Lane. Hours, phone, email, and directions to the café.",
      },
      { property: "og:title", content: "Contact — Maison Noir" },
      { property: "og:description", content: "Find us on Ashwood Lane." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Come say hello."
        subtitle="We're at 24 Ashwood Lane, most days from 7am."
      />
      <Contact />
      <Newsletter />
    </>
  );
}
