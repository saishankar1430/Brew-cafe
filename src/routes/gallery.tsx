import { createFileRoute } from "@tanstack/react-router";
import { Gallery } from "@/components/site/Gallery";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Maison Noir Café" },
      {
        name: "description",
        content: "Photographs from a real Tuesday. Warm light, quiet corners, hands at work.",
      },
      { property: "og:title", content: "Gallery — Maison Noir" },
      { property: "og:description", content: "Moments, softly lit." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments, softly lit."
        subtitle="Everything you see here happened on a real Tuesday."
      />
      <Gallery />
      <InstagramFeed />
    </>
  );
}
