create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nickname text not null,
  number integer not null,
  subtitle text,
  signature text,
  description text,
  achievements text[] default '{}',
  portrait_url text,
  banner_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  order_index integer not null default 1,
  is_current boolean not null default false,
  archived_summary text,
  created_at timestamptz not null default now()
);

create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  round_number integer not null,
  name text not null,
  starts_at timestamptz,
  created_at timestamptz not null default now()
);

do $$ begin
  create type mode_type as enum ('survival_chaos','legion_td');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('scheduled','played','postponed','walkover');
exception when duplicate_object then null; end $$;

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  round_id uuid references rounds(id) on delete set null,
  mode mode_type not null,
  status match_status not null default 'scheduled',
  title text not null,
  scheduled_at timestamptz,
  commentary text,
  replay_url text,
  video_url text,
  image_url text,
  mvp_player_id uuid references players(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  team integer,
  placement integer,
  points_awarded integer not null default 0
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  lead text,
  content text,
  image_url text,
  season_id uuid references seasons(id) on delete set null,
  mode mode_type,
  published_at timestamptz default now(),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order integer not null default 1,
  active boolean not null default true
);

create table if not exists rules_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  sort_order integer not null default 1
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_video_url text,
  home_video_label text,
  next_round_label text,
  next_round_date timestamptz,
  current_season_id uuid references seasons(id) on delete set null
);

create table if not exists standings_cache (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  overall_points integer not null default 0,
  survival_points integer not null default 0,
  legion_points integer not null default 0,
  wins integer not null default 0,
  matches_played integer not null default 0,
  form text[] not null default '{"W","L","W"}',
  manual_override boolean not null default false,
  unique(season_id, player_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table players enable row level security;
alter table seasons enable row level security;
alter table rounds enable row level security;
alter table matches enable row level security;
alter table match_participants enable row level security;
alter table news enable row level security;
alter table sponsors enable row level security;
alter table rules_sections enable row level security;
alter table site_settings enable row level security;
alter table standings_cache enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

create policy "public read players" on players for select using (true);
create policy "public read seasons" on seasons for select using (true);
create policy "public read rounds" on rounds for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read participants" on match_participants for select using (true);
create policy "public read news" on news for select using (is_published = true);
create policy "public read sponsors" on sponsors for select using (active = true);
create policy "public read rules" on rules_sections for select using (true);
create policy "public read settings" on site_settings for select using (true);
create policy "public read standings" on standings_cache for select using (true);
create policy "profile read own" on profiles for select using (auth.uid() = id or public.is_admin());

create policy "admin all players" on players for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all seasons" on seasons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all rounds" on rounds for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all matches" on matches for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all participants" on match_participants for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all news" on news for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all sponsors" on sponsors for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all rules" on rules_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all settings" on site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all standings" on standings_cache for all using (public.is_admin()) with check (public.is_admin());

insert into seasons (id, name, slug, order_index, is_current, archived_summary) values
('10000000-0000-0000-0000-000000000001', 'Sezon I', 'sezon-i', 1, false, 'Pierwsze starcie założycieli ligi.'),
('10000000-0000-0000-0000-000000000002', 'Sezon II', 'sezon-ii', 2, false, 'Sezon wzrostu formy i pierwszych legend.'),
('10000000-0000-0000-0000-000000000003', 'Sezon III', 'sezon-iii', 3, false, 'Mocna walka o każdy punkt.'),
('10000000-0000-0000-0000-000000000004', 'Sezon IV', 'sezon-iv', 4, false, 'Sezon pełen zwrotów akcji.'),
('10000000-0000-0000-0000-000000000005', 'Sezon V', 'sezon-v', 5, true, 'Aktualny sezon ligi Pomścina.')
on conflict do nothing;

insert into players (id, slug, nickname, number, subtitle, signature, description, achievements, portrait_url, banner_url, active) values
('20000000-0000-0000-0000-000000000001', 'gracz-1', 'Gracz 1', 7, 'Weteran alei chaosu', 'Nacisk, presja, dominacja.', 'Placeholder profilu zawodnika do podmiany w panelu admina.', array['MVP kolejki', '3 zwycięstwa z rzędu'], '/assets/players/player-1-portrait.png', '/assets/players/player-1-banner.jpg', true),
('20000000-0000-0000-0000-000000000002', 'gracz-2', 'Gracz 2', 13, 'Taktyczny egzekutor', 'Plan > chaos.', 'Placeholder profilu zawodnika do podmiany w panelu admina.', array['Najlepsza forma tygodnia'], '/assets/players/player-2-portrait.png', '/assets/players/player-2-banner.jpg', true),
('20000000-0000-0000-0000-000000000003', 'gracz-3', 'Gracz 3', 21, 'Architekt comebacków', 'Spokój wygrywa.', 'Placeholder profilu zawodnika do podmiany w panelu admina.', array['Król końcówek'], '/assets/players/player-3-portrait.png', '/assets/players/player-3-banner.jpg', true),
('20000000-0000-0000-0000-000000000004', 'gracz-4', 'Gracz 4', 31, 'Kat Legion TD', 'Twardo do końca.', 'Placeholder profilu zawodnika do podmiany w panelu admina.', array['Mistrz obrony'], '/assets/players/player-4-portrait.png', '/assets/players/player-4-banner.jpg', true)
on conflict do nothing;

insert into rounds (id, season_id, round_number, name, starts_at) values
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 1, 'Kolejka I', now() + interval '7 day'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 2, 'Kolejka II', now() + interval '14 day')
on conflict do nothing;

insert into matches (id, season_id, round_id, mode, status, title, scheduled_at, commentary, image_url, video_url, replay_url, mvp_player_id) values
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'survival_chaos', 'played', 'Kolejka I · Survival Chaos', now() - interval '2 day', 'Mocny otwierający występ i walka do samego końca.', '/assets/backgrounds/news-placeholder.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://example.com/replay', '20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'legion_td', 'scheduled', 'Kolejka I · Legion TD', now() + interval '3 day', 'Zapowiedź starcia w ustawieniu 1v4 kontra 2v3.', '/assets/backgrounds/news-placeholder.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', null, null)
on conflict do nothing;

insert into match_participants (match_id, player_id, team, placement, points_awarded) values
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', null, 1, 4),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', null, 2, 3),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', null, 3, 2),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', null, 4, 1),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 1, null, 0),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 1, null, 0),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 2, null, 0),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 2, null, 0)
on conflict do nothing;

