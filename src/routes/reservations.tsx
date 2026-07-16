import { createFileRoute } from "@tanstack/react-router";
import { Reservation } from "@/components/site/Reservation";
import { Events } from "@/components/site/Events";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations — Maison Noir Café" },
      {
        name: "description",
        content: "Reserve a corner. We confirm every booking personally within thirty minutes.",
      },
      { property: "og:title", content: "Reservations — Maison Noir" },
      { property: "og:description", content: "Save a corner for you." },
    ],
  }),
  component: ReservationsPage,
});

function ReservationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Save a corner for you."
        subtitle="Booking takes under a minute."
      />
      <Reservation />
      <Events />
    </>
  );
}
