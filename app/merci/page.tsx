import type { Metadata } from "next";
import Link from "next/link";
import { calculer, euros, nettoyer, STATUTS, type Reponses } from "@/lib/calcul";
import { dateDeHausse, messageEmail, messageSms } from "@/lib/argumentaire";
import { stripe, type SessionStripe } from "@/lib/stripe";
import { CONTACT_EMAIL, GARANTIE_JOURS } from "@/lib/site";
import Copier from "./Copier";

export const metadata: Metadata = {
  title: "Ton plan — Tarif Juste",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

// Le plan ne s'affiche que si Stripe confirme lui-même que le paiement est encaissé.
async function sessionPayee(id: string | undefined) {
  if (!id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const s = await stripe<SessionStripe>(`checkout/sessions/${id}`);
    return s.payment_status === "paid" ? s : null;
  } catch {
    return null;
  }
}

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await sessionPayee(session_id);

  if (!session) {
    return (
      <main className="mx-auto max-w-xl px-4 pt-16 pb-12">
        <h1 className="font-titre text-3xl font-extrabold">Paiement non confirmé.</h1>
        <p className="mt-3 text-lg text-gris">
          Nous n'avons pas trouvé de paiement validé pour ce lien. Si ta carte a été débitée,
          écris à {CONTACT_EMAIL} : ton plan te sera envoyé sous 24 h.
        </p>
        <Link
          href="/calcul"
          className="mt-8 flex h-14 w-full items-center justify-center rounded-lg bg-encre font-semibold text-white"
        >
          Revenir au calcul
        </Link>
      </main>
    );
  }

  let r: Reponses;
  try {
    r = nettoyer(JSON.parse(session.metadata.r ?? "{}") as Partial<Reponses>);
  } catch {
    r = nettoyer({});
  }
  const res = calculer(r);
  const date = dateDeHausse();
  const email = messageEmail(r.tarifActuel, res.tarifConseille, date);
  const sms = messageSms(res.tarifConseille, date);
  const gainAnnuel = (res.tarifConseille - r.tarifActuel) * res.jours;

  return (
    <main className="mx-auto max-w-xl px-4 pt-6 pb-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-facture">Paiement confirmé</p>
      <h1 className="mt-3 font-titre text-[1.9rem] font-extrabold leading-tight">
        Voilà ton plan. Il est à toi.
      </h1>
      <p className="mt-3 text-gris">
        Garde cette page dans tes favoris : ce lien reste ton accès.
        {session.customer_details?.email
          ? ` Le reçu est parti à ${session.customer_details.email}.`
          : ""}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border-2 border-encre bg-white p-4">
          <p className="text-sm font-medium text-gris">Tarif plancher</p>
          <p className="chiffre mt-1 text-3xl font-extrabold">{euros(res.tarifPlancher)}</p>
          <p className="mt-1 text-sm text-gris">Jamais en dessous.</p>
        </div>
        <div className="rounded-lg border-2 border-facture bg-white p-4">
          <p className="text-sm font-medium text-gris">Tarif conseillé</p>
          <p className="chiffre mt-1 text-3xl font-extrabold text-facture">
            {euros(res.tarifConseille)}
          </p>
          <p className="mt-1 text-sm text-gris">Ton nouveau prix.</p>
        </div>
      </div>

      {gainAnnuel > 0 && (
        <p className="mt-4 rounded-lg border-l-4 border-facture bg-white px-4 py-3 text-lg">
          En passant de {euros(r.tarifActuel)} à {euros(res.tarifConseille)}, tu gagnes{" "}
          <strong className="chiffre text-facture">{euros(gainAnnuel)}</strong> de plus par an,
          sans travailler un jour de plus.
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-titre text-2xl font-extrabold">Ton email d'annonce</h2>
        <p className="mt-1 text-sm text-gris">
          Remplace [Ton prénom], puis envoie-le à chaque client. Un mois de préavis est prévu.
        </p>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-trait bg-white p-4 font-texte text-[0.95rem] leading-relaxed">
          {email}
        </pre>
        <Copier texte={email} />
      </section>

      <section className="mt-10">
        <h2 className="font-titre text-2xl font-extrabold">La version courte, pour SMS</h2>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-trait bg-white p-4 font-texte text-[0.95rem] leading-relaxed">
          {sms}
        </pre>
        <Copier texte={sms} />
      </section>

      <section className="mt-10">
        <h2 className="font-titre text-2xl font-extrabold">Le calcul détaillé</h2>
        <dl className="mt-3 divide-y divide-trait rounded-lg border border-trait bg-white">
          {[
            ["Revenu voulu", `${euros(r.netMensuelVoulu)} / mois`],
            ["Jours réellement facturables", `${res.jours} jours / an`],
            ["Statut", STATUTS[r.statut].libelle],
            ["Cotisations", `${Math.round(STATUTS[r.statut].taux * 1000) / 10} %`],
            ["Frais professionnels", `${euros(r.fraisMensuels)} / mois`],
            ["Ce que tu gagnes aujourd'hui", `${euros(Math.max(0, res.netMensuelActuel))} / mois`],
            ["Tarif plancher", euros(res.tarifPlancher)],
            ["Tarif conseillé (+ 20 % de marge)", euros(res.tarifConseille)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-gris">{k}</dt>
              <dd className="chiffre text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-gris">
          Estimation sur les taux de cotisations 2026, hors impôt sur le revenu.
        </p>
      </section>

      <p className="mt-10 text-sm text-gris">
        Pas convaincu ? Tu as {GARANTIE_JOURS} jours pour être remboursé : écris à {CONTACT_EMAIL}.
      </p>
    </main>
  );
}
