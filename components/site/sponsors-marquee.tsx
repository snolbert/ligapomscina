import { Panel } from "@/components/ui/panel";

export function SponsorsMarquee({ sponsors }: { sponsors: any[] }) {
  return (
    <Panel className="p-6 md:p-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-gold/10 bg-black/30 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-black/50"
          >
            {/* glow background */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.15),transparent_60%)]" />
            </div>

            {/* logo */}
            <img
              src={
                sponsor.logo_url ||
                "/assets/sponsors/sponsor-placeholder.png"
              }
              alt={sponsor.name}
              className="relative z-10 max-h-10 w-auto object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </a>
        ))}
      </div>
    </Panel>
  );
}