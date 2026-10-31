import { Article, PageLegale } from "../legal";
import { CONTACT_EMAIL, GARANTIE_JOURS, PRIX_EUROS } from "@/lib/site";

export const metadata = { title: "Conditions générales de vente — Tarif Juste" };

// Les champs entre [CROCHETS] sont à compléter avant la mise en vente.
export default function CGV() {
  return (
    <PageLegale titre="Conditions générales de vente">
      <Article titre="1. Vendeur">
        <p>
          Tarif Juste est édité par [NOM PRÉNOM], entrepreneur individuel, SIRET [NUMÉRO SIRET],
          [ADRESSE POSTALE]. Contact : {CONTACT_EMAIL}.
        </p>
      </Article>

      <Article titre="2. Objet">
        <p>
          Les présentes conditions s'appliquent à toute commande passée sur ce site. Toute
          commande vaut acceptation de ces conditions.
        </p>
      </Article>

      <Article titre="3. Le produit">
        <p>
          Le « plan complet » est un contenu numérique personnalisé, établi à partir des réponses
          saisies par l'acheteur. Il comprend : un tarif conseillé, un message d'annonce de hausse
          de tarif (version email et version SMS) et le détail du calcul.
        </p>
        <p>
          Les montants sont des estimations établies à partir des taux de cotisations sociales en
          vigueur et des informations fournies par l'acheteur. Ils ne constituent ni un conseil
          comptable, ni un conseil fiscal, ni un conseil juridique, et ne tiennent pas compte de
          l'impôt sur le revenu.
        </p>
      </Article>

      <Article titre="4. Prix">
        <p>
          Le plan complet coûte {PRIX_EUROS} € TTC, en paiement unique. Il ne s'agit pas d'un
          abonnement : aucun autre prélèvement n'aura lieu. [TVA non applicable, article 293 B du
          Code général des impôts.]
        </p>
      </Article>

      <Article titre="5. Paiement">
        <p>
          Le paiement s'effectue par carte bancaire via Stripe, prestataire de paiement sécurisé.
          Le vendeur n'a jamais accès aux numéros de carte.
        </p>
      </Article>

      <Article titre="6. Livraison">
        <p>
          Le plan est accessible immédiatement après la confirmation du paiement, sur une page
          dont le lien constitue l'accès de l'acheteur. Un reçu est envoyé à l'adresse email
          indiquée lors du paiement. En cas de problème d'accès, il suffit d'écrire à{" "}
          {CONTACT_EMAIL} : le plan est renvoyé sous 24 h.
        </p>
      </Article>

      <Article titre="7. Droit de rétractation">
        <p>
          Le plan est un contenu numérique fourni immédiatement. En validant le paiement,
          l'acheteur demande l'accès immédiat au plan et reconnaît perdre son droit de
          rétractation, conformément à l'article L221-28 13° du Code de la consommation.
        </p>
        <p>Cette renonciation ne le prive pas de la garantie ci-dessous, plus favorable.</p>
      </Article>

      <Article titre={`8. Garantie satisfait ou remboursé (${GARANTIE_JOURS} jours)`}>
        <p>
          Pendant {GARANTIE_JOURS} jours après l'achat, l'acheteur peut demander le remboursement
          intégral, sans avoir à se justifier. Il lui suffit d'écrire à {CONTACT_EMAIL} depuis
          l'adresse utilisée pour payer, ou en l'indiquant dans son message.
        </p>
        <p>
          Le remboursement est déclenché sous 48 h, sur la carte utilisée pour le paiement. Selon
          la banque, l'argent réapparaît sur le compte sous 5 à 10 jours ouvrés.
        </p>
      </Article>

      <Article titre="9. Responsabilité">
        <p>
          L'acheteur reste seul décisionnaire des tarifs qu'il pratique et de la relation avec ses
          clients. Le vendeur ne saurait être tenu responsable des conséquences d'une décision
          tarifaire prise sur la base du plan, ni d'informations erronées saisies par l'acheteur.
        </p>
      </Article>

      <Article titre="10. Données personnelles">
        <p>
          Le traitement des données est décrit dans la{" "}
          <a href="/confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </a>
          .
        </p>
      </Article>

      <Article titre="11. Réclamations et médiation">
        <p>
          Toute réclamation peut être adressée à {CONTACT_EMAIL}. En cas de désaccord persistant,
          l'acheteur consommateur peut recourir gratuitement au médiateur de la consommation :
          [NOM ET SITE DU MÉDIATEUR].
        </p>
      </Article>

      <Article titre="12. Droit applicable">
        <p>Les présentes conditions sont soumises au droit français.</p>
      </Article>
    </PageLegale>
  );
}
