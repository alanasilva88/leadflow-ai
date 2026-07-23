import Link from "next/link";
export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <p className="text-sm font-semibold text-blue-700">404</p>
      <h2 className="mt-2 text-2xl font-semibold">Lead não encontrado</h2>
      <p className="mt-2 text-slate-500">
        O registro pode ter sido removido ou o endereço está incorreto.
      </p>
      <Link href="/leads" className="btn-primary mt-6">
        Voltar para leads
      </Link>
    </div>
  );
}
