import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";

export function Hero({ nextRoundLabel, nextRoundDate, videoUrl }: { nextRoundLabel?: string | null; nextRoundDate?: string | null; videoUrl?: string | null }) {
  return (
    <section className="relative overflow-hidden border-b border-gold/10 bg-[url('/assets/backgrounds/hero-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_1fr] md:px-6 md:py-20">
        <div className="space-y-6">
          <p className="font-accent text-sm uppercase tracking-[0.4em] text-gold/70">Oficjalny portal ligi</p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-gold md:text-7xl">Liga Pomścina</h1>
          <p className="max-w-2xl text-base text-zinc-200 md:text-lg">Heroiczna liga w klimacie Warcraft III. Wyniki, terminarz, profile zawodników i kroniki kolejnych sezonów w jednym miejscu.</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/tabela">Zobacz tabelę</Button>
            <Button
              href="/terminarz"
              className="bg-[linear-gradient(180deg,rgba(52,66,98,0.98)_0%,rgba(29,38,58,0.98)_48%,rgba(12,17,28,0.98)_100%)] text-zinc-100 hover:text-white"
            >
              Najbliższe mecze
            </Button>
          </div>
          <Panel className="max-w-lg p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Następna kolejka</p>
            <p className="mt-2 font-display text-2xl text-zinc-100">{nextRoundLabel ?? "Czekamy na termin"}</p>
            <p className="mt-2 text-sm text-zinc-300">{formatDate(nextRoundDate)}</p>
          </Panel>
        </div>
        <Panel className="p-3">
          <div className="aspect-video overflow-hidden rounded-2xl border border-gold/20 bg-black/40">
            <iframe className="h-full w-full" src={videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} title="Ostatnia rozgrywka" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="flex items-center justify-between p-4">
            <div><p className="text-xs uppercase tracking-[0.3em] text-gold/70">Ostatnia rozgrywka</p><h2 className="font-display text-2xl text-gold">Studio meczowe</h2></div>
            <div className="rounded-xl border border-gold/20 bg-black/20 px-3 py-2 text-sm text-zinc-300">Twitch / YouTube</div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
