import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { GoogleGenAI } from "@google/genai";
import { DbReservation } from "./db-service";

let isListening = false;

function cleanHtml(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```html")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

function getDefaultTemplate(reservation: DbReservation): string {
  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #12100E; color: #F4EBE1; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #C5A880; border-radius: 8px;">
      <h2 style="color: #C5A880; border-bottom: 1px solid #C5A880; padding-bottom: 20px; font-weight: 300; font-size: 28px; text-transform: uppercase; tracking: 0.1em; text-align: center;">Maison Noir Café</h2>
      <p style="font-size: 16px; line-height: 1.6; text-align: center;">Cher ${reservation.name},</p>
      <p style="font-size: 15px; line-height: 1.6; text-align: center;">We have successfully received your reservation request at Velvet Brew Studio / Maison Noir. Our hosts are preparing a table for your visit.</p>
      
      <div style="background-color: #1C1917; padding: 24px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #C5A880;">
        <h3 style="margin-top: 0; color: #C5A880; font-size: 18px; font-weight: 500;">Your Reservation Details</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #A8A29E; width: 35%;">Guests:</td>
            <td style="padding: 6px 0; color: #F4EBE1; font-weight: bold;">${reservation.guests} Guests</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #A8A29E;">Date:</td>
            <td style="padding: 6px 0; color: #F4EBE1; font-weight: bold;">${reservation.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #A8A29E;">Time:</td>
            <td style="padding: 6px 0; color: #F4EBE1; font-weight: bold;">${reservation.time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #A8A29E;">Occasion:</td>
            <td style="padding: 6px 0; color: #F4EBE1;">${reservation.occasion}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #A8A29E;">Special Notes:</td>
            <td style="padding: 6px 0; color: #F4EBE1; font-style: italic;">${reservation.notes || "None"}</td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #A8A29E; text-align: center;">
        Your booking is currently <strong>pending host confirmation</strong>. We will send a confirmation notification shortly.
      </p>
      
      <p style="font-size: 14px; margin-top: 40px; text-align: center; color: #C5A880;">
        With warm regards,<br>
        <span style="font-size: 16px; font-weight: 500;">La Direction, Maison Noir Café</span>
      </p>
    </div>
  `;
}

export async function triggerEmailConfirmation(docId: string, reservation: DbReservation) {
  const docRef = doc(db, "reservations", docId);

  let emailBody = "";
  let isGeminiGenerated = false;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      console.log(`Generating personalized email for ${reservation.name} using Gemini API...`);
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the automated email concierge for Velvet Brew Studio / Maison Noir Café, a premium Parisian-inspired coffee shop and bistro.
Generate a beautiful, personalized, and warm HTML email confirmation to a customer who has just submitted a table reservation.

Customer Details:
- Name: ${reservation.name}
- Email: ${reservation.email}
- Date: ${reservation.date}
- Time: ${reservation.time}
- Number of guests: ${reservation.guests}
- Occasion: ${reservation.occasion}
- Special Notes: ${reservation.notes || "None"}

The email should be written in an elegant, sophisticated yet warm tone.
Include the reservation details clearly formatted.
Write it in high-quality HTML styled inline with elegant styling (e.g., dark slate background #12100E with gold #C5A880 accents, deep warm charcoal text, serif fonts, generous spacing) so that it looks incredibly premium.
Ensure there are no external dependencies and it's a self-contained HTML email body starting from an elegant header banner and ending with a signature from the Maison Noir team.
Only output the HTML email content inside a markdown code block, or return it directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const rawText = response.text || "";
      emailBody = cleanHtml(rawText);
      isGeminiGenerated = true;
      console.log("Personalized email generated successfully via Gemini.");
    } catch (err) {
      console.error("Failed to generate email via Gemini, falling back to default template:", err);
    }
  }

  if (!emailBody) {
    emailBody = getDefaultTemplate(reservation);
  }

  try {
    // 1. Simulate sending the email (log to console / mock sender since we don't have mail relay credentials)
    console.log("================================================================================");
    console.log(`[EMAIL DISPATCH] To: ${reservation.email}`);
    console.log(`[EMAIL DISPATCH] Subject: Table Reservation Received — Maison Noir Café`);
    console.log("--------------------------------------------------------------------------------");
    console.log("Email Body Preview (HTML content):");
    console.log(emailBody);
    console.log("================================================================================");

    // 2. Update the Firestore document to record successful completion of email confirmation
    await updateDoc(docRef, {
      emailSent: true,
      emailSentAt: new Date().toISOString(),
      confirmationEmailBody: emailBody,
      emailMethod: isGeminiGenerated ? "Gemini AI" : "System Template",
    });

    console.log(
      `Firebase Background Listener: Successfully updated reservation ${docId} with email confirmation log.`,
    );
  } catch (err) {
    console.error(`Failed to update reservation doc ${docId} with email status:`, err);
  }
}

export function startReservationListener() {
  if (isListening) return;
  isListening = true;

  console.log("Firebase Background Listener: Starting reservation email monitor...");

  const colRef = collection(db, "reservations");

  let isInitialLoad = true;

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      // If it's the initial load, we don't trigger emails for existing items
      if (isInitialLoad) {
        console.log(`Firebase Background Listener: Loaded ${snapshot.size} existing reservations.`);
        isInitialLoad = false;
        return;
      }

      const changes = snapshot.docChanges();
      for (const change of changes) {
        if (change.type === "added") {
          const docId = change.doc.id;
          const reservation = change.doc.data();

          if (!reservation.emailSent) {
            console.log(
              `Firebase Background Listener: Detected new reservation for ${reservation.name} (ID: ${docId}). Triggering email...`,
            );
            await triggerEmailConfirmation(docId, reservation);
          }
        }
      }
    },
    (error) => {
      console.error("Firebase Background Listener Error: ", error);
      isListening = false;
      // Retry after some time
      setTimeout(startReservationListener, 10000);
    },
  );

  return unsubscribe;
}
