"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const columns = [
  { key: "title", label: "Tytuł" },
  { key: "slug", label: "Slug" },
  { key: "season_name", label: "Sezon" },
  { key: "mode", label: "Tryb" },
  { key: "is_published", label: "Publikacja" },
];

const emptyRecord = { id: "", title: "", slug: "", lead: "", content: "", image_url: "", season_id: "", mode: "survival_chaos", published_at: "", is_featured: false, is_published: false };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [seasons, setSeasons] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
    const [newsData, seasonsData] = await Promise.all([fetchTable("news", "published_at"), fetchTable("seasons", "order_index")]);
    setSeasons(seasonsData as Record<string, any>[]);
    const seasonMap = new Map((seasonsData as Record<string, any>[]).map((season) => [season.id, season.name]));
    setRows(
      (newsData as Record<string, any>[]).map((row) => ({
        ...row,
        season_name: seasonMap.get(row.season_id) || "—",
      }))
    );
  }

  useEffect(() => {
    load();
  }, []);

  const fields = useMemo(
    () => [
      { name: "id", label: "ID", auto: true },
      { name: "title", label: "Tytuł", type: "text" },
      { name: "slug", label: "Slug", auto: true },
      { name: "lead", label: "Lead", type: "textarea" },
      { name: "content", label: "Treść", type: "textarea" },
      { name: "image_url", label: "Obraz URL", type: "text" },
      { name: "season_id", label: "Sezon", type: "select", options: seasons.map((season) => ({ value: season.id, label: season.name })) },
      {
        name: "mode",
        label: "Tryb",
        type: "select",
        options: [
          { value: "survival_chaos", label: "Survival Chaos" },
          { value: "legion_td", label: "Legion TD" },
        ],
      },
      { name: "published_at", label: "Publikacja", type: "datetime-local" },
      { name: "is_featured", label: "Wyróżniony", type: "checkbox" },
      { name: "is_published", label: "Opublikowany", type: "checkbox" },
    ],
    [seasons]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Newsy"
        table="news"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable
        title="Lista: Newsy"
        table="news"
        rows={rows}
        columns={columns}
        onEdit={(row) => {
          const { season_name, ...newsRow } = row;
          setEditing(newsRow);
        }}
        onDeleted={load}
      />
    </div>
  );
}
