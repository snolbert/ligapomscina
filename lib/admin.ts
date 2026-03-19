"use client";
import { createClient } from "@/lib/supabase/client";

export async function signInAdmin(email: string, password: string) {
  return createClient().auth.signInWithPassword({ email, password });
}
export async function signOutAdmin() {
  return createClient().auth.signOut();
}
export async function upsertRecord(table: string, payload: Record<string, unknown>) {
  return createClient().from(table).upsert(payload).select().single();
}
export async function deleteRecord(table: string, id: string) {
  return createClient().from(table).delete().eq("id", id);
}
export async function fetchTable<T = unknown>(table: string, order?: string) {
  let q = createClient().from(table).select("*");
  if (order) q = q.order(order as never);
  const { data, error } = await q;
  if (error) throw error;
  return data as T[];
}
export async function fetchMatchesAdmin() {
  const { data, error } = await createClient().from("matches").select("*, participants:match_participants(*)").order("scheduled_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function replaceParticipants(matchId: string, participants: Array<Record<string, unknown>>) {
  const client = createClient();
  const del = await client.from("match_participants").delete().eq("match_id", matchId);
  if (del.error) throw del.error;
  if (!participants.length) return { error: null };
  return client.from("match_participants").insert(participants.map((row) => ({ ...row, match_id: matchId })));
}
