// Appels à l'API Stripe sans bibliothèque : la clé secrète ne quitte jamais le serveur.
export async function stripe<T = Record<string, unknown>>(
  chemin: string,
  params?: Record<string, string>
): Promise<T> {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("STRIPE_SECRET_KEY manquante");
  const rep = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${cle}`,
      ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
    cache: "no-store",
  });
  const json = await rep.json();
  if (!rep.ok) throw new Error(json?.error?.message ?? `Stripe ${rep.status}`);
  return json as T;
}

export type SessionStripe = {
  id: string;
  url: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  metadata: Record<string, string>;
  customer_details: { email: string | null } | null;
};
