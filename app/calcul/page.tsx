import type { Metadata } from "next";
import Tunnel from "./Tunnel";

export const metadata: Metadata = {
  title: "Ton calcul — Tarif Juste",
  description: "3 questions pour savoir combien tu perds à facturer trop bas. Gratuit.",
};

export default function Calcul() {
  return <Tunnel />;
}
