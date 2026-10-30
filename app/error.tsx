"use client";

import Link from "next/link";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-4 pt-16 pb-12">
      <h1 className="font-titre text-3xl font-extrabold">Un problème est survenu.</h1>
      <p className="mt-3 text-lg text-gris">Ce n'est pas de ton fait. Réessaie, ou repars de l'accueil.</p>
      <button
        onClick={reset}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-lg bg-encre font-semibold text-white"
      >
        Réessayer
      </button>
      <Link href="/" className="mt-3 block text-center underline underline-offset-2">
        Revenir à l'accueil
      </Link>
    </main>
  );
}
