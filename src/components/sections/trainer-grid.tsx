"use client";

import { Award, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { TRAINERS } from "@/lib/constants";

export function TrainerGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Trainers"
          title="Led By The Best"
          description="World-class trainers dedicated to pushing you beyond your limits."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((trainer) => (
            <StaggerItem key={trainer.id}>
              <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/50">
                {/* Photo placeholder */}
                <div className="relative h-72 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-3xl font-bold text-muted-foreground">
                      {trainer.name.charAt(0)}
                    </div>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-4">
                    <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-foreground">{trainer.name}</h3>
                  <p className="text-sm text-primary">{trainer.specialty}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {trainer.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        <Award className="mr-1 h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {trainer.experience} years experience
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-12 text-center">
          <Button variant="outline" href="/trainers">
            Meet All Trainers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
