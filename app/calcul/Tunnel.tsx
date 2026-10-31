"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dateDeHausse } from "@/lib/argumentaire";
import { CONTACT_EMAIL, GARANTIE_JOURS, PRIX_EUROS } from "@/lib/site";
import {
  DEFAUTS,
  STATUTS,
  calculer,
  euros,
  joursFacturables,
  type Reponses,
  type Statut,
} from "@/lib/calcul";

const ETAPES = 3;

export default function Tunnel() {
  const [etape, setEtape] = useState(0);
  const [r, setR] = useState<Reponses>(DEFAUTS);
  const [annule, setAnnule] = useState(false);
  const maj = (champ: Partial<Reponses>) => setR((prec) => ({ ...prec, ...champ }));

  // Après un paiement annulé, on retrouve les réponses et on revient au résultat.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("annule")) return;
    try {
      const enregistre = sessionStorage.getItem("tj-reponses");
      if (enregistre) {
        setR({ ...DEFAUTS, ...(JSON.parse(enregistre) as Partial<Reponses>) });
        setEtape(ETAPES);
        setAnnule(true);
      }
    } catch {
      /* stockage indisponible : on repart du début */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("tj-reponses", JSON.stringify(r));
    } catch {
      /* stockage indisponible : sans conséquence */
    }
  }, [r]);

  const suivant = () => {
    setEtape((e) => e + 1);
    window.scrollTo({ top: 0 });
  };
  const retour = () => {
    setEtape((e) => Math.max(0, e - 1));
    window.scrollTo({ top: 0 });
  };

  if (etape >= ETAPES)
    return (
      <>
        {annule && (
          <p role="status" className="mx-auto mt-4 max-w-xl px-4">
            <span className="block rounded-lg border-l-4 border-facture bg-white px-4 py-3">
              Paiement annulé : rien n'a été débité. Ton résultat est toujours là.
            </span>
          </p>
        )}
        <Resultat
          r={r}
          recommencer={() => {
            setAnnule(false);
            setEtape(0);
          }}
        />
      </>
    );

  const jours = joursFacturables(r.semainesConges, r.joursNonFactures);
  const reste = Math.round(100 * (1 - STATUTS[r.statut].taux));
  const peutContinuer =
    etape === 0 ? r.tarifActuel > 0 && r.netMensuelVoulu > 0 : true;

  return (
    <main className="mx-auto max-w-xl px-4 pt-6 pb-36">
      <Progression etape={etape} />

      {etape === 0 && (
        <section>
          <Titre>Parlons de ton argent.</Titre>
          <Champ
            label="Aujourd'hui, tu factures combien la journée ?"
            aide="Tu factures à l'heure ou à la prestation ? Ramène-le à une journée de travail."
            valeur={r.tarifActuel}
            suffixe="€ / jour"
            onChange={(v) => maj({ tarifActuel: v })}
          />
          <Champ
            label="Combien veux-tu gagner par mois, dans ta poche ?"
            aide="Ce qui arrive sur ton compte perso, avant impôt sur le revenu."
            valeur={r.netMensuelVoulu}
            suffixe="€ / mois"
            onChange={(v) => maj({ netMensuelVoulu: v })}
          />
        </section>
      )}

      {etape === 1 && (
        <section>
          <Titre>Combien de jours sont vraiment payés ?</Titre>
          <Compteur
            label="Semaines sans travailler par an"
            aide="Vacances, ponts, maladie, enfants malades."
            valeur={r.semainesConges}
            min={0}
            max={12}
            pas={1}
            unite={(v) => (v > 1 ? "semaines" : "semaine")}
            onChange={(v) => maj({ semainesConges: v })}
          />
          <Compteur
            label="Jours par semaine que personne ne te paie"
            aide="Devis, relances, compta, prospection, déplacements."
            valeur={r.joursNonFactures}
            min={0}
            max={3}
            pas={0.5}
            unite={(v) => (v > 1 ? "jours" : "jour")}
            onChange={(v) => maj({ joursNonFactures: v })}
          />
          <Encart>
            Tu factures donc <strong className="chiffre text-facture text-xl">{jours} jours</strong>{" "}
            par an. Pas 220, pas 250.
          </Encart>
        </section>
      )}

      {etape === 2 && (
        <section>
          <Titre>Ce que l'État et tes frais te prennent.</Titre>
          <fieldset className="mt-6">
            <legend className="font-semibold">Ton statut</legend>
            <div className="mt-3 space-y-2">
              {(Object.keys(STATUTS) as Statut[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => maj({ statut: s })}
                  aria-pressed={r.statut === s}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left ${
                    r.statut === s ? "border-encre bg-white" : "border-trait"
                  }`}
                >
                  <span className="block font-semibold">{STATUTS[s].libelle}</span>
                  <span className="block text-sm text-gris">{STATUTS[s].detail}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <Champ
            label="Tes frais professionnels par mois"
            aide="Logiciels, téléphone, assurance, matériel, comptable, véhicule pro."
            valeur={r.fraisMensuels}
            suffixe="€ / mois"
            onChange={(v) => maj({ fraisMensuels: v })}
          />
          <Encart>
            {r.statut === "reel" ? (
              <>
                Sur 100 € de bénéfice, il t'en reste environ{" "}
                <strong className="chiffre text-facture text-xl">{reste} €</strong>.
              </>
            ) : (
              <>
                Sur 100 € facturés, il t'en reste{" "}
                <strong className="chiffre text-facture text-xl">{reste} €</strong> avant même
                tes frais.
              </>
            )}
          </Encart>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-trait bg-papier/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {etape > 0 && (
            <button
              type="button"
              onClick={retour}
              className="h-14 rounded-lg border-2 border-encre px-5 font-semibold"
            >
              Retour
            </button>
          )}
          <button
            type="button"
            onClick={suivant}
            disabled={!peutContinuer}
            className="h-14 flex-1 rounded-lg bg-encre text-lg font-semibold text-white disabled:opacity-40"
          >
            {etape === ETAPES - 1 ? "Voir mon résultat" : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Progression({ etape }: { etape: number }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-facture">
        Question {etape + 1} sur {ETAPES}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {Array.from({ length: ETAPES }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= etape ? "bg-facture" : "bg-trait"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Titre({ children }: { children: React.ReactNode }) {
  return <h1 className="mt-6 font-titre text-[1.9rem] font-extrabold leading-tight">{children}</h1>;
}

function Encart({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 rounded-lg border-l-4 border-facture bg-white px-4 py-3 text-lg leading-snug">
      {children}
    </p>
  );
}

function Champ(props: {
  label: string;
  aide: string;
  valeur: number;
  suffixe: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-6 block">
      <span className="block font-semibold">{props.label}</span>
      <span className="mt-1 block text-sm text-gris">{props.aide}</span>
      <span className="mt-3 flex items-center rounded-lg border-2 border-trait bg-white focus-within:border-encre">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={props.valeur === 0 ? "" : String(props.valeur)}
          onChange={(e) => {
            const chiffres = e.target.value.replace(/\D/g, "").slice(0, 6);
            props.onChange(chiffres ? Number(chiffres) : 0);
          }}
          className="chiffre h-14 w-full min-w-0 bg-transparent px-4 text-2xl font-semibold outline-none"
        />
        <span className="shrink-0 pr-4 text-gris">{props.suffixe}</span>
      </span>
    </label>
  );
}

function Compteur(props: {
  label: string;
  aide: string;
  valeur: number;
  min: number;
  max: number;
  pas: number;
  unite: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const changer = (delta: number) =>
    props.onChange(Math.min(props.max, Math.max(props.min, props.valeur + delta)));
  const affichage = String(props.valeur).replace(".", ",");
  return (
    <div className="mt-6">
      <p className="font-semibold">{props.label}</p>
      <p className="mt-1 text-sm text-gris">{props.aide}</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => changer(-props.pas)}
          disabled={props.valeur <= props.min}
          aria-label="Moins"
          className="h-14 w-14 shrink-0 rounded-lg border-2 border-encre text-2xl font-semibold disabled:opacity-30"
        >
          −
        </button>
        <p className="flex-1 text-center">
          <span className="chiffre text-3xl font-extrabold">{affichage}</span>{" "}
          <span className="text-gris">{props.unite(props.valeur)}</span>
        </p>
        <button
          type="button"
          onClick={() => changer(props.pas)}
          disabled={props.valeur >= props.max}
          aria-label="Plus"
          className="h-14 w-14 shrink-0 rounded-lg border-2 border-encre text-2xl font-semibold disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Resultat({ r, recommencer }: { r: Reponses; recommencer: () => void }) {
  const res = calculer(r);
  const sousLePlancher = r.tarifActuel < res.tarifPlancher;
  const ecartObjectif = r.netMensuelVoulu - res.netMensuelActuel;

  return (
    <main className="mx-auto max-w-xl px-4 pt-6 pb-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-facture">Ton résultat</p>

      {res.perteAnnuelle > 0 ? (
        <>
          <h1 className="mt-3 font-titre text-[1.9rem] font-extrabold leading-tight">
            À {euros(r.tarifActuel)} la journée, {sousLePlancher ? "tu laisses" : "il te manque"}
          </h1>
          <p className="chiffre mt-1 text-5xl font-extrabold text-facture">
            {euros(res.perteAnnuelle)}
          </p>
          <p className="mt-1 text-lg font-semibold">
            {sousLePlancher
              ? "sur la table chaque année, et tu n'atteins pas ton objectif."
              : "de marge par an. Tu atteins ton objectif, mais au premier mois creux, tu passes dessous."}
          </p>
        </>
      ) : (
        <h1 className="mt-3 font-titre text-[1.9rem] font-extrabold leading-tight">
          Bonne nouvelle : à {euros(r.tarifActuel)} la journée, ton tarif tient la route.
        </h1>
      )}

      <div className="mt-6 rounded-lg border border-trait bg-white p-5">
        <p className="text-sm font-medium text-gris">Ce que tu nous as dit</p>
        <ul className="mt-2 space-y-1.5">
          <li>
            Tu veux <strong>{euros(r.netMensuelVoulu)}</strong> par mois dans ta poche.
          </li>
          <li>
            Tu factures réellement <strong>{res.jours} jours</strong> par an.
          </li>
          <li>
            Sur 100 € {r.statut === "reel" ? "de bénéfice" : "facturés"}, il t'en reste{" "}
            <strong>{res.sous100} €</strong>, puis tu paies <strong>{euros(r.fraisMensuels)}</strong>{" "}
            de frais par mois.
          </li>
        </ul>
        <p className="mt-4 border-t border-trait pt-3">
          À ton tarif actuel, tu gagnes en vrai{" "}
          <strong className="chiffre text-xl">{euros(Math.max(0, res.netMensuelActuel))}</strong>{" "}
          par mois
          {ecartObjectif > 0 ? (
            <>
              , soit <strong className="text-facture">{euros(ecartObjectif)} de moins</strong> que
              ton objectif.
            </>
          ) : (
            "."
          )}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border-2 border-encre bg-white p-4">
          <p className="text-sm font-medium text-gris">Tarif plancher</p>
          <p className="chiffre mt-1 text-3xl font-extrabold">{euros(res.tarifPlancher)}</p>
          <p className="mt-1 text-sm text-gris">
            {sousLePlancher ? "Tu factures en dessous." : "Ne descends jamais sous ce prix."}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border-2 border-facture bg-white p-4">
          <p className="text-sm font-medium text-gris">Tarif conseillé</p>
          <p className="chiffre mt-1 text-3xl font-extrabold blur-md select-none" aria-hidden>
            888 €
          </p>
          <p className="mt-1 text-sm font-semibold text-facture">Inclus dans ton plan</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-titre text-2xl font-extrabold">Ton message pour annoncer la hausse</h2>
        <div className="mt-3 rounded-lg border border-trait bg-white p-5 leading-relaxed">
          <p>Bonjour,</p>
          <p className="mt-3">Merci pour la confiance que vous m'accordez dans nos projets.</p>
          <p className="mt-3">
            Je vous informe qu'à partir du {dateDeHausse()}, mon tarif journalier passera de{" "}
            {euros(r.tarifActuel)} à{" "}
            <span className="inline-block blur-sm select-none" aria-hidden>
              888 €
            </span>{" "}
            HT.
          </p>
          <div className="relative mt-3" aria-hidden>
            <div className="space-y-2 blur-sm select-none">
              <p>Ce nouveau tarif reflète le temps réellement consacré à chaque mission ainsi que</p>
              <p>les charges liées à mon activité. Pour les missions déjà engagées, rien ne change</p>
              <p>et je reste disponible pour en parler de vive voix si vous le souhaitez.</p>
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-white/0 to-white" />
          </div>
        </div>
        <p className="mt-3 text-sm text-gris">
          Le message complet, adapté à ton nouveau tarif, avec une version courte pour les SMS.
        </p>
      </section>

      <Paywall r={r} perteAnnuelle={res.perteAnnuelle} />

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <button type="button" onClick={recommencer} className="underline underline-offset-2">
          Modifier mes réponses
        </button>
        <Link href="/" className="text-sm text-gris underline underline-offset-2">
          Retour à l'accueil
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-gris">
        Estimation sur la base des taux de cotisations 2026, hors impôt sur le revenu. Le tarif
        conseillé ajoute 20 % de marge pour les imprévus, les impayés et les mois creux.
      </p>
    </main>
  );
}

const FAQ = [
  {
    q: "Est-ce que ça marche pour mon cas ?",
    r: "Oui si tu factures à la journée, à l'heure ou à la prestation, en micro-entreprise, en entreprise individuelle ou en société. Le calcul part de tes propres chiffres, pas de moyennes.",
  },
  {
    q: "Combien de temps ça me prend ?",
    r: "Ton plan s'affiche dès le paiement validé. Tu copies le message, tu remplaces ton prénom, tu l'envoies : dix minutes en tout.",
  },
  {
    q: "Et si je veux arrêter ?",
    r: `Il n'y a rien à résilier : c'est un paiement unique, pas un abonnement. Et si le plan ne te sert pas, tu as ${GARANTIE_JOURS} jours pour être remboursé.`,
  },
  {
    q: "À quoi sert exactement ce que je paie ?",
    r: "À savoir ton tarif conseillé exact, et à oser l'annoncer : un email complet et une version SMS, déjà rédigés avec tes chiffres, plus le détail du calcul à montrer à ton comptable.",
  },
];

function Paywall({ r, perteAnnuelle }: { r: Reponses; perteAnnuelle: number }) {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const partJournee = Math.max(1, Math.round((PRIX_EUROS / Math.max(1, r.tarifActuel)) * 100));

  const payer = async () => {
    setChargement(true);
    setErreur("");
    try {
      const rep = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      const json = (await rep.json()) as { url?: string; erreur?: string };
      if (!rep.ok || !json.url) throw new Error(json.erreur);
      window.location.href = json.url;
    } catch (e) {
      setErreur(
        e instanceof Error && e.message
          ? e.message
          : "Le paiement n'a pas pu démarrer. Réessaie dans un instant."
      );
      setChargement(false);
    }
  };

  return (
    <section className="mt-8 rounded-lg bg-encre p-5 text-white" aria-label="Débloquer ton plan">
      <p className="font-titre text-2xl font-extrabold">Voilà ton plan, prêt.</p>
      <p className="mt-2 text-white/80">
        Ton tarif conseillé, ton message de hausse complet et le calcul détaillé. Il ne te reste
        qu'à le débloquer pour le garder.
      </p>

      {perteAnnuelle > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-sm text-white/70">Ce que tu perds</p>
            <p className="chiffre text-2xl font-extrabold text-facture">{euros(perteAnnuelle)}</p>
            <p className="text-sm text-white/70">chaque année</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-sm text-white/70">Ton plan</p>
            <p className="chiffre text-2xl font-extrabold">{euros(PRIX_EUROS)}</p>
            <p className="text-sm text-white/70">une seule fois</p>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-lg border-2 border-facture bg-white p-4 text-encre">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-semibold">Plan complet</p>
          <p className="chiffre text-3xl font-extrabold">{euros(PRIX_EUROS)}</p>
        </div>
        <p className="mt-1 text-sm text-gris">
          Soit {partJournee} % d'une seule de tes journées à {euros(r.tarifActuel)}.
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>✓ Ton tarif conseillé exact</li>
          <li>✓ L'email d'annonce et la version SMS, prêts à envoyer</li>
          <li>✓ Le calcul détaillé, à garder</li>
        </ul>
      </div>

      <p className="mt-4 rounded-lg bg-white/10 px-4 py-3 text-sm leading-relaxed">
        <strong>Satisfait ou remboursé pendant {GARANTIE_JOURS} jours.</strong> Écris à{" "}
        {CONTACT_EMAIL} avec l'adresse utilisée pour payer : tu es remboursé sous 48 h, sans
        justification. L'argent réapparaît sur ton compte sous 5 à 10 jours ouvrés selon ta banque.
      </p>

      <button
        type="button"
        onClick={payer}
        disabled={chargement}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-lg bg-facture text-lg font-semibold text-white disabled:opacity-60"
      >
        {chargement ? "Ouverture du paiement…" : `Débloquer mon plan — ${euros(PRIX_EUROS)}`}
      </button>
      <p className="mt-2 text-center text-sm text-white/80">
        Paiement unique, sans abonnement · Carte bancaire sécurisée par Stripe
      </p>
      <p className="mt-2 text-center text-xs leading-relaxed text-white/60">
        En payant, tu acceptes les{" "}
        <Link href="/cgv" className="underline underline-offset-2">
          CGV
        </Link>{" "}
        et demandes l'accès immédiat à ton plan, ce qui met fin au droit de rétractation. La
        garantie {GARANTIE_JOURS} jours satisfait ou remboursé s'applique toujours.
      </p>
      {erreur && (
        <p role="alert" className="mt-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-facture">
          {erreur}
        </p>
      )}

      <div className="mt-6 divide-y divide-white/15 border-t border-white/15">
        {FAQ.map((f) => (
          <details key={f.q} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden justify-between gap-3 font-semibold">
              {f.q}
              <span className="text-facture transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-white/80">{f.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
