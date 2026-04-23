export default function InterviewLoading() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-lg bg-brand-100/60" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-brand-100/60" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="mb-6 h-48 animate-pulse rounded-2xl bg-white shadow-neu" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-white shadow-neu"
          />
        ))}
      </div>
    </div>
  );
}
