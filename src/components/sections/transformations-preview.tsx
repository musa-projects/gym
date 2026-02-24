"use client";

import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRANSFORMATIONS } from "@/lib/constants/transformations";
import Image from "next/image";
import { cn } from "@/lib/utils";

function parseWeight(value: string): number {
  return parseFloat(value.replace(/[^\d.]/g, ""));
}

function parseBodyFat(value: string): number {
  return parseFloat(value.replace("%", ""));
}

export function TransformationsPreview() {
  const displayed = TRANSFORMATIONS.slice(0, 3);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background accents */}
      <div className="mesh-blob absolute top-20 -right-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="mesh-blob absolute bottom-20 -left-32 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Transformations"
          title="See The Proof"
          description="Real transformations from real members. Your story could be next."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {displayed.map((t) => {
            const weightBefore = parseWeight(t.weightBefore);
            const weightAfter = parseWeight(t.weightAfter);
            const weightDiff = Math.abs(weightAfter - weightBefore);
            const weightLost = weightAfter < weightBefore;

            const bfBefore = parseBodyFat(t.bodyFatBefore);
            const bfAfter = parseBodyFat(t.bodyFatAfter);
            const bfDiff = Math.abs(bfAfter - bfBefore);
            const bfLost = bfAfter < bfBefore;

            return (
              <StaggerItem key={t.id}>
                <div className="glass group overflow-hidden rounded-2xl border border-[#262626] transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  {/* Before / After images */}
                  <div className="relative h-64 overflow-hidden">
                    {/* Before image - left half */}
                    <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                      <Image
                        src={t.imageBefore}
                        alt={`${t.name} before`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                      {/* Subtle dark overlay */}
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* After image - right half */}
                    <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                      <Image
                        src={t.imageAfter}
                        alt={`${t.name} after`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </div>

                    {/* Center divider */}
                    <div className="absolute inset-y-0 left-1/2 z-10 -translate-x-px border-l-2 border-primary" />

                    {/* Before label - bottom left */}
                    <div className="glass-light absolute bottom-3 left-3 z-10 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Before
                    </div>

                    {/* After label - bottom right */}
                    <div className="glass-light absolute bottom-3 right-3 z-10 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      After
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    {/* Name, badge, duration */}
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide text-foreground">
                        {t.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {t.duration}
                      </span>
                    </div>

                    <Badge variant="secondary" className="mb-4">
                      {t.goal}
                    </Badge>

                    {/* Stats row */}
                    <div className="mb-4 flex items-center gap-4">
                      {/* Weight change */}
                      <div className="flex items-center gap-1.5 text-sm">
                        {weightLost ? (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        )}
                        <span
                          className={cn(
                            "font-semibold",
                            weightLost ? "text-green-500" : "text-secondary"
                          )}
                        >
                          {weightLost ? "-" : "+"}
                          {weightDiff.toFixed(0)} kg
                        </span>
                      </div>

                      {/* Body fat change */}
                      <div className="flex items-center gap-1.5 text-sm">
                        {bfLost ? (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        )}
                        <span
                          className={cn(
                            "font-semibold",
                            bfLost ? "text-green-500" : "text-secondary"
                          )}
                        >
                          {bfLost ? "-" : "+"}
                          {bfDiff.toFixed(0)}% BF
                        </span>
                      </div>
                    </div>

                    {/* Story (truncated 2 lines) */}
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {t.story}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="mt-12 text-center">
          <Button variant="outline" href="/transformations">
            View All Transformations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
