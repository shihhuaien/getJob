export default function AnalyticsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-brand-100/60" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-neu" />
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-neu" />
        </div>
        <div className="h-56 animate-pulse rounded-2xl bg-white shadow-neu" />
      </div>
    </div>
  );
}
