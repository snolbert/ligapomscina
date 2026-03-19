export type Mode = "survival_chaos" | "legion_td";
export type MatchStatus = "scheduled" | "played" | "postponed" | "walkover";

export type Player = {
  id: string;
  slug: string;
  nickname: string;
  number: number;
  subtitle: string | null;
  description: string | null;
  achievements: string[] | null;
  portrait_url: string | null;
  banner_url: string | null;
  signature: string | null;
  active: boolean;
};

export type Season = {
  id: string;
  name: string;
  slug: string;
  is_current: boolean;
  order_index: number;
  archived_summary: string | null;
};

export type StandingRow = {
  id: string;
  season_id: string;
  player_id: string;
  overall_points: number;
  survival_points: number;
  legion_points: number;
  wins: number;
  matches_played: number;
  form: string[];
  sc_form?: string[];
  td_form?: string[];
  manual_override: boolean;
  player?: Player;
};
