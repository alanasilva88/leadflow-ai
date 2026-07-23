export default function Loading() {
  return (
    <div
      aria-label="Carregando dashboard"
      className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-slate-200" />
      ))}
    </div>
  );
}
