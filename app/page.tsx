import Link from "next/link";

const benefices = [
  {
    titre: "Ton tarif plancher",
    texte: "Le prix en dessous duquel chaque journée te coûte de l'argent.",
  },
  {
    titre: "Ce que tu perds par an",
    texte: "L'écart entre ce que tu factures et ce que tu devrais facturer, en euros.",
  },
  {
    titre: "Le message pour augmenter",
    texte: "Un texte prêt à envoyer à tes clients pour annoncer ton nouveau tarif.",
  },
];

export default function Accueil() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-8 pb-12">
      <p className="text-sm font-semibold tracking-wide uppercase text-facture">Tarif Juste</p>

      <h1 className="mt-4 font-titre text-[2.1rem] leading-[1.1] font-extrabold">
        Tu travailles beaucoup et tu ne gagnes pas plus&nbsp;? Ton tarif est trop bas.
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-gris">
        Ton prix au ressenti oublie les charges, les congés et le temps que personne ne te paie.
        On te montre le calcul.
      </p>

      <section
        aria-label="Exemple chiffré"
        className="mt-7 rounded-lg border border-trait bg-white p-5"
      >
        <p className="text-sm font-medium text-gris">Exemple : 300 € la journée</p>
        <dl className="mt-3 space-y-2 text-base">
          <div className="flex justify-between gap-4">
            <dt>Prévu sur 220 jours</dt>
            <dd className="chiffre font-semibold">66 000 €</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Réellement facturé sur 180 jours</dt>
            <dd className="chiffre font-semibold">54 000 €</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-trait pt-2">
            <dt className="font-semibold">Ce qui manque chaque année</dt>
            <dd className="chiffre text-2xl font-extrabold text-facture">12 000 €</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-gris">
          Les 40 jours d'écart : congés, prospection, devis, compta. Avant même de compter les
          charges.
        </p>
      </section>

      <ul className="mt-8 space-y-5">
        {benefices.map((b, i) => (
          <li key={b.titre} className="flex gap-4">
            <span className="chiffre text-2xl font-extrabold text-facture leading-none pt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{b.titre}</p>
              <p className="text-gris">{b.texte}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 -mx-4 mt-10 bg-papier/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <Link
          href="/calcul"
          className="flex h-14 w-full items-center justify-center rounded-lg bg-encre text-lg font-semibold text-white active:translate-y-px"
        >
          Commencer le calcul
        </Link>
        <p className="mt-2 text-center text-sm text-gris">Gratuit · 3 questions · 2 minutes</p>
      </div>
    </main>
  );
}
