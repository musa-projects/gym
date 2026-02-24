"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, PartyPopper, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      {/* Animated success icon */}
      <div className="relative mb-8">
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 transition-all duration-700",
            showConfetti ? "scale-110" : "scale-100"
          )}
        >
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        {showConfetti && (
          <PartyPopper className="absolute -top-2 -right-2 h-8 w-8 text-secondary animate-bounce" />
        )}
      </div>

      {/* Heading */}
      <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
        Welcome to the Team!
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Your membership is now active. You have full access to all the benefits
        of your plan. Let&apos;s crush some goals!
      </p>

      {/* Plan card */}
      <div className="mt-8 w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Membership Active
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your payment has been processed successfully.
          {sessionId && (
            <span className="mt-1 block text-xs text-muted-foreground/60">
              Session: {sessionId.slice(0, 20)}...
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/dashboard/book-class" size="md" className="gap-2">
          Book Your First Class
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="md">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
