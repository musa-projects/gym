"use client";

import { motion } from "framer-motion";
import { Users, Award, Dumbbell, Clock } from "lucide-react";
import { Counter } from "@/components/shared/counter";
import { STATS } from "@/lib/constants/testimonials";

const icons = [Users, Award, Dumbbell, Clock];
const ringPercentages = [0.93, 0.83, 0.9, 1.0];

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-[#262626] bg-[#0a0a0a] py-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-blob absolute -top-1/2 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div
          className="mesh-blob absolute -bottom-1/2 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                {/* Progress ring */}
                <div className="relative mx-auto mb-4 h-28 w-28">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(239,68,68,0.08)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={`url(#statsGradient-${i})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: ringPercentages[i] }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 2,
                        ease: "easeOut",
                        delay: 0.3 + i * 0.15,
                      }}
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(239,68,68,0.3))",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id={`statsGradient-${i}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Icon + counter inside ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon className="mb-1 h-5 w-5 text-primary" />
                    <span className="text-2xl">
                      <Counter
                        end={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                        label=""
                      />
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
