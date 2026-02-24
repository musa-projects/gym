"use client";

import { Counter } from "@/components/shared/counter";
import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="relative border-y border-border bg-muted py-20">
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <Counter
            key={stat.label}
            end={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}
