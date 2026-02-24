import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Large 404 */}
      <div className="relative">
        <h1 className="font-[var(--font-oswald)] text-[12rem] font-bold leading-none text-muted-foreground/10 sm:text-[16rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell className="h-20 w-20 text-primary" />
        </div>
      </div>

      <h2 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-wider text-foreground sm:text-4xl">
        Page Not Found
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        Looks like this page skipped leg day and disappeared. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" size="lg">
          Go Home
        </Button>
        <Button href="/classes" variant="outline" size="lg">
          Browse Classes
        </Button>
      </div>
    </div>
  );
}
