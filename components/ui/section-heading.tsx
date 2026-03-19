export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6 space-y-2">
      {eyebrow ? <p className="font-accent text-sm uppercase tracking-[0.35em] text-gold/70">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl text-gold md:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-zinc-300 md:text-base">{description}</p> : null}
    </div>
  );
}
