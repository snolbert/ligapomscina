import { cn } from "@/lib/utils";
export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-gold/20 bg-stone-panel shadow-panel", className)}>
      <div className="pointer-events-none absolute inset-0 bg-ornate-frame opacity-50" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
