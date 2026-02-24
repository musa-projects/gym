"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Dumbbell, Zap, Heart, Swords, Users, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { CLASS_TYPES, WEEKLY_SCHEDULE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = { Flame, Dumbbell, Zap, Heart, Swords, Users };

const categories = ["All", ...CLASS_TYPES.map((c) => c.name)] as const;

export function ClassesContent() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? CLASS_TYPES : CLASS_TYPES.filter((c) => c.name === filter);

  return (
    <>
      <PageHeader
        label="Classes"
        title="Find Your Fire"
        description="From high-intensity sweat sessions to mindful recovery — find the perfect class for your goals."
      />

      {/* Filter */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer",
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Class Grid */}
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cls) => {
              const Icon = iconMap[cls.icon] || Dumbbell;
              return (
                <StaggerItem key={cls.slug}>
                  <Link href={`/classes/${cls.slug}`}>
                    <Card className="group h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                      {/* Color bar */}
                      <div className={cn("h-2", cls.bgColor)} />
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className={cn("rounded-xl p-3", cls.bgColor, cls.color)}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge variant="outline">{cls.difficulty}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {cls.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {cls.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {cls.duration} min
                          </span>
                          <span>~{cls.calories} cal</span>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Schedule" title="Weekly Timetable" description="Plan your week with our class schedule." />

          <AnimatedSection>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Time</th>
                    {WEEKLY_SCHEDULE.map((d) => (
                      <th key={d.day} className="px-4 py-3 text-center text-sm font-bold text-foreground">
                        {d.day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["06:00", "08:00", "10:00", "12:00", "14:00", "17:00", "19:00"].map((time) => (
                    <tr key={time} className="border-b border-border">
                      <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{time}</td>
                      {WEEKLY_SCHEDULE.map((day) => {
                        const cls = day.classes.find((c) => c.time === time);
                        if (!cls) return <td key={day.day} className="px-4 py-3" />;
                        const classType = CLASS_TYPES.find((ct) => ct.name === cls.name);
                        return (
                          <td key={day.day} className="px-2 py-2">
                            <div className={cn("rounded-lg p-2 text-center text-xs", classType?.bgColor || "bg-accent")}>
                              <p className={cn("font-bold", classType?.color || "text-foreground")}>{cls.name}</p>
                              <p className="text-muted-foreground">{cls.trainer}</p>
                              <p className="text-muted-foreground">{cls.duration}m</p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground md:text-4xl">
            Ready to Try a Class?
          </h2>
          <p className="mt-4 text-muted-foreground">Your first session is on us. No commitment required.</p>
          <Button size="lg" className="mt-8" href="/free-trial">
            Book Free Trial
          </Button>
        </div>
      </section>
    </>
  );
}
