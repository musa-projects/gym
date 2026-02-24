"use client";

import { Award, Instagram, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRAINERS } from "@/lib/constants/trainers";
import Image from "next/image";
import Link from "next/link";

export function TrainerGrid() {
  const displayed = TRAINERS.slice(0, 4);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background accents */}
      <div className="mesh-blob absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="mesh-blob absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Trainers"
          title="Led By The Best"
          description="World-class trainers dedicated to pushing you beyond your limits."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayed.map((trainer) => (
            <StaggerItem key={trainer.id}>
              <Link
                href={`/trainers/${trainer.id}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-2xl border border-[#262626] transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  {/* Trainer photo with overlays */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Default gradient overlay from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

                    {/* Hover overlay: stronger, reveals bio + instagram */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/30 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="mb-3 text-sm leading-relaxed text-foreground/80">
                        {trainer.bio}
                      </p>
                      {trainer.instagram && (
                        <div className="flex items-center gap-1.5 text-sm text-primary">
                          <Instagram className="h-4 w-4" />
                          <span>{trainer.instagram}</span>
                        </div>
                      )}
                    </div>

                    {/* Name overlay at bottom (always visible) */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                      <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground">
                        {trainer.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card body (glass) */}
                  <div className="glass border-t border-[#262626] p-5">
                    <p className="mb-2 text-sm font-semibold text-primary">
                      {trainer.specialty}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {trainer.experience} years experience
                    </p>

                    {/* Certification badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.certifications.map((cert) => (
                        <Badge
                          key={cert}
                          variant="outline"
                          className="text-[10px]"
                        >
                          <Award className="mr-1 h-3 w-3 text-secondary/70" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
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
