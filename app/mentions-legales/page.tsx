export const metadata = { title: "Mentions légales — Tarif Juste" };

// Les champs entre [CROCHETS] sont à compléter avant la mise en vente.
export default function MentionsLegales() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-10 pb-12 leading-relaxed">
      <h1 className="font-titre text-3xl font-extrabold">Mentions légales</h1>

      <h2 className="mt-8 font-semibold">Éditeur du site</h2>
      <p className="mt-2">
        [NOM PRÉNOM ou RAISON SOCIALE], entrepreneur individuel
        <br />
        SIRET : [NUMÉRO SIRET]
        <br />
        Adresse : [ADRESSE POSTALE]
        <br />
        Contact : [EMAIL DE CONTACT]
        <br />
        Directeur de la publication : [NOM PRÉNOM]
      </p>

      <h2 className="mt-8 font-semibold">Hébergeur</h2>
      <p className="mt-2">
        Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com
      </p>

      <h2 className="mt-8 font-semibold">Propriété intellectuelle</h2>
      <p className="mt-2">
        Les textes et le contenu de ce site sont la propriété de l'éditeur. Toute reproduction
        sans autorisation est interdite.
      </p>
    </main>
  );
}
