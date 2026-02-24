"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BadgePercent,
  Settings2,
  UserCheck,
  BarChart3,
  Check,
  Send,
  Building2,
  Phone,
  ClipboardList,
  Rocket,
  Star,
  Crown,
  Gem,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Zod schema ──────────────────────────────────────────────────────────────

const corporateInquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  companySize: z.string().min(1, "Please select a company size"),
  planInterest: z.string().min(1, "Please select a plan"),
  message: z.string().optional(),
});

type CorporateInquiryForm = z.infer<typeof corporateInquirySchema>;

// ── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: BadgePercent,
    title: "Discounted Rates",
    description:
      "Save up to 30% on memberships with our volume-based corporate pricing tiers.",
  },
  {
    icon: Settings2,
    title: "Flexible Plans",
    description:
      "Customize plans to fit your team's unique needs, schedules, and fitness goals.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Account Manager",
    description:
      "A single point of contact to handle onboarding, billing, and ongoing support.",
  },
  {
    icon: BarChart3,
    title: "Team Reporting & Analytics",
    description:
      "Track engagement, attendance, and wellness metrics with detailed monthly reports.",
  },
];

const plans = [
  {
    name: "Standard",
    icon: Star,
    members: "5-25 members",
    discount: "15%",
    price: "$45",
    priceLabel: "/member/mo",
    features: [
      "15% group discount",
      "Access to basic classes",
      "Monthly usage reports",
      "Shared account dashboard",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Premium",
    icon: Crown,
    members: "26-50 members",
    discount: "25%",
    price: "$39",
    priceLabel: "/member/mo",
    features: [
      "25% group discount",
      "Access to all classes",
      "Personal training sessions",
      "Quarterly business reviews",
      "Priority booking",
    ],
    highlighted: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    icon: Gem,
    members: "50+ members",
    discount: "30%",
    price: "Custom",
    priceLabel: " pricing",
    features: [
      "30% group discount",
      "Everything in Premium",
      "Dedicated personal trainer",
      "Custom wellness programs",
      "On-site wellness events",
      "Executive health assessments",
    ],
    highlighted: false,
    cta: "Contact Us",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Submit Inquiry",
    description: "Fill out the form below with your company details and needs.",
  },
  {
    icon: Phone,
    title: "Consultation Call",
    description:
      "Our corporate team will schedule a call to understand your goals.",
  },
  {
    icon: Building2,
    title: "Custom Proposal",
    description:
      "Receive a tailored wellness plan and pricing built for your team.",
  },
  {
    icon: Rocket,
    title: "Launch Program",
    description:
      "Onboard your employees and kick off your corporate wellness journey.",
  },
];

const trustedCompanies = [
  "TechCorp",
  "FinanceHub",
  "MediaGroup",
  "HealthPlus",
  "StartupLab",
];

// ── Input class helper ──────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const inputErrorClass =
  "w-full rounded-xl border border-destructive bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

// ── Component ───────────────────────────────────────────────────────────────

export function CorporateContent() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CorporateInquiryForm>({
    resolver: zodResolver(corporateInquirySchema),
  });

  const onSubmit = async (_data: CorporateInquiryForm) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Inquiry submitted! We'll be in touch within 24 hours.");
    reset();
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <PageHeader
        label="Corporate Wellness"
        title="Invest In Your Team's Health"
        description="Boost productivity, reduce absenteeism, and build a healthier workplace with our tailored corporate wellness programs."
      />

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Why Partner With Us
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              We make it easy for businesses of all sizes to prioritize employee
              wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full transition-colors hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────────────────────── */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Corporate Plans
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Scalable pricing that grows with your organization. All plans
              include gym access for every enrolled employee.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  className={cn(
                    "relative h-full overflow-hidden transition-all duration-300",
                    plan.highlighted
                      ? "border-primary shadow-2xl shadow-primary/10 scale-[1.02]"
                      : "hover:border-border/80"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                  )}
                  <CardContent className="p-8">
                    <div className="mb-1 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          plan.highlighted
                            ? "bg-primary/20"
                            : "bg-primary/10"
                        )}
                      >
                        <plan.icon
                          className={cn(
                            "h-5 w-5",
                            plan.highlighted
                              ? "text-primary"
                              : "text-primary"
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-6 text-sm text-muted-foreground">
                      {plan.members}
                    </p>

                    <div className="mb-6">
                      <span className="font-[var(--font-oswald)] text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.priceLabel}
                      </span>
                    </div>

                    <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {plan.discount} discount
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
                      href="#inquiry"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Getting started is simple. Four steps to a healthier, more
              productive workforce.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inquiry Form ───────────────────────────────────────────────── */}
      <section id="inquiry" className="bg-muted py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Get A Custom Quote
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Tell us about your company and we&apos;ll craft a wellness program
              that fits your budget and goals.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Company Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Company Name *
                  </label>
                  <input
                    {...register("companyName")}
                    className={cn(
                      errors.companyName ? inputErrorClass : inputClass
                    )}
                    placeholder="Acme Corporation"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Contact Name *
                  </label>
                  <input
                    {...register("contactName")}
                    className={cn(
                      errors.contactName ? inputErrorClass : inputClass
                    )}
                    placeholder="Jane Smith"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>

                {/* Email & Phone row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={cn(
                        errors.email ? inputErrorClass : inputClass
                      )}
                      placeholder="jane@acme.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Phone *
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={cn(
                        errors.phone ? inputErrorClass : inputClass
                      )}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Size & Plan Interest row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Company Size *
                    </label>
                    <select
                      {...register("companySize")}
                      className={cn(
                        errors.companySize ? inputErrorClass : inputClass
                      )}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select size
                      </option>
                      <option value="5-10">5-10 employees</option>
                      <option value="11-25">11-25 employees</option>
                      <option value="26-50">26-50 employees</option>
                      <option value="51-100">51-100 employees</option>
                      <option value="100+">100+ employees</option>
                    </select>
                    {errors.companySize && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.companySize.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Plan Interest *
                    </label>
                    <select
                      {...register("planInterest")}
                      className={cn(
                        errors.planInterest ? inputErrorClass : inputClass
                      )}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select plan
                      </option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    {errors.planInterest && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.planInterest.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Message (Optional)
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className={cn(inputClass, "resize-none")}
                    placeholder="Tell us about your wellness goals, team schedule preferences, or any questions..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Trusted By ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustedCompanies.map((company) => (
              <div
                key={company}
                className="flex h-16 items-center justify-center rounded-xl border border-border bg-card px-8 transition-colors hover:border-primary/30"
              >
                <span className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wider text-muted-foreground">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
