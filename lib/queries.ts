import { createClient } from "@/lib/supabase/server";
import type { StandingRow } from "@/lib/types";

export async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}

export async function getPlayers(options?: { includeInactive?: boolean }) {
  const supabase = await createClient();

  let query = supabase.from("players").select("*").order("number");

  if (!options?.includeInactive) {
    query = query.eq("active", true);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPlayerBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getSeasons() {
  const supabase = await createClient();
  const { data } = await supabase.from("seasons").select("*").order("order_index");
  return data ?? [];
}

export async function getCurrentSeason() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_current", true)
    .single();
  return data;
}

function outcomeForParticipant(match: any, participant: any) {
  if (!participant || match.status !== "played") return null;

  if (match.mode === "survival_chaos") {
    if (participant.placement == null) return null;
    return participant.placement === 1 ? "W" : "L";
  }

  if (match.mode === "legion_td") {
    if (participant.points_awarded == null) return null;
    return Number(participant.points_awarded) > 0 ? "W" : "L";
  }

  return null;
}

function buildModeForms(matches: any[], playerId: string) {
  const recentPlayed = matches
    .filter((match) => match.status === "played")
    .sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    );

  const byMode = {
    survival_chaos: [] as string[],
    legion_td: [] as string[],
  };

  for (const match of recentPlayed) {
    const participant = (match.participants || []).find(
      (entry: any) => entry.player_id === playerId
    );

    const outcome = outcomeForParticipant(match, participant);
    if (!outcome) continue;

    if (
      match.mode === "survival_chaos" &&
      byMode.survival_chaos.length < 3
    ) {
      byMode.survival_chaos.push(outcome);
    }

    if (match.mode === "legion_td" && byMode.legion_td.length < 3) {
      byMode.legion_td.push(outcome);
    }
  }

  return byMode;
}

export async function getStandings(seasonId?: string) {
  const supabase = await createClient();

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("number");

  if (playersError) {
    throw playersError;
  }

  let matchesQuery = supabase
    .from("matches")
    .select(`
      id,
      season_id,
      mode,
      status,
      scheduled_at,
      participants:match_participants(
        id,
        player_id,
        team,
        placement,
        points_awarded
      )
    `)
    .eq("status", "played")
    .order("scheduled_at", { ascending: false });

  if (seasonId) {
    matchesQuery = matchesQuery.eq("season_id", seasonId);
  }

  const { data: matches, error: matchesError } = await matchesQuery;

  if (matchesError) {
    throw matchesError;
  }

  const safePlayers = players ?? [];
  const safeMatches = matches ?? [];

  const standings: StandingRow[] = safePlayers.map((player: any) => {
  let overall_points = 0;
  let survival_points = 0;
  let legion_points = 0;
  let wins = 0;
  let matches_played = 0;
  const form: string[] = [];
  const sc_form: string[] = [];
  const td_form: string[] = [];

  // ... reszta Twojej logiki

  return {
    id: `${seasonId || "all"}-${player.id}`,
    season_id: seasonId ?? "all",
    player_id: player.id,
    overall_points,
    survival_points,
    legion_points,
    wins,
    matches_played,
    form,
    sc_form,
    td_form,
    manual_override: false,
    player,
  };
});

  return standings.sort((a, b) => {
    if (b.overall_points !== a.overall_points) {
      return b.overall_points - a.overall_points;
    }

    if (b.survival_points !== a.survival_points) {
      return b.survival_points - a.survival_points;
    }

    if (b.legion_points !== a.legion_points) {
      return b.legion_points - a.legion_points;
    }

    return a.player?.nickname.localeCompare(b.player?.nickname || "", "pl") || 0;
  });
}

function sortParticipantsForMatch(match: any) {
  const participants = [...(match.participants ?? [])];

  if (match.mode === "survival_chaos") {
    return participants.sort((a, b) => {
      const aPlacement = a.placement ?? 999;
      const bPlacement = b.placement ?? 999;

      if (aPlacement !== bPlacement) {
        return aPlacement - bPlacement;
      }

      return Number(b.points_awarded ?? 0) - Number(a.points_awarded ?? 0);
    });
  }

  return participants.sort((a, b) => {
    const pointsDiff =
      Number(b.points_awarded ?? 0) - Number(a.points_awarded ?? 0);

    if (pointsDiff !== 0) {
      return pointsDiff;
    }

    return Number(a.team ?? 999) - Number(b.team ?? 999);
  });
}

export async function getMatches(filters?: { seasonId?: string; limit?: number }) {
  const supabase = await createClient();

  let q = supabase
    .from("matches")
    .select(
      "*, participants:match_participants(*, player:players(*)), mvp:players!matches_mvp_player_id_fkey(*)"
    )
    .order("scheduled_at", { ascending: false });

  if (filters?.seasonId) q = q.eq("season_id", filters.seasonId);
  if (filters?.limit) q = q.limit(filters.limit);

  const { data } = await q;

  return (data ?? []).map((match: any) => ({
    ...match,
    participants: sortParticipantsForMatch(match),
  }));
}

