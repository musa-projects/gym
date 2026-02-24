"use client";

import { Flame, Dumbbell, Zap, Heart, Swords, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { CLASS_TYPES } from "@/lib/constants";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Dumbbell,
  Zap,
  Heart,
  Swords,
  Users,
};

export function ClassShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Classes"
          title="Find Your Fire"
          description="From high-intensity sweat sessions to mindful recovery, we have the perfect class for every fitness level."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLASS_TYPES.map((cls) => {
            const Icon = iconMap[cls.icon] || Dumbbell;
            return (
              <StaggerItem key={cls.slug}>
                <Link href={`/classes/${cls.slug}`}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className={`rounded-xl bg-accent p-3 ${cls.color}`}>
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
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{cls.duration} min</span>
                        <span>&middot;</span>
                        <span>{cls.difficulty}</span>
                      </div>
                    </CardContent>
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
