export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="mt-3 h-8 w-24 rounded bg-muted" />
            <div className="mt-2 h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="animate-pulse rounded-xl border border-border bg-card p-6">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="mt-2 h-3 w-64 rounded bg-muted" />
        <div className="mt-6 h-64 rounded-lg bg-muted" />
      </div>

      {/* Table skeleton */}
      <div className="animate-pulse rounded-xl border border-border bg-card p-6">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
              <div className="h-6 w-16 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
