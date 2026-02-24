import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Dumbbell className="h-8 w-8 text-primary" />
        <span className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wider text-foreground">
          Big<span className="text-primary">Vision</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
