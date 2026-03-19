"use client";
import { deleteRecord } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function EntityTable({ title, rows, columns, table, onEdit, onDeleted }: { title: string; rows: Record<string, any>[]; columns: { key: string; label: string }[]; table: string; onEdit: (row: Record<string, any>) => void; onDeleted?: () => void; }) {
  return <Panel className="overflow-hidden"><div className="border-b border-gold/10 px-5 py-4"><h2 className="font-display text-2xl text-gold">{title}</h2></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-black/20 text-xs uppercase tracking-[0.25em] text-zinc-400"><tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.label}</th>)}<th className="px-4 py-3">Akcje</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-gold/5">{columns.map((column) => <td key={column.key} className="px-4 py-3 text-zinc-200">{String(row[column.key] ?? "—")}</td>)}<td className="px-4 py-3"><div className="flex gap-2"><Button className="px-3 py-1 text-xs" onClick={() => onEdit(row)}>Edytuj</Button><Button className="border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300" onClick={async () => { if (!confirm("Usunąć rekord?")) return; const { error } = await deleteRecord(table, row.id); if (error) return alert(error.message); onDeleted?.(); }}>Usuń</Button></div></td></tr>)}</tbody></table></div></Panel>;
}
