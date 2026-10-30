import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-16 pb-12">
      <p className="chiffre text-6xl font-extrabold text-facture">404</p>
      <h1 className="mt-4 font-titre text-3xl font-extrabold">Cette page n'existe pas.</h1>
      <p className="mt-3 text-lg text-gris">Le lien est peut-être incomplet. Le calcul, lui, t'attend.</p>
      <Link
        href="/"
        className="mt-8 flex h-14 w-full items-center justify-center rounded-lg bg-encre font-semibold text-white"
      >
        Revenir à l'accueil
      </Link>
    </main>
  );
}
