import { LeadStatus, Prisma, SalesPotential } from "@prisma/client";
import { FileUp, Plus } from "lucide-react";
import Link from "next/link";
import { LeadsTable } from "@/components/leads/leads-table";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { potentialLabels, statusLabels } from "@/lib/utils/lead-labels";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const status =
    typeof params.status === "string" &&
    Object.values(LeadStatus).includes(params.status as LeadStatus)
      ? (params.status as LeadStatus)
      : undefined;
  const potential =
    typeof params.potential === "string" &&
    Object.values(SalesPotential).includes(params.potential as SalesPotential)
      ? (params.potential as SalesPotential)
      : undefined;
  const where: Prisma.LeadWhereInput = {
    ...(search ? { businessName: { contains: search } } : {}),
    ...(status ? { status } : {}),
    ...(potential ? { salesPotential: potential } : {}),
  };
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const success = params.success === "deleted";
  return (
    <div className="space-y-5">
      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          Lead excluído com sucesso.
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {leads.length} resultado(s), limitado a 100 registros.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/leads/import" className="btn-secondary">
            <FileUp size={17} />
            Importar planilha
          </Link>
          <Link href="/leads/new" className="btn-primary">
            <Plus size={17} />
            Adicionar lead
          </Link>
        </div>
      </div>
      <form
        className="card grid gap-3 p-4 sm:grid-cols-[1fr_180px_180px_auto]"
        action="/leads"
      >
        <label className="relative">
          <span className="sr-only">Buscar por nome</span>
          <input
            name="search"
            defaultValue={search}
            className="input pl-10"
            placeholder="Buscar por nome..."
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por potencial</span>
          <select
            name="potential"
            defaultValue={potential ?? ""}
            className="input"
          >
            <option value="">Todos os potenciais</option>
            {Object.values(SalesPotential).map((v) => (
              <option key={v} value={v}>
                {potentialLabels[v]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por status</span>
          <select name="status" defaultValue={status ?? ""} className="input">
            <option value="">Todos os status</option>
            {Object.values(LeadStatus).map((v) => (
              <option key={v} value={v}>
                {statusLabels[v]}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-secondary" type="submit">
          Aplicar filtros
        </button>
      </form>
      {leads.length ? (
        <LeadsTable leads={leads} />
      ) : (
        <EmptyState
          title="Nenhum lead encontrado"
          description="Ajuste os filtros ou cadastre uma nova oportunidade."
        />
      )}
    </div>
  );
}
