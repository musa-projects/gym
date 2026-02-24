"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}

export function Counter({
  end,
  suffix = "",
  prefix = "",
  duration = 2.5,
  label,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center">
      <div className="font-[var(--font-oswald)] text-5xl font-bold text-foreground md:text-6xl">
        {isInView ? (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            prefix={prefix}
            suffix={suffix}
            separator=","
          />
        ) : (
          <span>
            {prefix}0{suffix}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
