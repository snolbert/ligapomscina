import Link from "next/link";
import { ChevronUp } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Start" },
  { href: "/tabela", label: "Tabela" },
  { href: "/terminarz", label: "Terminarz" },
  { href: "/wyniki", label: "Wyniki" },
  { href: "/gracze", label: "Gracze" },
];

const leagueLinks = [
  { href: "/statystyki", label: "Statystyki" },
  { href: "/mvp", label: "MVP / Troll" },
  { href: "/archiwum", label: "Archiwum" },
  { href: "/newsy", label: "Aktualności" },
  { href: "/zasady", label: "Zasady" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/10 bg-black/75">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 items-center justify-center">
                <img
                  src="/assets/ui/logo.png"
                  alt="Liga Pomścina"
                  className="h-14 w-auto object-contain opacity-90 transition duration-300 hover:scale-105 hover:opacity-100 hover:drop-shadow-[0_0_12px_rgba(255,200,120,0.35)]"
                />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">
                  LigaPomścina.pl
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Oficjalny portal ligi Warcraft III. Wyniki, terminarz, tabela,
              profile zawodników i kroniki kolejnych sezonów w jednym miejscu.
            </p>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold text-white">
              Szybkie linki
            </p>

            <div className="space-y-3 text-sm text-zinc-300">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block transition hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold text-white">Liga</p>

            <div className="space-y-3 text-sm text-zinc-300">
              {leagueLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block transition hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-400">
            © 2026 Liga Pomścina. Wszelkie prawa zastrzeżone.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            <Link href="/zasady" className="transition hover:text-gold">
              Polityka prywatności
            </Link>

            <Link href="/zasady" className="transition hover:text-gold">
              Regulamin
            </Link>

            <a
              href="#top"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1da1f2]/30 bg-[#1da1f2] text-white transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(29,161,242,0.25)]"
              aria-label="Wróć na górę"
            >
              <ChevronUp className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-zinc-400 md:flex-row md:items-center md:justify-center md:px-6">
          <span>Stworzone z ❤ przez</span>

          <a
            href="https://codemastery.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center transition"
          >
            <img
              src="/assets/logotype.png"
              alt="Logotype"
              className="h-7 w-auto opacity-90 transition duration-300 group-hover:scale-110 group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}