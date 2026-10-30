import { notFound } from "next/navigation";

// Toute adresse inconnue affiche la page 404 maison (app/not-found.tsx).
export default function AdresseInconnue() {
  notFound();
}
