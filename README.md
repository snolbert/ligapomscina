# Liga Pomścina

Kompletny projekt Next.js + Supabase:
- publiczny portal ligi
- panel admina pod `/admin`
- logowanie admina przez Supabase Auth
- CRUD dla graczy, sezonów, kolejek, meczów, newsów, sponsorów, zasad i ustawień
- SQL schema + RLS + seed demo

## Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Utwórz projekt.
2. W SQL Editor uruchom `supabase/schema.sql`.
3. W Authentication dodaj użytkownika admina.
4. W tabeli `profiles` ustaw mu `is_admin = true`.

## Assety

Podmieniaj pliki w `public/assets/...`.
