import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0b0907",
        ember: "#c79b47",
        gold: "#d7b56d",
        stone: "#1b1713",
        slategold: "#5f4d2d"
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(215,181,109,0.2), 0 16px 40px rgba(0,0,0,0.45)",
        glow: "0 0 24px rgba(215,181,109,0.18)"
      },
      backgroundImage: {
        "ornate-frame": "linear-gradient(145deg, rgba(215,181,109,0.35), rgba(255,255,255,0.02))",
        "stone-panel": "linear-gradient(180deg, rgba(30,25,20,0.96), rgba(12,10,8,0.98))",
        "hero-overlay": "radial-gradient(circle at top, rgba(215,181,109,0.18), transparent 45%), linear-gradient(180deg, rgba(10,8,7,0.7), rgba(10,8,7,0.96))"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        floaty: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-4px)" } },
        pulsegold: { "0%,100%": { boxShadow: "0 0 0 rgba(215,181,109,0.15)" }, "50%": { boxShadow: "0 0 28px rgba(215,181,109,0.3)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        pulsegold: "pulsegold 3s ease-in-out infinite",
        marquee: "marquee 24s linear infinite"
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        accent: ["MedievalSharp", "serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
