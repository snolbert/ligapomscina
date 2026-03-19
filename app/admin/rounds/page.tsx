"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const columns = [
  { key: "name", label: "Nazwa" },
  { key: "round_number", label: "Kolejka" },
  { key: "season_name", label: "Sezon" },
  { key: "starts_at", label: "Start" },
];

const emptyRecord = { id: "", season_id: "", round_number: "", name: "", starts_at: "" };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [seasons, setSeasons] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
    const [roundsData, seasonsData] = await Promise.all([fetchTable("rounds", "round_number"), fetchTable("seasons", "order_index")]);
    setSeasons(seasonsData as Record<string, any>[]);
    const seasonMap = new Map((seasonsData as Record<string, any>[]).map((season) => [season.id, season.name]));
    setRows(
      (roundsData as Record<string, any>[]).map((row) => ({
        ...row,
        season_name: seasonMap.get(row.season_id) || row.season_id,
      }))
    );
  }

  useEffect(() => {
    load();
  }, []);

  const fields = useMemo(
    () => [
      { name: "id", label: "ID", auto: true },
      {
        name: "season_id",
        label: "Sezon",
        type: "select",
        options: seasons.map((season) => ({ value: season.id, label: season.name })),
      },
      { name: "round_number", label: "Numer kolejki", type: "number" },
      { name: "name", label: "Nazwa", type: "text" },
      { name: "starts_at", label: "Start", type: "datetime-local" },
    ],
    [seasons]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Kolejki"
        table="rounds"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable
        title="Lista: Kolejki"
        table="rounds"
        rows={rows}
        columns={columns}
        onEdit={(row) => {
          const { season_name, ...roundRow } = row;
          setEditing(roundRow);
        }}
        onDeleted={load}
      />
    </div>
  );
}
