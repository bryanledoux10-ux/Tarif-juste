import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDES = 300;

// Stripe appelle cette adresse à chaque paiement. On vérifie la signature :
// seul Stripe, qui connaît le secret, peut produire un appel valide.
export async function POST(req: Request) {
  // trim() : un espace ou un retour à la ligne collé avec le secret suffit à tout casser.
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!secret) return new Response("Webhook non configuré : STRIPE_WEBHOOK_SECRET absente", { status: 500 });

  const corps = await req.text();
  const entete = req.headers.get("stripe-signature") ?? "";

  let horodatage = "";
  const signatures: string[] = [];
  for (const morceau of entete.split(",")) {
    const i = morceau.indexOf("=");
    if (i < 0) continue;
    const cle = morceau.slice(0, i).trim();
    const valeur = morceau.slice(i + 1).trim();
    if (cle === "t") horodatage = valeur;
    if (cle === "v1") signatures.push(valeur);
  }

  const attendue = Buffer.from(
    createHmac("sha256", secret).update(`${horodatage}.${corps}`, "utf8").digest("hex")
  );
  const signatureOk = signatures.some((s) => {
    const b = Buffer.from(s);
    return b.length === attendue.length && timingSafeEqual(b, attendue);
  });
  const ecart = Math.round(Math.abs(Date.now() / 1000 - Number(horodatage)));

  if (!signatureOk || !(ecart < TOLERANCE_SECONDES)) {
    // Diagnostic visible dans Stripe (onglet de l'événement), sans révéler le secret.
    const diagnostic = [
      `signature ${signatureOk ? "ok" : "refusée"}`,
      `en-tête ${entete ? "présent" : "absent"}`,
      `signatures v1 reçues : ${signatures.length}`,
      `secret commence par whsec_ : ${secret.startsWith("whsec_") ? "oui" : "non"}`,
      `longueur du secret : ${secret.length}`,
      `écart d'horloge : ${ecart} s`,
    ].join(" | ");
    console.error("Webhook refusé :", diagnostic);
    return new Response(`Signature invalide — ${diagnostic}`, { status: 400 });
  }

  const evenement = JSON.parse(corps) as {
    type: string;
    data: { object: { id: string; payment_status?: string; customer_details?: { email?: string } } };
  };

  if (evenement.type === "checkout.session.completed") {
    const s = evenement.data.object;
    console.log(
      `Paiement confirmé : ${s.id} (${s.payment_status}) — ${s.customer_details?.email ?? "sans email"}`
    );
  }

  return new Response("ok");
}
