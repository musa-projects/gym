import type { Metadata } from "next";
import { Calendar, Trophy, BookOpen, PartyPopper, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EVENTS, COMMUNITY_HIGHLIGHTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community & Events",
  description:
    "Join the Big Vision community. Challenges, competitions, workshops, and events that keep you motivated.",
};

const typeIcons: Record<string, React.ElementType> = {
  Challenge: Trophy,
  Competition: Trophy,
  Workshop: BookOpen,
  Social: PartyPopper,
};

const typeColors: Record<string, string> = {
  Challenge: "bg-red-500/10 text-red-500",
  Competition: "bg-orange-500/10 text-orange-500",
  Workshop: "bg-blue-500/10 text-blue-500",
  Social: "bg-green-500/10 text-green-500",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        label="Community"
        title="More Than A Gym"
        description="Challenges, competitions, workshops, and events that keep the community alive."
      />

      {/* Highlights */}
      <section className="border-b border-border py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {COMMUNITY_HIGHLIGHTS.map((h) => (
            <div key={h.label} className="text-center">
              <p className="font-[var(--font-oswald)] text-3xl font-bold text-primary">{h.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((event) => {
              const Icon = typeIcons[event.type] || Users;
              const spotsPercent = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;
              return (
                <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:border-primary/50">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge className={typeColors[event.type]}>{event.type}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {event.date}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>

                    {event.prizes.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Prizes</p>
                        <div className="flex flex-wrap gap-1">
                          {event.prizes.map((p) => (
                            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Capacity bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{event.spotsLeft} spots left</span>
                        <span>{event.totalSpots} total</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${spotsPercent}%` }}
                        />
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Sign Up
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
