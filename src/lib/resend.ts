// src/lib/resend.ts

export type SendResendArgs = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

// Ne JAMAIS instancier Resend au top-level (build-safe)
export async function sendResendEmail(args: SendResendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Au runtime sans clé -> on lève ; pendant le build, ce code n'est jamais exécuté.
    throw new Error("RESEND_API_KEY is not set");
  }
  // Import dynamique pour éviter tout chargement au build
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  return resend.emails.send(args);
}

// Optionnel mais pratique : export par défaut aussi
export default sendResendEmail;
