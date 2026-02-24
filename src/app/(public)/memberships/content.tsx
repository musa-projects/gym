"use client";

import { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import {
  MEMBERSHIP_PLANS,
  MEMBERSHIP_COMPARISON,
  MEMBERSHIP_FAQ,
} from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";

export function MembershipsContent() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        label="Memberships"
        title="Invest In Yourself"
        description="Choose the plan that matches your ambition. No contracts, cancel anytime."
      />

      {/* Pricing Toggle */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium", !yearly ? "text-foreground" : "text-muted-foreground")}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={cn("relative h-7 w-14 rounded-full transition-colors cursor-pointer", yearly ? "bg-primary" : "bg-border")}
            >
              <span className={cn("absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform", yearly && "translate-x-7")} />
            </button>
            <span className={cn("text-sm font-medium", yearly ? "text-foreground" : "text-muted-foreground")}>
              Yearly
            </span>
            {yearly && <Badge variant="secondary" className="bg-secondary/10 text-secondary">Save 20%</Badge>}
          </div>

          {/* Student discount banner */}
          <div className="mb-12 rounded-2xl border border-secondary/30 bg-secondary/5 p-4 text-center">
            <p className="text-sm text-secondary">
              <strong>Student discount:</strong> Get 20% off any plan with a valid student ID.
            </p>
          </div>

          {/* Plans */}
          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {MEMBERSHIP_PLANS.map((plan) => {
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <StaggerItem key={plan.name}>
                  <Card className={cn(
                    "relative h-full overflow-hidden transition-all duration-300",
                    plan.highlighted ? "border-primary shadow-2xl shadow-primary/10 scale-[1.02]" : "hover:border-border/80"
                  )}>
                    {plan.highlighted && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        {plan.highlighted && <Badge>Most Popular</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="font-[var(--font-oswald)] text-5xl font-bold text-foreground">
                          {formatCurrency(price)}
                        </span>
                        <span className="text-muted-foreground">/{yearly ? "year" : "month"}</span>
                      </div>
                      <ul className="mb-8 space-y-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                        {plan.notIncluded.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/40">
                            <X className="mt-0.5 h-4 w-4 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button variant={plan.highlighted ? "primary" : "outline"} className="w-full" href="/free-trial">
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

      {/* Comparison Table */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Compare" title="Feature Comparison" />
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Basic</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-primary">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-foreground">VIP</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERSHIP_COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={cn("border-b border-border", i % 2 === 0 && "bg-accent/30")}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{row.feature}</td>
                    {(["basic", "premium", "vip"] as const).map((tier) => {
                      const val = row[tier];
                      return (
                        <td key={tier} className="px-6 py-4 text-center text-sm">
                          {val === true ? (
                            <Check className="mx-auto h-5 w-5 text-primary" />
                          ) : val === false ? (
                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                          ) : (
                            <span className="text-foreground">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading label="FAQ" title="Common Questions" />
          <div className="space-y-3">
            {MEMBERSHIP_FAQ.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
