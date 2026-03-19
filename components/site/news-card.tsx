import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
export function NewsCard({ news }: { news: any }) {
  return (
    <Link href={`/newsy/${news.slug}`} className="group block">
      <Panel className="h-full overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-glow">
        <div className="aspect-[16/9] overflow-hidden"><img src={news.image_url || "/assets/backgrounds/news-placeholder.jpg"} alt={news.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
        <div className="space-y-3 p-5"><p className="text-xs uppercase tracking-[0.25em] text-gold/70">{formatDate(news.published_at)}</p><h3 className="font-display text-2xl text-gold">{news.title}</h3><p className="line-clamp-3 text-sm text-zinc-300">{news.lead}</p></div>
      </Panel>
    </Link>
  );
}
