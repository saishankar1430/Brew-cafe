import { createFileRoute } from "@tanstack/react-router";
import { Reviews } from "@/components/site/Reviews";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Maison Noir Café" },
      {
        name: "description",
        content: "Kind words from writers, architects, and regulars. 4.9 stars from 2,300+ guests.",
      },
      { property: "og:title", content: "Reviews — Maison Noir" },
      { property: "og:description", content: "Kind words from 2,300+ guests." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kind Words"
        title="From the people who linger."
        subtitle="A collection of what regulars have said, in their own words."
      />
      <Reviews />
    </>
  );
}
