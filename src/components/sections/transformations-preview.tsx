"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { TRANSFORMATIONS } from "@/lib/constants";

export function TransformationsPreview() {
  return (
    <section className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Transformations"
          title="See The Proof"
          description="Real transformations from real members. Your story could be next."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRANSFORMATIONS.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/50">
                {/* Before/After placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-accent to-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Before</span>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary" />
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-primary/10 backdrop-blur">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <span className="text-xs font-bold uppercase text-primary">After</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary">{t.goal}</Badge>
                    <span className="text-xs text-muted-foreground">{t.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.story}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
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
