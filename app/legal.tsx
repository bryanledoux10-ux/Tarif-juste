// Mise en page commune aux pages légales.
export function PageLegale({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-xl px-4 pt-10 pb-12 leading-relaxed">
      <h1 className="font-titre text-3xl font-extrabold">{titre}</h1>
      <p className="mt-2 text-sm text-gris">Dernière mise à jour : 31 octobre 2026</p>
      <div className="mt-6">{children}</div>
    </main>
  );
}

export function Article({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-semibold">{titre}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
