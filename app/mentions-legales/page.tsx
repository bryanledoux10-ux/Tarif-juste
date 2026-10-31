import { Article, PageLegale } from "../legal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Mentions légales — Tarif Juste" };

// Les champs entre [CROCHETS] sont à compléter avant la mise en vente.
export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales">
      <Article titre="Éditeur du site">
        <p>
          [NOM PRÉNOM], entrepreneur individuel
          <br />
          SIRET : [NUMÉRO SIRET]
          <br />
          Adresse : [ADRESSE POSTALE]
          <br />
          Contact : {CONTACT_EMAIL}
          <br />
          Directeur de la publication : [NOM PRÉNOM]
        </p>
      </Article>
      <Article titre="Hébergeur">
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
      </Article>
      <Article titre="Propriété intellectuelle">
        <p>
          Les textes et le contenu de ce site sont la propriété de l'éditeur. Toute reproduction
          sans autorisation est interdite.
        </p>
      </Article>
    </PageLegale>
  );
}
