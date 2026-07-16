import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Maison Noir Café" },
      {
        name: "description",
        content:
          "Our story, our roastery, our people. Thirteen years of a quiet obsession with the perfect pour.",
      },
      { property: "og:title", content: "About — Maison Noir" },
      { property: "og:description", content: "A quiet obsession with the perfect pour." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="Thirteen years of quiet mornings."
        subtitle="How a converted printworks became a second home."
      />
      <About />
      <Features />
    </>
  );
}
