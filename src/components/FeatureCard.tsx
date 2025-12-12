"use client";

import { ReactNode, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  index?: number;
}

export function FeatureCard({ icon, title, desc, index = 0 }: FeatureCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [rippleConfig, setRippleConfig] = useState<{ id: number; x: string; y: string }>(
    { id: 0, x: "50%", y: "50%" }
  );

  const handleActivate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

      const x = `${((clientX - rect.left) / rect.width) * 100}%`;
      const y = `${((clientY - rect.top) / rect.height) * 100}%`;

      setIsActive(true);
      setRippleConfig((prev) => ({ id: prev.id + 1, x, y }));
    },
    []
  );

  const particles = [0, 1, 2, 3];

  return (
    <motion.button
      type="button"
      className={[
        "group relative w-full text-left",
        "rounded-2xl border bg-card/80 backdrop-blur-sm",
        "border-border/60 dark:border-slate-700/80",
        "px-5 py-6 sm:px-7 sm:py-8",
        "transition-all duration-300 ease-out",
        "shadow-md hover:shadow-2xl hover:shadow-emerald-300/40",
        "hover:-translate-y-1 hover:scale-[1.05]",
        isActive
          ? "scale-[1.04] ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-emerald-50 dark:ring-offset-slate-950"
          : "",
        "overflow-hidden",
        "bg-gradient-to-br from-slate-50/80 via-white to-slate-50/70",
        "dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900/80",
        "hover:from-emerald-50/80 hover:via-white hover:to-emerald-50/60",
        "dark:hover:from-emerald-900/40 dark:hover:via-slate-950 dark:hover:to-emerald-900/40",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleActivate}
      onTouchStart={handleActivate}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.16, 0.84, 0.44, 1],
      }}
    >
      {/* Soft inner glow on hover / active */}
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-2xl opacity-0",
          "group-hover:opacity-100",
          "transition-opacity duration-300",
          "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_55%)]",
          "dark:bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.3),_transparent_55%)]",
        ].join(" ")}
      />

      {/* Light bulb radial burst on activate */}
      <motion.span
        key={rippleConfig.id}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/35 dark:bg-emerald-400/30 blur-xl"
        style={{ left: rippleConfig.x, top: rippleConfig.y }}
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Sparkling particles */}
      {particles.map((particleIndex) => {
        const angle = (particleIndex / particles.length) * Math.PI * 2;
        return (
          <motion.span
            key={`${rippleConfig.id}-${particleIndex}`}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-emerald-300 dark:bg-emerald-400"
            style={{ left: rippleConfig.x, top: rippleConfig.y }}
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
            animate={{
              x: 40 * Math.cos(angle),
              y: 40 * Math.sin(angle),
              opacity: 0,
              scale: 0.6,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}

      <div className="relative z-10 flex flex-col gap-4">
        <motion.div
          className={[
            "inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center",
            "rounded-xl bg-emerald-600 text-white shadow-lg",
            "group-hover:bg-emerald-500 group-hover:shadow-emerald-300/60",
            "transition-all duration-300 ease-out",
          ].join(" ")}
          whileHover={{ scale: 1.08 }}
        >
          <span className="text-xl sm:text-2xl">{icon}</span>
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground dark:text-slate-50">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-slate-300/90">
            {desc}
          </p>
        </div>
      </div>

      {/* To add more cards: just add more items to the features array where FeatureCard is used. */}
    </motion.button>
  );
}
