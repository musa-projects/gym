"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";

export function PricingPreview() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Membership Plans"
          title="Invest In Yourself"
          description="Choose the plan that matches your ambition. No contracts, cancel anytime."
        />

        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !yearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              "relative h-7 w-14 rounded-full transition-colors cursor-pointer",
              yearly ? "bg-primary" : "bg-border"
            )}
            aria-label="Toggle yearly pricing"
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                yearly && "translate-x-7"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              yearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
          </span>
          {yearly && (
            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
              Save 20%
            </Badge>
          )}
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <StaggerItem key={plan.name}>
                <Card
                  className={cn(
                    "relative overflow-hidden transition-all duration-300",
                    plan.highlighted
                      ? "border-primary shadow-2xl shadow-primary/10 scale-[1.02]"
                      : "hover:border-border/80"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.highlighted && (
                        <Badge>Most Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="font-[var(--font-oswald)] text-5xl font-bold text-foreground">
                        {formatCurrency(price)}
                      </span>
                      <span className="text-muted-foreground">
                        /{yearly ? "year" : "month"}
                      </span>
                    </div>
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.highlighted ? "primary" : "outline"}
                      className="w-full"
                      href="/memberships"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
