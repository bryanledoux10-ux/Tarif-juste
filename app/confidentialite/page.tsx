import { Article, PageLegale } from "../legal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Politique de confidentialité — Tarif Juste" };

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité">
      <Article titre="Responsable du traitement">
        <p>
          [NOM PRÉNOM], entrepreneur individuel, [ADRESSE POSTALE]. Contact : {CONTACT_EMAIL}.
        </p>
      </Article>

      <Article titre="Le calcul gratuit">
        <p>
          Les réponses aux trois questions sont traitées dans ton navigateur. Elles ne sont ni
          envoyées, ni enregistrées tant que tu ne lances pas un paiement.
        </p>
      </Article>

      <Article titre="Lors d'un achat">
        <p>Sont traités, pour exécuter la commande :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>tes réponses au calcul, pour produire ton plan ;</li>
          <li>ton adresse email, pour t'envoyer le reçu et répondre à tes demandes ;</li>
          <li>
            les informations de paiement, traitées uniquement par Stripe : nous ne voyons jamais
            ton numéro de carte.
          </li>
        </ul>
        <p>
          Ces données sont conservées pendant 10 ans, durée imposée pour les pièces comptables.
          Elles ne sont ni vendues, ni utilisées pour de la publicité.
        </p>
      </Article>

      <Article titre="Prestataires">
        <ul className="list-disc space-y-1 pl-5">
          <li>Stripe (paiement), qui stocke la commande et tes réponses ;</li>
          <li>Vercel (hébergement du site), qui conserve des journaux techniques de connexion.</li>
        </ul>
        <p>
          Ces prestataires peuvent traiter des données hors de l'Union européenne, avec les
          garanties prévues par le RGPD (clauses contractuelles types).
        </p>
      </Article>

      <Article titre="Cookies">
        <p>
          Ce site n'utilise aucun cookie publicitaire ni de suivi. La page de paiement Stripe
          utilise les cookies nécessaires à la sécurité du paiement.
        </p>
      </Article>

      <Article titre="Tes droits">
        <p>
          Tu peux demander l'accès, la rectification ou la suppression de tes données (dans la
          limite des obligations comptables) en écrivant à {CONTACT_EMAIL}. Tu peux aussi
          adresser une réclamation à la CNIL (cnil.fr).
        </p>
      </Article>
    </PageLegale>
  );
}
