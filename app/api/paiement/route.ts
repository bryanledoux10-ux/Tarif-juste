import { nettoyer, type Reponses } from "@/lib/calcul";
import { PRIX_EUROS } from "@/lib/site";
import { stripe, type SessionStripe } from "@/lib/stripe";

// Crée la page de paiement Stripe à partir des réponses, validées ici côté serveur.
export async function POST(req: Request) {
  let corps: unknown;
  try {
    corps = await req.json();
  } catch {
    return Response.json({ erreur: "Requête invalide." }, { status: 400 });
  }
  const r = nettoyer((corps ?? {}) as Partial<Reponses>);
  if (r.tarifActuel <= 0 || r.netMensuelVoulu <= 0) {
    return Response.json({ erreur: "Réponses incomplètes." }, { status: 400 });
  }

  const origine = new URL(req.url).origin;
  try {
    const session = await stripe<SessionStripe>("checkout/sessions", {
      mode: "payment",
      locale: "fr",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(PRIX_EUROS * 100),
      "line_items[0][price_data][product_data][name]": "Tarif Juste — ton plan complet",
      "line_items[0][price_data][product_data][description]":
        "Tarif conseillé, message de hausse prêt à envoyer et calcul détaillé.",
      success_url: `${origine}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/calcul?annule=1`,
      "metadata[r]": JSON.stringify(r),
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("Création du paiement impossible :", e);
    return Response.json(
      { erreur: "Le paiement n'a pas pu démarrer. Réessaie dans un instant." },
      { status: 502 }
    );
  }
}
