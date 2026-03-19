"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchTable } from "@/lib/admin";
import { EntityForm } from "@/components/admin/entity-form";

export default function SettingsPage() {
  const [record, setRecord] = useState<Record<string, any>>({ id: "", hero_video_url: "", home_video_label: "", next_round_label: "", next_round_date: "", current_season_id: "" });
  const [seasons, setSeasons] = useState<Record<string, any>[]>([]);

  async function load() {
    const [settingsData, seasonsData] = await Promise.all([fetchTable("site_settings"), fetchTable("seasons", "order_index")]);
    if (settingsData[0]) setRecord(settingsData[0] as any);
    setSeasons(seasonsData as Record<string, any>[]);
  }

  useEffect(() => {
    load();
  }, []);

  const fields = useMemo(
    () => [
      { name: "id", label: "ID", auto: true },
      { name: "hero_video_url", label: "URL wideo", type: "text" },
      { name: "home_video_label", label: "Podpis wideo", type: "text" },
      { name: "next_round_label", label: "Etykieta kolejki", type: "text" },
      { name: "next_round_date", label: "Data kolejki", type: "datetime-local" },
      {
        name: "current_season_id",
        label: "Aktualny sezon",
        type: "select",
        options: seasons.map((season) => ({ value: season.id, label: season.name })),
      },
    ],
    [seasons]
  );

  return <EntityForm title="Ustawienia strony głównej" table="site_settings" initialValues={record} fields={fields as any} onSaved={load} />;
}
