export default function Loading() {
  return (
    <div className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 lg:px-8 lg:py-16" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-28 rounded bg-[#f2e7e2]" />
        <div className="h-10 max-w-xl rounded bg-[#f2e7e2]" />
        <div className="h-4 max-w-2xl rounded bg-[#f2e7e2]" />
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-64 rounded-[18px] border border-[#f2e7e2] bg-white" />)}
        </div>
      </div>
    </div>
  );
}