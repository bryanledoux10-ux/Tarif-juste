import { createHmac, timingSafeEqual } from "node:crypto";

// Stripe appelle cette adresse à chaque paiement. On vérifie la signature :
// seul Stripe, qui connaît le secret, peut produire un appel valide.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook non configuré", { status: 500 });

  const corps = await req.text();
  const entete = req.headers.get("stripe-signature") ?? "";
  const morceaux = Object.fromEntries(
    entete.split(",").map((p) => p.split("=") as [string, string])
  );
  const horodatage = Number(morceaux.t);
  const signature = morceaux.v1 ?? "";

  const attendue = createHmac("sha256", secret).update(`${morceaux.t}.${corps}`).digest("hex");
  const valide =
    signature.length === attendue.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(attendue)) &&
    Math.abs(Date.now() / 1000 - horodatage) < 300;
  if (!valide) return new Response("Signature invalide", { status: 400 });

  const evenement = JSON.parse(corps) as {
    type: string;
    data: { object: { id: string; payment_status?: string; customer_details?: { email?: string } } };
  };

  if (evenement.type === "checkout.session.completed") {
    const s = evenement.data.object;
    console.log(
      `Paiement confirmé : ${s.id} (${s.payment_status}) — ${s.customer_details?.email ?? "sans email"}`
    );
    // Étape suivante : envoi automatique du plan par email.
  }

  return new Response("ok");
}