export async function getLatestPlayedRoundBundle(seasonId?: string) {
  const supabase = await createClient();

  let latestPlayedQuery = supabase
    .from("matches")
    .select("id, season_id, round_id, scheduled_at")
    .eq("status", "played")
    .not("round_id", "is", null)
    .order("scheduled_at", { ascending: false })
    .limit(1);

  if (seasonId) {
    latestPlayedQuery = latestPlayedQuery.eq("season_id", seasonId);
  }

  const { data: latestPlayedMatches, error: latestPlayedError } =
    await latestPlayedQuery;

  if (latestPlayedError) throw latestPlayedError;

  const latestPlayed = latestPlayedMatches?.[0];
  if (!latestPlayed?.round_id) {
    return {
      round: null,
      matches: [],
      mvp: null,
      troll: null,
    };
  }

  const { data: round, error: roundError } = await supabase
    .from("rounds")
    .select("*")
    .eq("id", latestPlayed.round_id)
    .single();

  if (roundError) throw roundError;

  let roundMatchesQuery = supabase
    .from("matches")
    .select(
      "*, participants:match_participants(*, player:players(*)), mvp:players!matches_mvp_player_id_fkey(*)"
    )
    .eq("round_id", latestPlayed.round_id)
    .eq("status", "played")
    .order("scheduled_at", { ascending: false });

  if (seasonId) {
    roundMatchesQuery = roundMatchesQuery.eq("season_id", seasonId);
  }

  const { data: roundMatches, error: roundMatchesError } =
    await roundMatchesQuery;

  if (roundMatchesError) throw roundMatchesError;

  const matches = (roundMatches ?? []).map((match: any) => ({
    ...match,
    participants: sortParticipantsForMatch(match),
  }));

  const mvpRoundCounts = new Map<string, number>();
  for (const match of matches) {
    if (match.mvp_player_id) {
      mvpRoundCounts.set(
        match.mvp_player_id,
        (mvpRoundCounts.get(match.mvp_player_id) ?? 0) + 1
      );
    }
  }

  let allPlayedMatchesQuery = supabase
    .from("matches")
    .select("id, round_id, season_id, mvp_player_id, status")
    .eq("status", "played");

  if (seasonId) {
    allPlayedMatchesQuery = allPlayedMatchesQuery.eq("season_id", seasonId);
  }

  const { data: allPlayedMatches, error: allPlayedMatchesError } =
    await allPlayedMatchesQuery;

  if (allPlayedMatchesError) throw allPlayedMatchesError;

  const mvpTotalCounts = new Map<string, number>();
  for (const match of allPlayedMatches ?? []) {
    if (match.mvp_player_id) {
      mvpTotalCounts.set(
        match.mvp_player_id,
        (mvpTotalCounts.get(match.mvp_player_id) ?? 0) + 1
      );
    }
  }

  let mvp: any = null;
  if (mvpRoundCounts.size > 0) {
    const topMvpPlayerId = [...mvpRoundCounts.entries()].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })[0][0];

    const { data: mvpPlayer } = await supabase
      .from("players")
      .select("*")
      .eq("id", topMvpPlayerId)
      .single();

    if (mvpPlayer) {
      mvp = {
        player: mvpPlayer,
        total_count: mvpTotalCounts.get(topMvpPlayerId) ?? 0,
      };
    }
  }

  let allParticipantsQuery = supabase
    .from("matches")
    .select(`
      id,
      round_id,
      season_id,
      status,
      participants:match_participants(
        player_id,
        placement,
        points_awarded
      )
    `)
    .eq("status", "played");

  if (seasonId) {
    allParticipantsQuery = allParticipantsQuery.eq("season_id", seasonId);
  }

  const { data: allPlayedWithParticipants, error: allParticipantsError } =
    await allParticipantsQuery;

  if (allParticipantsError) throw allParticipantsError;

  const roundTotals = new Map<string, Map<string, number>>();

  for (const match of allPlayedWithParticipants ?? []) {
    if (!match.round_id) continue;

    if (!roundTotals.has(match.round_id)) {
      roundTotals.set(match.round_id, new Map<string, number>());
    }

    const totals = roundTotals.get(match.round_id)!;

    for (const participant of match.participants ?? []) {
      const current = totals.get(participant.player_id) ?? 0;
      totals.set(
        participant.player_id,
        current + Number(participant.points_awarded ?? 0)
      );
    }
  }

  const trollRoundCounts = new Map<string, number>();

  for (const [, totals] of roundTotals.entries()) {
    const sorted = [...totals.entries()].sort((a, b) => {
      if (a[1] !== b[1]) return a[1] - b[1];
      return a[0].localeCompare(b[0]);
    });

    const trollPlayerId = sorted[0]?.[0];
    if (trollPlayerId) {
      trollRoundCounts.set(
        trollPlayerId,
        (trollRoundCounts.get(trollPlayerId) ?? 0) + 1
      );
    }
  }

  const latestRoundTotals = roundTotals.get(latestPlayed.round_id) ?? new Map();
  const latestRoundTroll = [...latestRoundTotals.entries()].sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[0].localeCompare(b[0]);
  })[0];

  let troll: any = null;
  if (latestRoundTroll?.[0]) {
    const { data: trollPlayer } = await supabase
      .from("players")
      .select("*")
      .eq("id", latestRoundTroll[0])
      .single();

    if (trollPlayer) {
      troll = {
        player: trollPlayer,
        total_count: trollRoundCounts.get(latestRoundTroll[0]) ?? 0,
      };
    }
  }

  return {
    round,
    matches,
    mvp,
    troll,
  };
}

export async function getNextRound() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rounds")
    .select("*")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at")
    .limit(1)
    .single();
  return data;
}

export async function getNews(limit?: number) {
  const supabase = await createClient();
  let q = supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (limit) q = q.limit(limit);

  const { data } = await q;
  return data ?? [];
}

export async function getNewsBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getSponsors() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getRules() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rules_sections")
    .select("*")
    .order("sort_order");
  return data ?? [];
}