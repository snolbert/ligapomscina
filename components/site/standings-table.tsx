import { Panel } from "@/components/ui/panel";
import type { StandingRow } from "@/lib/types";

function FormDots({ values }: { values: string[] }) {
  if (!values?.length) {
    return <span className="text-zinc-500">—</span>;
  }

  return (
    <div className="flex gap-2">
      {values.map((entry, idx) => (
        <span
          key={idx}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${
            entry === "W"
              ? "border-emerald-600/50 bg-emerald-500/15 text-emerald-300"
              : "border-rose-600/40 bg-rose-500/10 text-rose-300"
          }`}
        >
          {entry}
        </span>
      ))}
    </div>
  );
}

export function StandingsTable({
  rows,
  compact = false,
}: {
  rows: StandingRow[];
  compact?: boolean;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-gold/10 px-5 py-4">
        <h3 className="font-display text-2xl text-gold">Tabela ligowa</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black/20 text-xs uppercase tracking-[0.25em] text-zinc-400">
            {compact ? (
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Zawodnik</th>
                <th className="px-4 py-3">Pkt</th>
                <th className="px-4 py-3">SC</th>
                <th className="px-4 py-3">TD</th>
                <th className="px-4 py-3">Forma SC</th>
                <th className="px-4 py-3">Forma TD</th>
              </tr>
            ) : (
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Zawodnik</th>
                <th className="px-4 py-3">Pkt</th>
                <th className="px-4 py-3">Survival</th>
                <th className="px-4 py-3">Legion</th>
                <th className="px-4 py-3">Mecze</th>
                <th className="px-4 py-3">Forma SC</th>
                <th className="px-4 py-3">Forma TD</th>
              </tr>
            )}
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={index === 0 ? "bg-gold/10" : "border-t border-gold/5"}
              >
                <td className="px-4 py-3 text-gold">{index + 1}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        row.player?.portrait_url ||
                        "/assets/players/player-placeholder.png"
                      }
                      alt={row.player?.nickname}
                      className="h-10 w-10 rounded-xl border border-gold/20 object-cover"
                    />

                    <div>
                      <p className="font-semibold text-zinc-100">
                        {row.player?.nickname}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {row.player?.subtitle}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 font-semibold text-gold">
                  {row.overall_points}
                </td>

                <td className="px-4 py-3 text-zinc-300">{row.survival_points}</td>

                <td className="px-4 py-3 text-zinc-300">{row.legion_points}</td>

                {!compact && (
                  <td className="px-4 py-3 text-zinc-300">{row.matches_played}</td>
                )}

                <td className="px-4 py-3">
                  <FormDots values={row.sc_form ?? []} />
                </td>

                <td className="px-4 py-3">
                  <FormDots values={row.td_form ?? []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}