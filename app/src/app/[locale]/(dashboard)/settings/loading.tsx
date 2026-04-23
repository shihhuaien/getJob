export default function SettingsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-brand-100/60" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded-lg bg-brand-100/60" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-white shadow-neu"
          />
        ))}
      </div>
    </div>
  );
}
