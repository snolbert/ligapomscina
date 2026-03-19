import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import type { Player } from "@/lib/types";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link href={`/gracze/${player.slug}`} className="group block">
      <div className="lava-frame rounded-[1.35rem] p-[1px] transition duration-300 group-hover:-translate-y-1">
        <Panel className="relative h-full overflow-hidden rounded-[1.25rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,154,44,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,72,0,0.1),transparent_28%)] opacity-80" />

          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={
                player.portrait_url ||
                "/assets/players/player-placeholder.png"
              }
              alt={player.nickname}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          <div className="relative p-5">
            <div className="absolute right-4 top-3 font-display text-5xl text-gold/20">
              {player.number}
            </div>

            <p className="font-display text-2xl text-gold">{player.nickname}</p>
            <p className="text-sm text-zinc-300">{player.subtitle}</p>
            <p className="mt-3 line-clamp-3 text-sm text-zinc-400">
              {player.description}
            </p>
          </div>
        </Panel>
      </div>
    </Link>
  );
}