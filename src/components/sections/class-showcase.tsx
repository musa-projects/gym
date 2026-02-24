"use client";

import { Flame, Dumbbell, Zap, Heart, Swords, Users, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CLASS_TYPES } from "@/lib/constants/classes";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Dumbbell,
  Zap,
  Heart,
  Swords,
  Users,
};

const difficultyColor: Record<string, string> = {
  Advanced: "text-red-400",
  Intermediate: "text-orange-400",
  "All Levels": "text-green-400",
};

const classes = CLASS_TYPES.slice(0, 6);

export function ClassShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Classes"
          title="Find Your Fire"
          description="From high-intensity sweat sessions to mindful recovery, we have the perfect class for every fitness level."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const Icon = iconMap[cls.icon] || Dumbbell;
            return (
              <StaggerItem key={cls.slug}>
                <Link href={`/classes/${cls.slug}`} className="group block h-full">
                  <div
                    className={cn(
                      "glass relative h-full overflow-hidden rounded-2xl border border-[#262626] transition-all duration-500",
                      "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
                      "group-hover:gradient-border"
                    )}
                  >
                    {/* Image section */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={cls.image}
                        alt={cls.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Gradient overlay from card color */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent"
                        )}
                      />

                      {/* Glass icon badge - bottom left */}
                      <div className="absolute bottom-3 left-3">
                        <div
                          className={cn(
                            "glass-light flex h-10 w-10 items-center justify-center rounded-xl",
                            cls.color
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Difficulty badge - top right */}
                      <div className="absolute top-3 right-3">
                        <div className="glass-light rounded-full px-3 py-1">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              difficultyColor[cls.difficulty] || "text-muted-foreground"
                            )}
                          >
                            {cls.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3
                        className={cn(
                          "font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground",
                          "transition-colors duration-300 group-hover:text-primary"
                        )}
                      >
                        {cls.name}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {cls.description}
                      </p>

                      {/* Footer: duration + difficulty */}
                      <div className="mt-4 flex items-center justify-between border-t border-[#262626] pt-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{cls.duration} min</span>
                        </div>
                        <Badge variant="outline" className="border-[#262626] text-xs">
                          {cls.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* View All Classes button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" href="/classes">
            View All Classes
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
