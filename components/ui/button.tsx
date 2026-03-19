import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const styles = cn(
  "relative inline-flex items-center justify-center overflow-hidden rounded-[10px]",
  "border border-[#b8892d] px-5 py-2.5 font-semibold tracking-[0.02em]",
  "text-[#f4d58a] shadow-[0_0_0_1px_rgba(255,214,102,0.12),0_10px_24px_rgba(0,0,0,0.35)]",
  "bg-[linear-gradient(180deg,rgba(36,86,170,0.98)_0%,rgba(18,42,96,0.98)_48%,rgba(8,18,46,0.98)_100%)]",
  "transition duration-200 hover:-translate-y-0.5 hover:border-[#d3a94a] hover:text-[#ffe7a8]",
  "hover:shadow-[0_0_0_1px_rgba(255,214,102,0.22),0_0_24px_rgba(80,140,255,0.15),0_14px_28px_rgba(0,0,0,0.42)]",
  "before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[8px]",
  "before:bg-[linear-gradient(180deg,rgba(103,164,255,0.3)_0%,rgba(255,255,255,0.08)_18%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.18)_100%)]",
  "after:pointer-events-none after:absolute after:inset-x-3 after:top-[2px] after:h-[1px] after:bg-white/40"
);

export function Button({
  href,
  children,
  className,
  type = "button",
  onClick,
}: Props) {
  const content = (
    <span className="relative z-10 flex items-center justify-center">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(styles, className)}
    >
      {content}
    </button>
  );
}