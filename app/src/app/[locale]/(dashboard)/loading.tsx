export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-brand-100" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-brand-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-brand-100"
          />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl bg-brand-100" />
        <div className="h-48 animate-pulse rounded-xl bg-brand-100" />
      </div>
    </div>
  );
}
