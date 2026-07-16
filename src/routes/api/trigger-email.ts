import { createFileRoute } from "@tanstack/react-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { triggerEmailConfirmation } from "@/lib/reservation-email-listener";
import type { DbReservation } from "@/lib/db-service";

export const Route = createFileRoute("/api/trigger-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { reservationId?: string };
          const reservationId = body.reservationId;

          if (!reservationId) {
            return new Response(JSON.stringify({ error: "Missing reservationId" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log(`[API trigger-email] Fetching reservation ${reservationId}...`);
          const docRef = doc(db, "reservations", reservationId);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return new Response(JSON.stringify({ error: "Reservation not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const reservation = docSnap.data() as DbReservation;

          if (reservation.emailSent) {
            return new Response(JSON.stringify({ message: "Email already sent" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log(
            `[API trigger-email] Triggering email confirmation for ${reservation.name}...`,
          );
          await triggerEmailConfirmation(reservationId, reservation);

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("[API trigger-email] Error:", error);
          const errorMsg = error instanceof Error ? error.message : String(error);
          return new Response(JSON.stringify({ error: errorMsg }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
