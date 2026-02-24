"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Crown,
  Check,
  X,
  CreditCard,
  Calendar,
  ArrowUpRight,
  Snowflake,
  AlertTriangle,
  Zap,
  Users,
  Dumbbell,
  Flame,
  ChevronRight,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
} from "@/app/actions/stripe";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CURRENT_PLAN = {
  name: "Premium",
  status: "active" as const,
  monthlyPrice: 5900,
  yearlyPrice: 56900,
  billingCycle: "monthly" as const,
  nextBillingDate: new Date(2026, 2, 15), // March 15, 2026
  memberSince: new Date(2025, 0, 1), // January 2025
  features: [
    "Unlimited 24/7 access",
    "All group classes included",
    "1 personal training session/month",
    "Sauna & recovery zone",
    "Nutrition consultation",
    "Guest pass (1/month)",
    "Priority class booking",
  ],
};

const PLANS = [
  {
    name: "Basic",
    monthlyPrice: 2900,
    yearlyPrice: 27900,
    description: "Perfect for getting started on your fitness journey",
    features: [
      "Off-peak gym access (6AM-4PM)",
      "Full gym floor access",
      "2 group classes per week",
      "Locker room & showers",
      "Basic fitness assessment",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 5900,
    yearlyPrice: 56900,
    description: "Our most popular plan for serious fitness enthusiasts",
    features: [
      "Unlimited 24/7 access",
      "All group classes included",
      "1 PT session/month",
      "Sauna & recovery zone",
      "Nutrition consultation",
      "1 guest pass/month",
      "Priority class booking",
    ],
  },
  {
    name: "VIP",
    monthlyPrice: 9900,
    yearlyPrice: 94900,
    description: "The ultimate fitness experience with premium perks",
    features: [
      "Everything in Premium",
      "4 PT sessions/month",
      "Custom meal plan",
      "Recovery & massage credits",
      "Private locker",
      "Unlimited guest passes",
      "Merchandise discounts (15%)",
    ],
  },
];

const BENEFITS_USED = [
  {
    label: "Group Classes",
    icon: Users,
    used: 8,
    total: "unlimited" as const,
    type: "progress" as const,
  },
  {
    label: "PT Sessions",
    icon: Dumbbell,
    used: 1,
    total: 1,
    type: "progress" as const,
  },
  {
    label: "Guest Passes",
    icon: Shield,
    used: 0,
    total: 1,
    type: "progress" as const,
  },
  {
    label: "Sauna Access",
    icon: Flame,
    used: null,
    total: null,
    type: "boolean" as const,
    active: true,
  },
];

const BILLING_HISTORY = [
  {
    id: "INV-2026-005",
    date: new Date(2026, 1, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid" as const,
  },
  {
    id: "INV-2026-004",
    date: new Date(2026, 0, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid" as const,
  },
  {
    id: "INV-2025-003",
    date: new Date(2025, 11, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid" as const,
  },
  {
    id: "INV-2025-002",
    date: new Date(2025, 10, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid" as const,
  },
  {
    id: "INV-2025-001",
    date: new Date(2025, 9, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid" as const,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MembershipPage() {
  const router = useRouter();
  const [billingToggle, setBillingToggle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleCheckout = async (planName: string) => {
    setLoadingAction(`checkout-${planName}`);
    try {
      // In production, priceId and planId would come from the database
      // For now, we show a toast indicating Stripe needs to be configured
      const result = await createCheckoutSession({
        priceId: `price_placeholder_${planName.toLowerCase()}_${billingToggle}`,
        planId: `plan_placeholder_${planName.toLowerCase()}`,
        billingCycle: billingToggle,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to start checkout. Please configure Stripe keys.");
      }
    } catch {
      toast.error("Failed to start checkout. Please configure Stripe keys in .env.local");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManageBilling = async () => {
    setLoadingAction("portal");
    try {
      const result = await createPortalSession();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to open billing portal.");
      }
    } catch {
      toast.error("Failed to open billing portal. Please configure Stripe keys.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your membership? You'll keep access until the end of your current billing period.")) {
      return;
    }
    setLoadingAction("cancel");
    try {
      const result = await cancelSubscription();
      if (result.success) {
        toast.success("Membership will cancel at the end of your billing period.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel subscription.");
      }
    } catch {
      toast.error("Failed to cancel. Please configure Stripe keys.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page heading                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
          Membership
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan, track benefits, and view billing history.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 1. Current Plan Card                                               */}
      {/* ----------------------------------------------------------------- */}
      <Card className="relative overflow-hidden">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  {CURRENT_PLAN.name} Plan
                </CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Member since{" "}
                  {format(CURRENT_PLAN.memberSince, "MMMM yyyy")}
                </p>
              </div>
            </div>
            <Badge variant="success" className="w-fit">Active</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Price & billing info */}
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-[var(--font-oswald)] text-4xl font-bold text-foreground">
                {formatCurrency(CURRENT_PLAN.monthlyPrice)}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Next billing:{" "}
                <span className="font-medium text-foreground">
                  {format(CURRENT_PLAN.nextBillingDate, "MMMM d, yyyy")}
                </span>
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CURRENT_PLAN.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleCheckout("VIP")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "checkout-VIP" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
              Upgrade to VIP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleManageBilling}
              disabled={loadingAction !== null}
            >
              {loadingAction === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage Billing
            </Button>
            <button
              onClick={handleCancel}
              disabled={loadingAction !== null}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline cursor-pointer disabled:opacity-50"
            >
              {loadingAction === "cancel" ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Plan Comparison                                                 */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Compare Plans</h3>
            <p className="text-sm text-muted-foreground">
              Find the plan that matches your ambition.
            </p>
          </div>

          {/* Monthly / Yearly toggle */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-sm font-medium",
                billingToggle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingToggle(
                  billingToggle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={cn(
                "relative h-7 w-14 rounded-full transition-colors cursor-pointer",
                billingToggle === "yearly" ? "bg-primary" : "bg-border"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                  billingToggle === "yearly" && "translate-x-7"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium",
                billingToggle === "yearly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Yearly
            </span>
            {billingToggle === "yearly" && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.name === CURRENT_PLAN.name;
            const price =
              billingToggle === "yearly"
                ? plan.yearlyPrice
                : plan.monthlyPrice;
            const planOrder = ["Basic", "Premium", "VIP"];
            const currentIdx = planOrder.indexOf(CURRENT_PLAN.name);
            const planIdx = planOrder.indexOf(plan.name);

            let buttonLabel = "Upgrade";
            let buttonVariant: "primary" | "outline" | "ghost" = "primary";
            if (isCurrent) {
              buttonLabel = "Current Plan";
              buttonVariant = "ghost";
            } else if (planIdx < currentIdx) {
              buttonLabel = "Downgrade";
              buttonVariant = "outline";
            }

            return (
              <Card
                key={plan.name}
                className={cn(
                  "relative flex flex-col overflow-hidden transition-all",
                  isCurrent &&
                    "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                )}
              >
                {isCurrent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                )}

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {isCurrent && <Badge>Current Plan</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-5">
                    <span className="font-[var(--font-oswald)] text-4xl font-bold text-foreground">
                      {formatCurrency(price)}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingToggle === "yearly" ? "year" : "month"}
                    </span>
                  </div>

                  <ul className="mb-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={buttonVariant}
                    size="sm"
                    className="w-full"
                    disabled={isCurrent || loadingAction !== null}
                    onClick={() => !isCurrent && handleCheckout(plan.name)}
                  >
                    {loadingAction === `checkout-${plan.name}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      buttonLabel
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Membership Benefits Used                                        */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Benefits Used</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your membership usage this billing cycle
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS_USED.map((benefit) => (
              <div
                key={benefit.label}
                className="rounded-xl border border-border bg-muted p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <benefit.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {benefit.label}
                    </span>
                  </div>
                  {benefit.type === "boolean" && benefit.active && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  )}
                </div>

                {benefit.type === "progress" && (
                  <>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="font-[var(--font-oswald)] text-2xl font-bold text-foreground">
                        {benefit.used}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /{" "}
                        {benefit.total === "unlimited"
                          ? "Unlimited"
                          : benefit.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          benefit.total === "unlimited"
                            ? "bg-primary"
                            : benefit.used === benefit.total
                              ? "bg-secondary"
                              : "bg-primary"
                        )}
                        style={{
                          width:
                            benefit.total === "unlimited"
                              ? `${Math.min((benefit.used / 20) * 100, 100)}%`
                              : `${(benefit.used / benefit.total) * 100}%`,
                        }}
                      />
                    </div>
                    {benefit.total !== "unlimited" &&
                      benefit.used === benefit.total && (
                        <p className="mt-2 text-xs text-secondary">
                          Fully used this cycle
                        </p>
                      )}
                    {benefit.total !== "unlimited" &&
                      benefit.used < benefit.total && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {benefit.total - benefit.used} remaining
                        </p>
                      )}
                  </>
                )}

                {benefit.type === "boolean" && (
                  <p className="text-sm text-green-500 font-medium">
                    Active
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Billing History                                                 */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Billing History</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your recent payments
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/payments"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map((payment, i) => (
                  <tr
                    key={payment.id}
                    className={cn(
                      "border-b border-border last:border-0",
                      i % 2 === 0 && "bg-accent/30"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {format(payment.date, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {payment.description}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="success" className="text-[11px]">
                        Paid
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="space-y-3 sm:hidden">
            {BILLING_HISTORY.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-border bg-muted p-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {format(payment.date, "MMM d, yyyy")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {payment.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(payment.amount)}
                  </p>
                  <Badge variant="success" className="mt-1 text-[11px]">
                    Paid
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Freeze / Cancel Section                                         */}
      {/* ----------------------------------------------------------------- */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Membership Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Need to pause or make changes to your membership?
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Freeze */}
            <div className="flex-1 rounded-xl border border-border bg-muted p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Snowflake className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Freeze Membership
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pause without losing your spot
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Premium members can freeze their membership for up to 60 days
                per year at no additional cost. Your billing will be paused
                during the freeze period.
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Snowflake className="h-4 w-4" />
                Freeze Membership
              </Button>
            </div>

            {/* Cancel */}
            <div className="flex-1 rounded-xl border border-border bg-muted p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Cancel Membership
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll be sorry to see you go
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Monthly plans can be cancelled with 30 days notice. Your access
                will continue until the end of your current billing period on{" "}
                <span className="font-medium text-foreground">
                  {format(CURRENT_PLAN.nextBillingDate, "MMMM d, yyyy")}
                </span>
                .
              </p>
              <button
                onClick={handleCancel}
                disabled={loadingAction !== null}
                className="text-sm font-medium text-destructive underline-offset-4 hover:underline cursor-pointer disabled:opacity-50"
              >
                {loadingAction === "cancel" ? "Cancelling..." : "Cancel Membership"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
