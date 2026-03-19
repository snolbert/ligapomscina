"use client";
import { useEffect, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const fields = [
  { name: "id", label: "ID", auto: true },
  { name: "slug", label: "Slug", auto: true },
  { name: "nickname", label: "Nick", type: "text" },
  { name: "number", label: "Numer", type: "number" },
  { name: "subtitle", label: "Podpis", type: "text" },
  { name: "signature", label: "Sygnatura", type: "text" },
  { name: "description", label: "Opis", type: "textarea" },
  { name: "achievements", label: "Osiągnięcia (oddziel średnikiem)", type: "text" },
  { name: "portrait_url", label: "Portret URL", type: "text" },
  { name: "banner_url", label: "Banner URL", type: "text" },
  { name: "active", label: "Aktywny", type: "checkbox" },
] as const;

const columns = [
  { key: "nickname", label: "Nick" },
  { key: "number", label: "Numer" },
  { key: "slug", label: "Slug" },
  { key: "active", label: "Aktywny" },
];

const emptyRecord = { id: "", slug: "", nickname: "", number: "", subtitle: "", signature: "", description: "", achievements: "", portrait_url: "", banner_url: "", active: false };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
  const data = await fetchTable<Record<string, any>>("players", "number");
  const normalized = data.map((row) => {
    const next = { ...row };
    if (Array.isArray(next.achievements)) {
      next.achievements = next.achievements.join("; ");
    }
    return next;
  });
  setRows(normalized);
}

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Gracze"
        table="players"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable title="Lista: Gracze" table="players" rows={rows} columns={columns} onEdit={(row) => setEditing(row)} onDeleted={load} />
    </div>
  );
}
