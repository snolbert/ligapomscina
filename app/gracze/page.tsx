import { PlayerCard } from "@/components/site/player-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPlayers } from "@/lib/queries";

export default async function Page() {
  const players = await getPlayers({ includeInactive: true });

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6 md:py-16">
      <SectionHeading
        title="Gracze"
        description="Pełna lista zawodników ligi Pomścina."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {players.map((player: any) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </main>
  );
}