insert into standings_cache (season_id, player_id, overall_points, survival_points, legion_points, wins, matches_played, form, manual_override) values
('10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 4, 4, 0, 1, 1, '{"W","W","L"}', false),
('10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 3, 3, 0, 0, 1, '{"W","L","W"}', false),
('10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 2, 2, 0, 0, 1, '{"L","W","L"}', false),
('10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 1, 1, 0, 0, 1, '{"L","L","W"}', false)
on conflict do nothing;

insert into news (id, title, slug, lead, content, image_url, season_id, mode, published_at, is_featured, is_published) values
('50000000-0000-0000-0000-000000000001', 'Otwarcie Sezonu V', 'otwarcie-sezonu-v', 'Liga Pomścina wraca z nowym sezonem i nowym portalem.', 'To jest przykładowa treść newsa. Możesz ją edytować z panelu /admin/news i publikować własne materiały.', '/assets/backgrounds/news-placeholder.jpg', '10000000-0000-0000-0000-000000000005', 'survival_chaos', now() - interval '1 day', true, true),
('50000000-0000-0000-0000-000000000002', 'MVP pierwszej kolejki', 'mvp-pierwszej-kolejki', 'Pierwsze wyróżnienie sezonu trafia do Gracza 1.', 'Opis występu MVP i podsumowanie jego przewagi w meczu.', '/assets/backgrounds/news-placeholder.jpg', '10000000-0000-0000-0000-000000000005', 'survival_chaos', now() - interval '12 hour', true, true),
('50000000-0000-0000-0000-000000000003', 'Zapowiedź Legion TD', 'zapowiedz-legion-td', 'Nadciąga kolejny mecz i nowe ustawienie duetów.', 'Druga część kolejki rozegra się w trybie Legion TD.', '/assets/backgrounds/news-placeholder.jpg', '10000000-0000-0000-0000-000000000005', 'legion_td', now() - interval '6 hour', false, true)
on conflict do nothing;

insert into sponsors (id, name, logo_url, website_url, sort_order, active) values
('60000000-0000-0000-0000-000000000001', 'Sponsor I', '/assets/sponsors/sponsor-1.png', 'https://example.com', 1, true),
('60000000-0000-0000-0000-000000000002', 'Sponsor II', '/assets/sponsors/sponsor-2.png', 'https://example.com', 2, true),
('60000000-0000-0000-0000-000000000003', 'Sponsor III', '/assets/sponsors/sponsor-3.png', 'https://example.com', 3, true)
on conflict do nothing;

insert into rules_sections (id, title, slug, content, sort_order) values
('70000000-0000-0000-0000-000000000001', 'Zasady ogólne', 'zasady-ogolne', '1. Liga składa się z Survival Chaos i Legion TD.
2. Każda kolejka ma własny termin.
3. Wyniki publikuje admin panelu.', 1),
('70000000-0000-0000-0000-000000000002', 'Punktacja', 'punktacja', 'Survival Chaos:
1 miejsce = 4 pkt
2 miejsce = 3 pkt
3 miejsce = 2 pkt
4 miejsce = 1 pkt

Legion TD:
Wygrana drużyna = 2 pkt dla każdego gracza.', 2)
on conflict do nothing;

insert into site_settings (id, hero_video_url, home_video_label, next_round_label, next_round_date, current_season_id) values
('80000000-0000-0000-0000-000000000001', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Ostatnia rozgrywka', 'Kolejka I · Legion TD', now() + interval '3 day', '10000000-0000-0000-0000-000000000005')
on conflict do nothing;
