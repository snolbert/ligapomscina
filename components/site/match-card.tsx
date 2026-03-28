import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { Download } from "lucide-react";

function formatStatus(status: string) {
  if (status === "played") return "Played";
  if (status === "scheduled") return "Nadchodzący";
  if (status === "postponed") return "Przełożony";
  if (status === "walkover") return "Walkower";
  return status;
}

export function MatchCard({ match }: { match: any }) {
  return (
    <Panel className="h-full p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
            {match.mode === "survival_chaos" ? "Survival Chaos" : "Legion TD"}
          </p>
          <h3 className="font-display text-2xl text-zinc-100">{match.title}</h3>
        </div>

        <span className="rounded-lg border border-gold/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
          {formatStatus(match.status)}
        </span>
      </div>

      <p className="text-sm text-zinc-300">{formatDate(match.scheduled_at)}</p>

      <div className="mt-4 grid gap-3">
        {match.participants?.map((participant: any) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 rounded-xl border border-gold/10 bg-black/15 p-3"
          >
            <img
              src={
                participant.player?.portrait_url ||
                "/assets/players/player-placeholder.png"
              }
              alt={participant.player?.nickname}
              className="h-10 w-10 rounded-lg border border-gold/20 object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold text-zinc-100">
                {participant.player?.nickname}
              </p>
              <p className="text-xs text-zinc-400">
                {match.mode === "survival_chaos"
                  ? `Miejsce ${participant.placement ?? "—"}`
                  : `Drużyna ${participant.team ?? "—"}`}
              </p>
            </div>

            <div className="text-sm text-gold">
              {participant.points_awarded ?? 0} pkt
            </div>
          </div>
        ))}
      </div>

      {match.commentary ? (
        <p className="mt-4 text-sm text-zinc-400">{match.commentary}</p>
      ) : null}

      {match.replay_url ? (
        <a
          href={match.replay_url}
          download
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold transition hover:bg-gold/20"
        >
          <Download className="h-4 w-4" />
          Pobierz powtórkę
        </a>
      ) : null}
    </Panel>
  );
}