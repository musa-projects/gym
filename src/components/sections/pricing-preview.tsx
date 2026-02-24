"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP_PLANS } from "@/lib/constants/memberships";
import { cn, formatCurrency } from "@/lib/utils";

export function PricingPreview() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-blob absolute -top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div
          className="mesh-blob absolute -bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="mesh-blob absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-[100px]"
          style={{ animationDelay: "-15s" }}
        />
      </div>

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Membership Plans"
          title="Invest In Yourself"
          description="Choose the plan that matches your ambition. No contracts, cancel anytime."
        />

        {/* Monthly / Yearly toggle */}
        <div className="mb-14 flex items-center justify-center gap-4">
          <span
            className={cn(
              "text-sm font-semibold uppercase tracking-wider transition-colors duration-300",
              !yearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>

          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              "relative h-8 w-16 cursor-pointer rounded-full transition-all duration-300",
              yearly
                ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25"
                : "bg-[#262626]"
            )}
            aria-label="Toggle yearly pricing"
          >
            {/* Glow effect when active */}
            {yearly && (
              <div className="glow-pulse absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm" />
            )}
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "absolute top-1 h-6 w-6 rounded-full bg-white shadow-md",
                yearly ? "left-9" : "left-1"
              )}
            />
          </button>

          <span
            className={cn(
              "text-sm font-semibold uppercase tracking-wider transition-colors duration-300",
              yearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
          </span>

          <AnimatePresence>
            {yearly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary"
              >
                <Sparkles className="h-3 w-3" />
                Save 20%
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Plan cards */}
        <StaggerContainer className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.highlighted;

            return (
              <StaggerItem key={plan.name}>
                <div
                  className={cn(
                    "glass relative overflow-hidden rounded-2xl border transition-all duration-500",
                    isPopular
                      ? "gradient-border scale-[1.02] border-primary/30 shadow-2xl shadow-primary/10"
                      : "border-[#262626] hover:border-[#363636]"
                  )}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 left-0 z-10">
                      <div className="flex justify-center">
                        <div className="glow-pulse relative">
                          <div className="shimmer rounded-b-xl bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                            Most Popular
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top gradient bar for popular */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}

                  <div className={cn("p-8", isPopular && "pt-12")}>
                    {/* Plan name */}
                    <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-6 mb-8 flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.name}-${yearly}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={cn(
                            "font-[var(--font-oswald)] text-5xl font-bold",
                            isPopular ? "text-shimmer" : "text-foreground"
                          )}
                        >
                          {formatCurrency(price)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-muted-foreground">
                        /{yearly ? "year" : "month"}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1 + featureIndex * 0.05,
                          }}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                              isPopular
                                ? "bg-primary/20 text-primary"
                                : "bg-[#262626] text-muted-foreground"
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <Button
                      variant={isPopular ? "primary" : "outline"}
                      className={cn(
                        "w-full",
                        isPopular && "shadow-lg shadow-primary/25"
                      )}
                      href="/memberships"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Background glow for popular card */}
                  {isPopular && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* View All Plans link */}
        <div className="mt-14 text-center">
          <Button variant="ghost" href="/memberships" className="group">
            View All Plans & Compare Features
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
