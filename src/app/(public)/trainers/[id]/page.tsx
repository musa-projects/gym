import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, Instagram } from "lucide-react";
import { TRAINERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function generateStaticParams() {
  return TRAINERS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trainer = TRAINERS.find((t) => t.id === id);
  if (!trainer) return { title: "Trainer Not Found" };
  return {
    title: `${trainer.name} - ${trainer.specialty}`,
    description: trainer.bio,
  };
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trainer = TRAINERS.find((t) => t.id === id);
  if (!trainer) notFound();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/trainers" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Trainers
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Photo / Avatar */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex h-full items-center justify-center">
                <span className="text-7xl font-bold text-muted-foreground/30">{trainer.name.charAt(0)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="primary" className="flex-1" href="/free-trial">
                Book Session
              </Button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Instagram className="h-4 w-4" /> {trainer.instagram}
            </p>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
              {trainer.name}
            </h1>
            <p className="mt-2 text-lg text-primary">{trainer.specialty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{trainer.experience} years experience</p>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-bold text-foreground">About</h3>
                <p className="leading-relaxed text-muted-foreground">{trainer.longBio}</p>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-foreground">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        <Award className="mr-1 h-3 w-3" /> {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-foreground">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialties.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-bold text-foreground">Classes</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.classTypes.map((c) => (
                    <Link key={c} href={`/classes/${c.toLowerCase().replace(/ /g, "-")}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/20">
                        {c}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
