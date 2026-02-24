"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  Users,
  Calendar,
  Heart,
  Gift,
  Copy,
  Check,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Dumbbell,
    title: "Full Gym Access",
    description: "All equipment, all hours. No restrictions on what you can use or when.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Certified personal trainers ready to guide your fitness journey from day one.",
  },
  {
    icon: Calendar,
    title: "Group Classes",
    description: "50+ classes per week including HIIT, yoga, spin, boxing, and more.",
  },
  {
    icon: Heart,
    title: "Supportive Community",
    description: "Join a welcoming community that celebrates every win, big or small.",
  },
];

const testimonials = [
  {
    quote:
      "My friend referred me and I haven't looked back since. The trainers are incredible and the community keeps me coming back every day.",
    name: "James K.",
    role: "Referred Member, 8 months",
    rating: 5,
  },
  {
    quote:
      "I was nervous about joining a gym, but the referral discount made it easy to try. Now I'm in the best shape of my life.",
    name: "Sarah M.",
    role: "Referred Member, 1 year",
    rating: 5,
  },
  {
    quote:
      "The 50% off first month was amazing, but honestly I would have stayed at full price. This place is worth every penny.",
    name: "David R.",
    role: "Referred Member, 6 months",
    rating: 5,
  },
];

function ReferralInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "BIGVISION";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="Exclusive Referral"
        title="You've Been Referred!"
        description={`Your friend ${code} thinks you'll love Big Vision Gym. Claim your exclusive offer below.`}
      />

      {/* Exclusive Offer Card */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            <CardContent className="relative p-8 pt-8 text-center sm:p-12 sm:pt-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                Your Referral Benefit
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Get your first month at{" "}
                <span className="font-bold text-primary">50% off</span>
              </p>

              {/* Referral Code Display */}
              <div className="mx-auto mt-8 max-w-sm">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Your Referral Code
                </p>
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-6 py-4">
                  <span className="font-[var(--font-oswald)] text-2xl font-bold tracking-widest text-primary sm:text-3xl">
                    {code}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Copy referral code"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Link href="/free-trial" className="mt-8 inline-block">
                <Button size="xl" className="gap-2">
                  Claim Offer
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Cancel anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              What You Get
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything you need to transform your fitness, all under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="transition-all duration-300 hover:border-primary/50"
              >
                <CardContent className="p-6 pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              What Referred Members Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Don&apos;t just take our word for it. Hear from members who joined through referrals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="transition-all duration-300 hover:border-primary/50"
              >
                <CardContent className="p-6 pt-6">
                  <Quote className="mb-4 h-8 w-8 text-primary/30" />
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-bold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            Ready to Start?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Your friend is already here. Join them and start your transformation
            today with 50% off your first month.
          </p>
          <Link href="/free-trial" className="mt-8 inline-block">
            <Button size="xl" className="gap-2">
              Claim Your Offer Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export function ReferralContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ReferralInner />
    </Suspense>
  );
}
