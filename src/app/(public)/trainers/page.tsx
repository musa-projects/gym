import type { Metadata } from "next";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { TRAINERS } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Trainers",
  description:
    "Meet the world-class trainers at Big Vision Gym. Certified experts in strength, HIIT, boxing, yoga, and more.",
};

export default function TrainersPage() {
  return (
    <>
      <PageHeader
        label="Our Team"
        title="Led By The Best"
        description="World-class trainers dedicated to pushing you beyond your limits."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TRAINERS.map((trainer) => (
              <Link key={trainer.id} href={`/trainers/${trainer.id}`}>
                <Card className="group h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                  <div className="relative h-80 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-4xl font-bold text-muted-foreground">
                        {trainer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-6">
                      <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {trainer.name}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{trainer.specialty}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{trainer.experience} years experience</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {trainer.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          <Award className="mr-1 h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      View Profile <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
