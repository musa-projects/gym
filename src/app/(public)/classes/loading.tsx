export default function ClassesLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-48 bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
