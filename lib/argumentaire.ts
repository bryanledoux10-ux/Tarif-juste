import { euros } from "./calcul";

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

// Laisse un mois de préavis : la hausse commence le 1er du mois après le prochain.
export function dateDeHausse(aujourdhui = new Date()) {
  const d = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() + 2, 1);
  return `1er ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

export function messageEmail(ancien: number, nouveau: number, date: string) {
  return `Objet : Évolution de mon tarif au ${date}

Bonjour,

Merci pour la confiance que vous m'accordez dans nos projets.

Je vous informe qu'à partir du ${date}, mon tarif journalier passera de ${euros(ancien)} à ${euros(nouveau)} HT.

Cette évolution reflète le temps réellement consacré à chaque mission, y compris la préparation et le suivi, ainsi que les charges liées à mon activité. Elle me permet de continuer à vous garantir la même disponibilité et la même qualité de travail.

Les missions déjà engagées ou devisées avant cette date restent au tarif actuel.

Je reste à votre disposition si vous souhaitez en parler.

Bien à vous,
[Ton prénom]`;
}

export function messageSms(nouveau: number, date: string) {
  return `Bonjour, petite info : à partir du ${date}, mon tarif journalier passe à ${euros(nouveau)} HT. Les missions déjà prévues restent au tarif actuel. N'hésitez pas si vous avez des questions. [Ton prénom]`;
}
