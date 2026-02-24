"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?redirect=/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        {sent ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 text-2xl font-bold text-foreground">Check Your Email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a password reset link to your email address. Click the link to set a new password.
            </p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
              Reset Password
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.email ? "border-destructive" : "border-border"
                  )}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <p className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
