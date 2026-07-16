import { createFileRoute } from "@tanstack/react-router";
import { MenuSection } from "@/components/site/MenuSection";
import { SpecialMenu } from "@/components/site/SpecialMenu";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Maison Noir Café" },
      {
        name: "description",
        content:
          "Explore our full menu: signature coffees, teas, breakfast, pastries, desserts, and seasonal specials.",
      },
      { property: "og:title", content: "Menu — Maison Noir Café" },
      {
        property: "og:description",
        content:
          "A short, careful list. Made from scratch, in-house, most of it before you arrive.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Menu"
        title="Everything on the counter."
        subtitle="Sixteen carefully chosen things. Search, filter, decide."
      />
      <MenuSection />
      <SpecialMenu />
    </>
  );
}
