export default function ResumeLoading() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-brand-100/60" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-brand-100/60" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-6 shadow-neu"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-brand-100/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-brand-100/60" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-brand-100/60" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-brand-100/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
