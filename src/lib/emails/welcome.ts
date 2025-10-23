// src/lib/emails/welcome.ts
import { PLANS, type PlanId } from "@/data/plans";

export function welcomeEmailHTML(opts: { email?: string; plan: PlanId }) {
  const plan = PLANS[opts.plan];
  const safeEmail = (opts.email || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bienvenue — Hashem Productions</title>
    <style>
      body {
        margin: 0;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        background: #0b0b0c;
        color: #e8e8ea;
      }
      .wrap {
        max-width: 560px;
        margin: 0 auto;
        padding: 24px;
      }
      .card {
        background: #111214;
        border: 1px solid #1e1f23;
        border-radius: 14px;
        padding: 24px;
      }
      .h1 {
        font-size: 22px;
        font-weight: 800;
        margin: 0 0 6px;
      }
      .muted {
        color: #b3b3b8;
      }
      .btn {
        display: inline-block;
        background: #d4a72c;
        color: #111214;
        text-decoration: none;
        font-weight: 700;
        padding: 12px 18px;
        border-radius: 12px;
        margin-top: 14px;
      }
      .sep {
        height: 1px;
        background: #1e1f23;
        margin: 20px 0;
      }
      .foot {
        font-size: 12px;
        color: #8b8b90;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="h1">Bienvenue sur Hashem Productions</div>
        <p class="muted">
          Votre offre <strong>${plan.name}</strong> est activée${
            safeEmail ? ` pour <strong>${safeEmail}</strong>` : ""
          }.
        </p>
        <a class="btn" href="https://hashemproductions.com/">Accéder à la plateforme</a>
        <div class="sep"></div>
        <p class="foot">
          Vous pouvez gérer votre abonnement à tout moment dans votre espace compte.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

export default welcomeEmailHTML;
