// Placeholder بشكل صفحات الـ dashboard بدل spinner بنص الشاشة
export default function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="min-h-screen bg-cream p-4 md:p-6" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="skeleton h-8 w-48 mb-2" />
      <div className="skeleton h-4 w-72 max-w-full mb-6" />
      <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 space-y-4 shadow-soft">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton w-12 h-12 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-1/3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
            <div className="skeleton h-8 w-20 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
