import Link from "next/link";

export const metadata = { title: "Le calcul — Tarif Juste" };

export default function Calcul() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-12 pb-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-facture">Étape 1 sur 3</p>
      <h1 className="mt-3 font-titre text-3xl font-extrabold leading-tight">
        Le calcul arrive très bientôt.
      </h1>
      <p className="mt-4 text-lg text-gris">
        Les trois questions sont en cours de préparation. Reviens dans quelques jours.
      </p>
      <Link
        href="/"
        className="mt-8 flex h-14 w-full items-center justify-center rounded-lg border-2 border-encre font-semibold"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
