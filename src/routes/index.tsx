import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { MenuSection } from "@/components/site/MenuSection";
import { SpecialMenu } from "@/components/site/SpecialMenu";
import { Gallery } from "@/components/site/Gallery";
import { Reviews } from "@/components/site/Reviews";
import { Reservation } from "@/components/site/Reservation";
import { Events } from "@/components/site/Events";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { Newsletter } from "@/components/site/Newsletter";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <MenuSection compact />
      <SpecialMenu />
      <Gallery compact />
      <Reviews />
      <Reservation />
      <Events />
      <InstagramFeed />
      <Newsletter />
      <Contact />
    </>
  );
}
