"use client";
import { useEffect, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";
import { EntityTable } from "@/components/admin/entity-table";

const fields = [
  { name: "id", label: "ID", auto: true },
  { name: "name", label: "Nazwa", type: "text" },
  { name: "logo_url", label: "Logo URL", type: "text" },
  { name: "website_url", label: "WWW", type: "text" },
  { name: "sort_order", label: "Kolejność", type: "number" },
  { name: "active", label: "Aktywny", type: "checkbox" },
] as const;

const columns = [
  { key: "name", label: "Nazwa" },
  { key: "sort_order", label: "Kolejność" },
  { key: "website_url", label: "WWW" },
  { key: "active", label: "Aktywny" },
];

const emptyRecord = { id: "", name: "", logo_url: "", website_url: "", sort_order: "", active: false };

export default function Page() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>(emptyRecord);

  async function load() {
    const data = await fetchTable("sponsors", "sort_order");
    setRows(data as Record<string, any>[]);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <EntityForm
        title="Edytuj: Sponsorzy"
        table="sponsors"
        initialValues={editing}
        fields={fields as any}
        onSaved={() => {
          setEditing(emptyRecord);
          load();
        }}
      />
      <EntityTable title="Lista: Sponsorzy" table="sponsors" rows={rows} columns={columns} onEdit={(row) => setEditing(row)} onDeleted={load} />
    </div>
  );
}
