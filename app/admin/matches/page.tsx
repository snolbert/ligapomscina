"use client";

import { useEffect, useRef, useState } from "react";
import {
  deleteRecord,
  fetchMatchesAdmin,
  fetchTable,
  upsertRecord,
  replaceParticipants,
} from "@/lib/admin";
import { createClient } from "@/lib/supabase/client";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

type Participant = {
  player_id: string;
  team: string;
  placement: string;
  points_awarded: string;
};

type MatchForm = {
  id: string;
  season_id: string;
  round_id: string;
  mode: string;
  status: string;
  title: string;
  scheduled_at: string;
  commentary: string;
  replay_url: string;
  video_url: string;
  image_url: string;
  mvp_player_id: string;
};

const emptyMatch: MatchForm = {
  id: "",
  season_id: "",
  round_id: "",
  mode: "survival_chaos",
  status: "scheduled",
  title: "",
  scheduled_at: "",
  commentary: "",
  replay_url: "",
  video_url: "",
  image_url: "",
  mvp_player_id: "",
};

const emptyParticipant: Participant = {
  player_id: "",
  team: "",
  placement: "",
  points_awarded: "",
};

function toInputDateTime(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

function mapRowToMatchForm(row: any): MatchForm {
  return {
    id: row.id ?? "",
    season_id: row.season_id ?? "",
    round_id: row.round_id ?? "",
    mode: row.mode ?? "survival_chaos",
    status: row.status ?? "scheduled",
    title: row.title ?? "",
    scheduled_at: toInputDateTime(row.scheduled_at),
    commentary: row.commentary ?? "",
    replay_url: row.replay_url ?? "",
    video_url: row.video_url ?? "",
    image_url: row.image_url ?? "",
    mvp_player_id: row.mvp_player_id ?? "",
  };
}

export default function MatchesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [match, setMatch] = useState<MatchForm>(emptyMatch);
  const [participants, setParticipants] = useState<Participant[]>([
    emptyParticipant,
  ]);
  const [replayUploading, setReplayUploading] = useState(false);
  const replayInputRef = useRef<HTMLInputElement>(null);

  async function uploadReplay(file: File) {
    setReplayUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "w3g";
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("replays").upload(path, file, { upsert: false });
      if (error) { alert(error.message); return; }
      const { data } = supabase.storage.from("replays").getPublicUrl(path);
      setMatch((current) => ({ ...current, replay_url: data.publicUrl }));
    } finally {
      setReplayUploading(false);
    }
  }

  async function load() {
    const [matches, loadedPlayers, loadedSeasons, loadedRounds] =
      await Promise.all([
        fetchMatchesAdmin(),
        fetchTable("players", "number"),
        fetchTable("seasons", "order_index"),
        fetchTable("rounds", "round_number"),
      ]);

    setRows(matches);
    setPlayers(loadedPlayers);
    setSeasons(loadedSeasons);
    setRounds(loadedRounds);
  }

  useEffect(() => {
    load();
  }, []);

  const availableRounds = rounds.filter(
    (round: any) => !match.season_id || round.season_id === match.season_id
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <Panel className="p-6">
        <h2 className="font-display text-2xl text-gold">Mecz</h2>

        <form
          className="mt-5 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            const payload: Record<string, any> = {
              id: match.id || undefined,
              season_id: match.season_id || null,
              round_id: match.round_id || null,
              mode: match.mode || "survival_chaos",
              status: match.status || "scheduled",
              title: match.title || null,
              scheduled_at: match.scheduled_at || null,
              commentary: match.commentary || null,
              replay_url: match.replay_url || null,
              video_url: match.video_url || null,
              image_url: match.image_url || null,
              mvp_player_id: match.mvp_player_id || null,
            };

            if (!payload.id) {
              delete payload.id;
            }

            const { data, error } = await upsertRecord("matches", payload);
            if (error) {
              alert(error.message);
              return;
            }

            const cleanParticipants = participants
              .filter((item) => item.player_id)
              .map((item) => ({
                player_id: item.player_id,
                team: item.team ? Number(item.team) : null,
                placement: item.placement ? Number(item.placement) : null,
                points_awarded: item.points_awarded
                  ? Number(item.points_awarded)
                  : 0,
              }));

            await replaceParticipants((data as any).id, cleanParticipants);

            alert("Zapisano mecz.");
            setMatch(emptyMatch);
            setParticipants([emptyParticipant]);
            load();
          }}
        >
          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Sezon</span>
            <select
              value={match.season_id}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  season_id: e.target.value,
                  round_id: "",
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            >
              <option value="">Wybierz sezon</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Kolejka</span>
            <select
              value={match.round_id}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  round_id: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            >
              <option value="">Wybierz kolejkę</option>
              {availableRounds.map((round) => (
                <option key={round.id} value={round.id}>
                  {round.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Tryb</span>
            <select
              value={match.mode}
              onChange={(e) =>
                setMatch((current) => ({ ...current, mode: e.target.value }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            >
              <option value="survival_chaos">Survival Chaos</option>
              <option value="legion_td">Legion TD</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Status</span>
            <select
              value={match.status}
              onChange={(e) =>
                setMatch((current) => ({ ...current, status: e.target.value }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            >
              <option value="scheduled">Nadchodzący</option>
              <option value="played">Rozegrany</option>
              <option value="postponed">Przełożony</option>
              <option value="walkover">Walkower</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Tytuł</span>
            <input
              type="text"
              value={match.title}
              onChange={(e) =>
                setMatch((current) => ({ ...current, title: e.target.value }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Termin</span>
            <input
              type="datetime-local"
              value={match.scheduled_at}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  scheduled_at: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Komentarz</span>
            <input
              type="text"
              value={match.commentary}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  commentary: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            />
          </label>

          <div className="grid gap-2 text-sm">
            <span className="text-zinc-300">Powtórka</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={match.replay_url}
                onChange={(e) =>
                  setMatch((current) => ({ ...current, replay_url: e.target.value }))
                }
                placeholder="URL lub wgraj plik poniżej"
                className="flex-1 rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
              />
              {match.replay_url && (
                <button
                  type="button"
                  title="Usuń powtórkę"
                  onClick={() => setMatch((current) => ({ ...current, replay_url: "" }))}
                  className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 text-rose-300 hover:bg-rose-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <input
              ref={replayInputRef}
              type="file"
              accept=".w3g,.nwg,.w3m,.zip"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await uploadReplay(file);
                if (replayInputRef.current) replayInputRef.current.value = "";
              }}
            />
            <button
              type="button"
              disabled={replayUploading}
              onClick={() => replayInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-gold/20 bg-black/20 px-4 py-3 text-zinc-300 hover:bg-gold/10 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {replayUploading ? "Wysyłanie…" : "Wgraj plik powtórki (.w3g)"}
            </button>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Wideo URL</span>
            <input
              type="text"
              value={match.video_url}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  video_url: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">Screen URL</span>
            <input
              type="text"
              value={match.image_url}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  image_url: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-300">MVP</span>
            <select
              value={match.mvp_player_id}
              onChange={(e) =>
                setMatch((current) => ({
                  ...current,
                  mvp_player_id: e.target.value,
                }))
              }
              className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3"
            >
              <option value="">Brak</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.nickname}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-gold/15 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl text-gold">Uczestnicy</p>
              <Button
                type="button"
                onClick={() =>
                  setParticipants((current) => [...current, emptyParticipant])
                }
                className="px-3 py-1 text-xs"
              >
                Dodaj uczestnika
              </Button>
            </div>

            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-2xl border border-gold/10 p-3 md:grid-cols-4"
                >
                  <select
                    value={participant.player_id}
                    onChange={(e) => {
                      const next = [...participants];
                      next[index].player_id = e.target.value;
                      setParticipants(next);
                    }}
                    className="rounded-xl border border-gold/20 bg-black/20 px-3 py-2"
                  >
                    <option value="">Wybierz gracza</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.nickname}
                      </option>
                    ))}
                  </select>

                  <input
                    value={participant.team}
                    onChange={(e) => {
                      const next = [...participants];
                      next[index].team = e.target.value;
                      setParticipants(next);
                    }}
                    placeholder="Team"
                    className="rounded-xl border border-gold/20 bg-black/20 px-3 py-2"
                  />

                  <input
                    value={participant.placement}
                    onChange={(e) => {
                      const next = [...participants];
                      next[index].placement = e.target.value;
                      setParticipants(next);
                    }}
                    placeholder="Miejsce"
                    className="rounded-xl border border-gold/20 bg-black/20 px-3 py-2"
                  />

                  <input
                    value={participant.points_awarded}
                    onChange={(e) => {
                      const next = [...participants];
                      next[index].points_awarded = e.target.value;
                      setParticipants(next);
                    }}
                    placeholder="Punkty"
                    className="rounded-xl border border-gold/20 bg-black/20 px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-fit">
            Zapisz mecz
          </Button>
        </form>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="border-b border-gold/10 px-5 py-4">
          <h2 className="font-display text-2xl text-gold">Lista meczów</h2>
        </div>

        <div className="space-y-4 p-5">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-gold/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-gold">{row.title}</p>
                  <p className="text-sm text-zinc-400">
                    {row.mode} · {row.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="px-3 py-1 text-xs"
                    onClick={() => {
                      setMatch(mapRowToMatchForm(row));
                      setParticipants(
                        (row.participants || []).map((item: any) => ({
                          player_id: item.player_id ?? "",
                          team: item.team?.toString() || "",
                          placement: item.placement?.toString() || "",
                          points_awarded:
                            item.points_awarded?.toString() || "0",
                        }))
                      );
                    }}
                  >
                    Edytuj
                  </Button>

                  <Button
                    className="border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300"
                    onClick={async () => {
                      if (!confirm("Usunąć mecz?")) return;
                      const { error } = await deleteRecord("matches", row.id);
                      if (error) return alert(error.message);
                      load();
                    }}
                  >
                    Usuń
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}