"use client";
import { useEffect, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const fields = [
  { name: "id", label: "ID", auto: true },
  { name: "title", label: "Tytuł", type: "text" },
  { name: "slug", label: "Slug", auto: true },
  { name: "content", label: "Treść", type: "textarea" },
  { name: "sort_order", label: "Kolejność", type: "number" },
] as const;

const columns = [
  { key: "title", label: "Tytuł" },
  { key: "slug", label: "Slug" },
  { key: "sort_order", label: "Kolejność" },
];

const emptyRecord = { id: "", title: "", slug: "", content: "", sort_order: "" };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
    const data = await fetchTable("rules_sections", "sort_order");
    setRows(data as Record<string, any>[]);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Zasady"
        table="rules_sections"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable title="Lista: Zasady" table="rules_sections" rows={rows} columns={columns} onEdit={(row) => setEditing(row)} onDeleted={load} />
    </div>
  );
}
