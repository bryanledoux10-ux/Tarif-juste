// Calcul du juste tarif. Fonctions pures : mêmes entrées, mêmes résultats,
// utilisables côté navigateur comme côté serveur.

export type Statut = "micro-bic" | "micro-bnc" | "reel";

export type Reponses = {
  tarifActuel: number; // € facturés aujourd'hui pour une journée
  netMensuelVoulu: number; // € nets voulus par mois, avant impôt sur le revenu
  semainesConges: number; // semaines non travaillées par an
  joursNonFactures: number; // jours par semaine passés à autre chose (admin, prospection…)
  statut: Statut;
  fraisMensuels: number; // frais pro par mois
};

// Taux 2026 (cotisations sociales + formation professionnelle), en part du chiffre d'affaires.
// Pour le régime réel ou une société, estimation globale des charges sur le bénéfice.
export const STATUTS: Record<Statut, { libelle: string; detail: string; taux: number }> = {
  "micro-bic": {
    libelle: "Micro-entreprise, artisan ou commerçant",
    detail: "Prestations artisanales ou commerciales",
    taux: 0.215,
  },
  "micro-bnc": {
    libelle: "Micro-entreprise, profession libérale",
    detail: "Conseil, création, informatique, formation…",
    taux: 0.258,
  },
  reel: {
    libelle: "Société ou régime réel",
    detail: "SASU, EURL, entreprise individuelle au réel",
    taux: 0.45,
  },
};

const JOURS_FERIES = 8; // jours fériés tombant en semaine, en moyenne
export const MARGE_SECURITE = 0.2; // imprévus, impayés, mois creux

export const DEFAUTS: Reponses = {
  tarifActuel: 300,
  netMensuelVoulu: 3000,
  semainesConges: 5,
  joursNonFactures: 1,
  statut: "micro-bnc",
  fraisMensuels: 200,
};

const borne = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;

// Ramène toute réponse dans des limites réalistes (valide aussi les données côté serveur).
export function nettoyer(r: Partial<Reponses>): Reponses {
  const statut: Statut =
    r.statut && r.statut in STATUTS ? r.statut : DEFAUTS.statut;
  return {
    tarifActuel: borne(Number(r.tarifActuel), 0, 10000),
    netMensuelVoulu: borne(Number(r.netMensuelVoulu), 0, 100000),
    semainesConges: borne(Number(r.semainesConges), 0, 20),
    joursNonFactures: borne(Number(r.joursNonFactures), 0, 4),
    statut,
    fraisMensuels: borne(Number(r.fraisMensuels), 0, 50000),
  };
}

export function joursFacturables(semainesConges: number, joursNonFactures: number) {
  const joursOuvres = (52 - semainesConges) * 5 - JOURS_FERIES;
  return Math.max(1, Math.round((joursOuvres * (5 - joursNonFactures)) / 5));
}

// Ce qui reste en poche sur un chiffre d'affaires donné, par an.
function netAnnuel(ca: number, frais: number, statut: Statut) {
  const t = STATUTS[statut].taux;
  return statut === "reel" ? (ca - frais) * (1 - t) : ca * (1 - t) - frais;
}

// Chiffre d'affaires nécessaire pour atteindre un net annuel.
function caNecessaire(net: number, frais: number, statut: Statut) {
  const t = STATUTS[statut].taux;
  return statut === "reel" ? net / (1 - t) + frais : (net + frais) / (1 - t);
}

const arrondiSup = (v: number, pas: number) => Math.ceil(v / pas) * pas;

export type Resultat = {
  jours: number;
  tarifPlancher: number;
  tarifConseille: number;
  netMensuelActuel: number;
  perteAnnuelle: number; // ce qui manque chaque année au tarif actuel par rapport au tarif conseillé
  sous100: number; // ce qui reste sur 100 € facturés, une fois cotisations payées
};

export function calculer(entree: Reponses): Resultat {
  const r = nettoyer(entree);
  const jours = joursFacturables(r.semainesConges, r.joursNonFactures);
  const fraisAn = r.fraisMensuels * 12;
  const ca = caNecessaire(r.netMensuelVoulu * 12, fraisAn, r.statut);
  const tarifPlancher = arrondiSup(ca / jours, 5);
  const tarifConseille = arrondiSup(tarifPlancher * (1 + MARGE_SECURITE), 10);
  const netMensuelActuel = Math.round(netAnnuel(r.tarifActuel * jours, fraisAn, r.statut) / 12);
  const perteAnnuelle = Math.max(0, Math.round((tarifConseille - r.tarifActuel) * jours));
  const sous100 = Math.round(100 * (1 - STATUTS[r.statut].taux));
  return { jours, tarifPlancher, tarifConseille, netMensuelActuel, perteAnnuelle, sous100 };
}

export const euros = (v: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(v) + " €";
