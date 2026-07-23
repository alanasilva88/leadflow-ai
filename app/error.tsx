"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <h2 className="text-xl font-semibold">Algo deu errado</h2>
      <p className="mt-2 text-sm text-slate-500">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      <button className="btn-primary mt-6" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
