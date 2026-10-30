"use client";

import { useState } from "react";
import Link from "next/link";
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
  const maj = (champ: Partial<Reponses>) => setR((prec) => ({ ...prec, ...champ }));

  const suivant = () => {
    setEtape((e) => e + 1);
    window.scrollTo({ top: 0 });
  };
  const retour = () => {
    setEtape((e) => Math.max(0, e - 1));
    window.scrollTo({ top: 0 });
  };

  if (etape >= ETAPES) return <Resultat r={r} recommencer={() => setEtape(0)} />;

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
          <p className="mt-3">
            Je vous remercie pour la confiance que vous m'accordez. Pour continuer à vous offrir
            le même niveau de qualité, mon tarif journalier évoluera à partir du mois prochain.
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

      <div className="mt-8 rounded-lg bg-encre p-5 text-white">
        <p className="font-titre text-2xl font-extrabold">Ton plan est prêt.</p>
        <p className="mt-2 text-white/80">
          Tarif conseillé, message de hausse complet et calcul détaillé, envoyés par email.
        </p>
        <p className="mt-4 flex h-14 items-center justify-center rounded-lg bg-white/15 text-center font-semibold">
          Paiement disponible très bientôt
        </p>
      </div>

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
