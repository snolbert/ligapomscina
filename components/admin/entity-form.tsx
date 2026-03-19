"use client";
import { useEffect, useMemo, useState } from "react";
import { upsertRecord } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export type SelectOption = { value: string; label: string };

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "datetime-local" | "checkbox" | "select";
  placeholder?: string;
  options?: SelectOption[];
  auto?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAutoSlugSource(table: string, values: Record<string, any>) {
  switch (table) {
    case "players":
      return values.nickname;
    case "seasons":
    case "news":
    case "rules_sections":
      return values.name || values.title;
    default:
      return values.title || values.name || values.nickname;
  }
}

export function EntityForm({
  title,
  table,
  initialValues,
  fields,
  onSaved,
}: {
  title: string;
  table: string;
  initialValues: Record<string, any>;
  fields: FieldConfig[];
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [saving, setSaving] = useState(false);

  useEffect(() => setValues(initialValues), [initialValues]);

  const isEditing = Boolean(values.id);
  const autoSlug = useMemo(() => slugify(String(getAutoSlugSource(table, values) || "")), [table, values]);

  const update = (name: string, value: any) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <Panel className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-gold">{title}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {isEditing ? "Edytujesz istniejący rekord." : "ID i slug generują się automatycznie przy tworzeniu rekordu."}
          </p>
        </div>
      </div>
      <form
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          const payload = Object.fromEntries(
            fields.map((field) => [field.name, values[field.name]])
          ) as Record<string, any>;

          if (!payload.id) delete payload.id;
          if ("slug" in payload && !payload.slug) payload.slug = autoSlug || null;

          Object.keys(payload).forEach((key) => {
            if (payload[key] === "") payload[key] = null;
            if (key === "achievements" && typeof payload[key] === "string") {
              payload[key] = String(payload[key])
                .split(";")
                .map((part) => part.trim())
                .filter(Boolean);
            }
          });

          const { error } = await upsertRecord(table, payload);
          setSaving(false);
          if (error) return alert(error.message);
          alert("Zapisano.");
          onSaved?.();
        }}
      >
        {fields.map((field) => (
          <label key={field.name} className="grid gap-2 text-sm">
            <span className="flex items-center justify-between gap-3 text-zinc-300">
              <span>{field.label}</span>
              {field.auto && (
                <span className="text-xs uppercase tracking-[0.2em] text-gold/70">
                  auto
                  {field.name === "slug" && autoSlug ? `: ${autoSlug}` : ""}
                </span>
              )}
            </span>

            {field.type === "textarea" ? (
              <textarea
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="min-h-32 rounded-2xl border border-gold/20 bg-black/20 px-4 py-3 outline-none focus:border-gold"
              />
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={Boolean(values[field.name])}
                onChange={(e) => update(field.name, e.target.checked)}
                className="h-5 w-5 rounded border border-gold/20 bg-black/20"
              />
            ) : field.type === "select" ? (
              <select
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, e.target.value)}
                className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3 outline-none focus:border-gold"
              >
                <option value="">Wybierz...</option>
                {(field.options || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.auto ? (
              <div className="rounded-2xl border border-dashed border-gold/20 bg-black/10 px-4 py-3 text-zinc-400">
                {field.name === "id"
                  ? isEditing
                    ? values.id
                    : "UUID zostanie wygenerowany automatycznie"
                  : autoSlug || "Slug wygeneruje się automatycznie po wpisaniu nazwy"}
              </div>
            ) : (
              <input
                type={field.type || "text"}
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
                placeholder={field.placeholder}
                className="rounded-2xl border border-gold/20 bg-black/20 px-4 py-3 outline-none focus:border-gold"
              />
            )}
          </label>
        ))}
        <Button type="submit" className="w-fit">
          {saving ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </form>
    </Panel>
  );
}
