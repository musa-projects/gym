export default function MembershipsLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto h-6 w-28 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Pricing cards skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-8">
              <div className="h-5 w-20 rounded bg-muted" />
              <div className="mt-4 h-10 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-muted" />
              <div className="mt-8 space-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-muted" />
                    <div className="h-4 flex-1 rounded bg-muted" />
                  </div>
                ))}
              </div>
              <div className="mt-8 h-12 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
