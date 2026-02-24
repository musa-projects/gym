import type { Metadata } from "next";
import { Heart, Dumbbell, Zap, Users, Swords, Sparkles, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FACILITY_ZONES, AMENITIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Tour Big Vision Gym's world-class facilities: cardio zone, free weights, studios, boxing ring, recovery center, and more.",
};

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Dumbbell,
  Zap,
  Users,
  Swords,
  Sparkles,
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        label="Our Space"
        title="World-Class Facilities"
        description="Over 15,000 sq ft of premium fitness space designed to inspire performance."
      />

      {/* Zones */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FACILITY_ZONES.map((zone) => {
              const Icon = iconMap[zone.icon] || Dumbbell;
              return (
                <Card key={zone.name} className="group overflow-hidden transition-all duration-300 hover:border-primary/50">
                  <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-primary/20 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="outline">{zone.size}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{zone.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zone.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {zone.equipment.map((eq) => (
                        <Badge key={eq} variant="outline" className="text-xs">{eq}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
            Amenities
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AMENITIES.map((amenity) => (
              <div key={amenity.name} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground">{amenity.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
