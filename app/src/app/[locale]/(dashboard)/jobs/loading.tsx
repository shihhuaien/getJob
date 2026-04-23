export default function JobsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-brand-100/60" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="mb-6 flex gap-3">
        <div className="h-10 w-28 animate-pulse rounded-lg bg-brand-100/60" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-brand-100/60" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, col) => (
          <div
            key={col}
            className="rounded-xl bg-brand-50/50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="h-5 w-16 animate-pulse rounded-full bg-brand-100/60" />
              <div className="h-4 w-6 animate-pulse rounded-full bg-brand-100/60" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-white ring-1 ring-brand-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
