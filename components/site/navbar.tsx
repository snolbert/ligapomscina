"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Shield, Swords } from "lucide-react";
const links = [{ href: "/", label: "Główna" },{ href: "/tabela", label: "Tabela" },{ href: "/terminarz", label: "Terminarz" },{ href: "/wyniki", label: "Wyniki" },{ href: "/gracze", label: "Gracze" },{ href: "/statystyki", label: "Statystyki" },{ href: "/zasady", label: "Zasady" },{ href: "/archiwum", label: "Archiwum" },{ href: "/newsy", label: "Newsy" }];
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-abyss/90 backdrop-blur-xl overflow-visible">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="relative flex items-center gap-3 overflow-visible">
          <div className="relative h-10 w-14 shrink-0 overflow-visible">
            <img
              src="/assets/ui/logo.png"
              alt="Liga Pomścina"
              className="absolute left-1/2 top-1/2 h-20 w-auto max-w-none -translate-x-1/2 -translate-y-[38%]
                        drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]
                        transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Liga Warcraft III
            </p>
          </div> */}
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm text-zinc-200 transition hover:text-gold">{link.label}</Link>)}
          {/* <Link href="/admin" className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-3 py-2 text-sm text-gold transition hover:border-gold hover:bg-gold/5"><Swords className="h-4 w-4" />Admin</Link> */}
        </nav>
        <button onClick={() => setOpen(!open)} className="rounded-xl border border-gold/30 p-2 text-gold md:hidden"><Menu className="h-5 w-5" /></button>
      </div>
      {open ? <div className="border-t border-gold/10 px-4 py-4 md:hidden"><div className="flex flex-col gap-3">{links.map((link) => <Link key={link.href} href={link.href} className="text-sm text-zinc-200">{link.label}</Link>)}<Link href="/admin" className="text-sm text-gold">Admin</Link></div></div> : null}
    </header>
  );
}
