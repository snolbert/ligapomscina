import Link from "next/link";
import { Twitch, Youtube, MessageCircle } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { StandingsTable } from "@/components/site/standings-table";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCurrentSeason,
  getLatestPlayedRoundBundle,
  getNews,
  getNextRound,
  getPlayers,
  getSettings,
  getSponsors,
  getStandings,
} from "@/lib/queries";
import { MatchCard } from "@/components/site/match-card";
import { PlayerCard } from "@/components/site/player-card";
import { NewsCard } from "@/components/site/news-card";
import { SponsorsMarquee } from "@/components/site/sponsors-marquee";
import { Panel } from "@/components/ui/panel";;

function AccoladeCard({
  title,
  player,
  count,
  emptyLabel,
}: {
  title: string;
  player: any;
  count: number;
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{title}</p>

      {player ? (
        <div className="mt-4 flex items-center gap-4">
          <img
            src={player.portrait_url || "/assets/players/player-placeholder.png"}
            alt={player.nickname}
            className="h-16 w-16 rounded-2xl border border-gold/20 object-cover"
          />

          <div>
            <p className="font-display text-2xl text-gold">{player.nickname}</p>
            <p className="text-sm text-zinc-400">
              Łącznie: <span className="text-zinc-200">{count}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-zinc-400">{emptyLabel}</p>
      )}
    </div>
  );
}

export default async function HomePage() {
  const settings = await getSettings();
  const season = await getCurrentSeason();
  const standings = season ? await getStandings(season.id) : [];
  const players = await getPlayers();
  const nextRound = await getNextRound();
  const news = await getNews(3);
  const sponsors = await getSponsors();
  const latestPlayedRound = season
    ? await getLatestPlayedRoundBundle(season.id)
    : { round: null, matches: [], mvp: null, troll: null };

  return (
    <main>
      <Hero
        nextRoundLabel={settings?.next_round_label || nextRound?.name}
        nextRoundDate={settings?.next_round_date || nextRound?.starts_at}
        videoUrl={settings?.hero_video_url}
      />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <StandingsTable rows={standings} compact />

          <Panel className="p-6">
            <SectionHeading
              eyebrow="Studio kolejki"
              title="Wyróżnienia ostatniej kolejki"
              description="Podsumowanie ostatniej rozegranej rundy."
            />

            <div className="space-y-4">
              <AccoladeCard
                title="MVP ostatniej kolejki"
                player={latestPlayedRound.mvp?.player}
                count={latestPlayedRound.mvp?.total_count ?? 0}
                emptyLabel="Brak przyznanego MVP w ostatniej rozegranej kolejce."
              />

              <AccoladeCard
                title="Troll kolejki"
                player={latestPlayedRound.troll?.player}
                count={latestPlayedRound.troll?.total_count ?? 0}
                emptyLabel="Brak danych do wyłonienia trolla kolejki."
              />
            </div>
          </Panel>
        </section>

        <section className="rounded-2xl border border-gold/15 bg-black/35 px-5 py-4 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold/65">
                Social media
              </p>
              <p className="mt-1 font-display text-2xl text-gold">
                Szukaj nas na Twitch / YouTube / Discord
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://twitch.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
              >
                <Twitch className="h-4 w-4" />
                Twitch
              </Link>

              <Link
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
              >
                <Youtube className="h-4 w-4" />
                YouTube
              </Link>

              <Link
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
              >
                <MessageCircle className="h-4 w-4" />
                Discord
              </Link>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Mecze"
            title="Ostatnia rozegrana kolejka"
            description={
              latestPlayedRound.round?.name
                ? `Poniżej widzisz komplet rozegranych meczów z ${latestPlayedRound.round.name}.`
                : "Brak rozegranych kolejek do wyświetlenia."
            }
          />

          {latestPlayedRound.matches?.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {latestPlayedRound.matches.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <Panel className="p-6 text-zinc-400">
              Nie ma jeszcze rozegranej kolejki do pokazania.
            </Panel>
          )}
        </section>

        

        <section>
          <SectionHeading
            eyebrow="Zawodnicy"
            title="Gracze aktualnego sezonu"
            description="Gracze biorący udział w V sezonie Ligi Pomścina."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {players.map((player: any) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Aktualności" title="Kroniki ligi" />
          <div className="grid gap-6 lg:grid-cols-3">
            {news.map((entry: any) => (
              <NewsCard key={entry.id} news={entry} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Partnerzy" title="Sponsorzy ligi" />
          <SponsorsMarquee sponsors={sponsors} />
        </section>
      </div>
    </main>
  );
}