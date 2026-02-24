"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center font-sans antialiased">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#f5f5f5]">
          Something Went Wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[#a3a3a3]">
          We hit an unexpected error. Don&apos;t worry — your gains are safe. Try refreshing the page.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-[#a3a3a3]">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex gap-4">
          <button
            onClick={reset}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#ef4444] px-6 font-semibold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-[#ef4444] px-6 font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444] hover:text-white"
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
