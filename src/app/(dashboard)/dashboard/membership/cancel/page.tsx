"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      {/* Icon */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <XCircle className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
        Checkout Cancelled
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        No worries — your payment was not processed. You can try again anytime or
        reach out if you need help choosing the right plan.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/membership">
          <Button variant="primary" size="md" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="md" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
}
