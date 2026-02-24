"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp, TrendingDown, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { TRANSFORMATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const goals = ["All", ...new Set(TRANSFORMATIONS.map((t) => t.goal))] as string[];

export function TransformationsContent() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = filter === "All" ? TRANSFORMATIONS : TRANSFORMATIONS.filter((t) => t.goal === filter);
  const selectedTransformation = TRANSFORMATIONS.find((t) => t.id === selected);

  return (
    <>
      <PageHeader
        label="Transformations"
        title="See The Proof"
        description="Real transformations from real members. Your story could be next."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer",
                  filter === g ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <StaggerItem key={t.id}>
                <Card
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                  onClick={() => setSelected(t.id)}
                >
                  {/* Before / After visual */}
                  <div className="relative h-56 bg-gradient-to-br from-accent to-muted">
                    <div className="absolute inset-0 flex items-center justify-center gap-6">
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-background/80 p-4 backdrop-blur">
                        <TrendingDown className="h-6 w-6 text-muted-foreground" />
                        <span className="text-lg font-bold text-foreground">{t.weightBefore}</span>
                        <span className="text-xs text-muted-foreground">Before</span>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary" />
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-primary/10 p-4 backdrop-blur">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-primary">{t.weightAfter}</span>
                        <span className="text-xs text-primary">After</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary">{t.goal}</Badge>
                      <span className="text-xs text-muted-foreground">{t.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{t.name}, {t.age}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.story}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-accent p-2 text-center">
                        <p className="text-xs text-muted-foreground">Body Fat</p>
                        <p className="text-sm font-bold text-foreground">{t.bodyFatBefore} → {t.bodyFatAfter}</p>
                      </div>
                      <div className="rounded-lg bg-accent p-2 text-center">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-bold text-foreground">{t.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransformation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{selectedTransformation.goal}</Badge>
                <Badge variant="outline">{selectedTransformation.duration}</Badge>
              </div>
              <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
                {selectedTransformation.name}, {selectedTransformation.age}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-accent p-3 text-center">
                  <p className="text-xs text-muted-foreground">Weight Before</p>
                  <p className="text-lg font-bold text-foreground">{selectedTransformation.weightBefore}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-center">
                  <p className="text-xs text-primary">Weight After</p>
                  <p className="text-lg font-bold text-primary">{selectedTransformation.weightAfter}</p>
                </div>
                <div className="rounded-xl bg-accent p-3 text-center">
                  <p className="text-xs text-muted-foreground">Fat Before</p>
                  <p className="text-lg font-bold text-foreground">{selectedTransformation.bodyFatBefore}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-center">
                  <p className="text-xs text-primary">Fat After</p>
                  <p className="text-lg font-bold text-primary">{selectedTransformation.bodyFatAfter}</p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted-foreground">{selectedTransformation.longStory}</p>
              <div className="mt-8 flex gap-3">
                <Button href="/free-trial">
                  <Target className="mr-2 h-4 w-4" /> Start Your Transformation
                </Button>
                <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
