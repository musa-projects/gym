export default function ShopLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters skeleton */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-64 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 rounded bg-muted" />
                  <div className="h-9 w-28 rounded-lg bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
