"use client";
import { useEffect, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const fields = [
  { name: "id", label: "ID", auto: true },
  { name: "name", label: "Nazwa", type: "text" },
  { name: "slug", label: "Slug", auto: true },
  { name: "order_index", label: "Kolejność", type: "number" },
  { name: "is_current", label: "Aktualny", type: "checkbox" },
  { name: "archived_summary", label: "Opis archiwum", type: "textarea" },
] as const;

const columns = [
  { key: "name", label: "Nazwa" },
  { key: "slug", label: "Slug" },
  { key: "order_index", label: "Kolejność" },
  { key: "is_current", label: "Aktualny" },
];

const emptyRecord = { id: "", name: "", slug: "", order_index: "", is_current: false, archived_summary: "" };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
    const data = await fetchTable<Record<string, any>>("seasons", "order_index");
      setRows(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Sezony"
        table="seasons"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable title="Lista: Sezony" table="seasons" rows={rows} columns={columns} onEdit={(row) => setEditing(row)} onDeleted={load} />
    </div>
  );
}
