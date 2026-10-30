"use client";

import { useState } from "react";

export default function Copier({ texte }: { texte: string }) {
  const [copie, setCopie] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texte);
          setCopie(true);
          setTimeout(() => setCopie(false), 2000);
        } catch {
          setCopie(false);
        }
      }}
      className="mt-3 flex h-12 w-full items-center justify-center rounded-lg border-2 border-encre font-semibold"
    >
      {copie ? "Copié ✓" : "Copier le texte"}
    </button>
  );
}
