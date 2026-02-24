"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dumbbell, Shield, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { submitFreeTrial } from "@/app/actions/leads";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FITNESS_GOALS, PREFERRED_TIMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const trialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  goal: z.string().min(1, "Please select a goal"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
});

type TrialForm = z.infer<typeof trialSchema>;

const benefits = [
  { icon: Dumbbell, text: "Full gym access during your session" },
  { icon: Users, text: "One-on-one with a certified trainer" },
  { icon: Clock, text: "60-minute personalized session" },
  { icon: Shield, text: "Zero commitment, zero pressure" },
];

export function FreeTrialContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrialForm>({ resolver: zodResolver(trialSchema) });

  const onSubmit = async (data: TrialForm) => {
    setIsSubmitting(true);
    const result = await submitFreeTrial(data);
    if (result.success) {
      router.push("/free-trial/thank-you");
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        label="Free Trial"
        title="Your First Session Is On Us"
        description="No commitment. No pressure. Just show up and experience what Big Vision is all about."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">What You Get</h2>
              <p className="mt-2 text-muted-foreground">
                Your free trial includes everything you need to experience Big Vision at its best.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-lg font-bold text-foreground">
                  &ldquo;The free trial changed everything for me. I signed up the next day.&rdquo;
                </p>
                <p className="mt-2 text-sm text-muted-foreground">— Maria S., Premium Member</p>
              </div>
            </div>

            {/* Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Book Your Trial</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
                      <input
                        {...register("name")}
                        className={cn(
                          "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.name ? "border-destructive" : "border-border"
                        )}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number *</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className={cn(
                          "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.phone ? "border-destructive" : "border-border"
                        )}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Email (Optional)</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full rounded-lg border border-border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Fitness Goal *</label>
                      <select
                        {...register("goal")}
                        className={cn(
                          "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.goal ? "border-destructive" : "border-border"
                        )}
                        defaultValue=""
                      >
                        <option value="" disabled>Select your goal</option>
                        {FITNESS_GOALS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {errors.goal && <p className="mt-1 text-xs text-destructive">{errors.goal.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Time *</label>
                      <select
                        {...register("preferredTime")}
                        className={cn(
                          "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.preferredTime ? "border-destructive" : "border-border"
                        )}
                        defaultValue=""
                      >
                        <option value="" disabled>Select preferred time</option>
                        {PREFERRED_TIMES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.preferredTime && <p className="mt-1 text-xs text-destructive">{errors.preferredTime.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Booking..." : "Book My Free Trial"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      By booking, you agree to receive a confirmation message. No spam, ever.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
