import { LeadStatus, Prisma, SalesPotential } from "@prisma/client";
import { Bot, FileUp, LayoutDashboard, Search, SlidersHorizontal, Sparkles, Upload, Users } from "lucide-react";
import Link from "next/link";
import { LeadsTable } from "@/components/leads/leads-table";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { potentialLabels, statusLabels } from "@/lib/utils/lead-labels";
import { verifySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await verifySession();
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
  const analysis =
    typeof params.analysis === "string" &&
    ["none", "completed", "failed"].includes(params.analysis)
      ? params.analysis
      : undefined;
  const followUp =
    typeof params.followUp === "string" &&
    ["today", "overdue", "upcoming", "none"].includes(params.followUp)
      ? params.followUp : undefined;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const where: Prisma.LeadWhereInput = {
    ...(search ? { OR: [
      { businessName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { segment: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ] } : {}),
    ...(status ? { status } : {}),
    ...(potential ? { salesPotential: potential } : {}),
    ...(analysis === "none" ? { analyses: { none: { status: "COMPLETED" } } } : {}),
    ...(analysis === "completed" ? { analyses: { some: { status: "COMPLETED" } } } : {}),
    ...(analysis === "failed" ? { analyses: { some: { status: "FAILED" }, none: { status: "COMPLETED" } } } : {}),
    ...(followUp === "today" ? { followUpDate: { gte: today, lt: tomorrow } } : {}),
    ...(followUp === "overdue" ? { followUpDate: { lt: today } } : {}),
    ...(followUp === "upcoming" ? { followUpDate: { gte: tomorrow } } : {}),
    ...(followUp === "none" ? { followUpDate: null } : {}),
  };
  const leads = await prisma.lead.findMany({
    where,
    include: { analyses: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const success = params.success === "deleted";
  return (
    <div className="-mx-4 -my-6 min-h-screen space-y-5 bg-[#f8f9fa] px-4 pb-24 pt-6 sm:-mx-6 sm:px-6 lg:mx-0 lg:my-0 lg:min-h-0 lg:px-0 lg:pb-0 lg:pt-0">
      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          Lead excluído com sucesso.
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div><h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#191c1d]">Leads</h1><p className="mt-1 text-sm text-[#464555]">Organize, analise e priorize suas oportunidades.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/leads/import" className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#4f46e5] px-4 text-xs font-medium tracking-wide text-white shadow-sm">
            <FileUp size={17} />
            Importar
          </Link>
          <Link href="/leads?analysis=none" className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-xs font-medium tracking-wide text-[#464555]">
            <Sparkles size={16} />
            Analisar com IA
          </Link>
        </div>
      </div>
      <form
        className="grid gap-2 lg:grid-cols-[1fr_repeat(4,170px)_auto]"
        action="/leads"
      >
        <label className="relative">
          <span className="sr-only">Buscar empresas, contatos ou segmentos</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={17}/>
          <input
            name="search"
            defaultValue={search}
            className="h-10 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] pl-10 pr-4 text-sm text-[#191c1d] placeholder:text-[#6b7280]"
            placeholder="Buscar empresas, contatos ou segmentos..."
          />
        </label>
        <details className="group contents lg:hidden"><summary className="flex h-8 cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-[#c7c4d8] text-xs font-medium text-[#464555]"><SlidersHorizontal size={15}/> Filtros</summary><div className="grid gap-2 pt-1 sm:grid-cols-2">
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
          <span className="sr-only">Filtrar por follow-up</span>
          <select name="followUp" defaultValue={followUp ?? ""} className="input">
            <option value="">Todos os follow-ups</option>
            <option value="today">Hoje</option>
            <option value="overdue">Atrasados</option>
            <option value="upcoming">Próximos</option>
            <option value="none">Sem follow-up</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por status da análise</span>
          <select name="analysis" defaultValue={analysis ?? ""} className="input">
            <option value="">Todas as análises</option>
            <option value="none">Sem análise</option>
            <option value="completed">Analisados</option>
            <option value="failed">Com erro</option>
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
        </div></details>
        <div className="hidden lg:contents">
          <label><span className="sr-only">Filtrar por potencial</span><select name="potential" defaultValue={potential ?? ""} className="input"><option value="">Todos os potenciais</option>{Object.values(SalesPotential).map(v=><option key={v} value={v}>{potentialLabels[v]}</option>)}</select></label>
          <label><span className="sr-only">Filtrar por follow-up</span><select name="followUp" defaultValue={followUp ?? ""} className="input"><option value="">Todos os follow-ups</option><option value="today">Hoje</option><option value="overdue">Atrasados</option><option value="upcoming">Próximos</option><option value="none">Sem follow-up</option></select></label>
          <label><span className="sr-only">Filtrar por status da análise</span><select name="analysis" defaultValue={analysis ?? ""} className="input"><option value="">Todas as análises</option><option value="none">Sem análise</option><option value="completed">Analisados</option><option value="failed">Com erro</option></select></label>
          <label><span className="sr-only">Filtrar por status</span><select name="status" defaultValue={status ?? ""} className="input"><option value="">Todos os status</option>{Object.values(LeadStatus).map(v=><option key={v} value={v}>{statusLabels[v]}</option>)}</select></label>
          <button className="btn-secondary" type="submit">Aplicar filtros</button>
        </div>
      </form>
      {leads.length ? (
        <LeadsTable leads={leads} />
      ) : (
        <EmptyState
          title="Nenhum lead encontrado"
          description="Ajuste os filtros ou cadastre uma nova oportunidade."
        />
      )}
      <p className="text-center text-xs text-[#4f46e5]">{leads.length} lead{leads.length===1?"":"s"} exibido{leads.length===1?"":"s"}</p>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-[#c7c4d8] bg-[#f8f9fa] shadow-[0_-2px_8px_rgba(0,0,0,.05)] lg:hidden" aria-label="Navegação de leads">
        <MobileLink href="/dashboard" label="Dashboard" icon={LayoutDashboard}/><MobileLink href="/leads" label="Leads" icon={Users} active/><MobileLink href="/leads/import" label="Importar" icon={Upload}/><MobileLink href="/leads?analysis=completed" label="Análises" icon={Bot}/>
      </nav>
    </div>
  );
}

function MobileLink({href,label,active=false,icon:Icon}:{href:string;label:string;active?:boolean;icon:typeof LayoutDashboard}){return <Link href={href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active?"text-[#3525cd]":"text-[#404758]"}`}><Icon size={19}/><span>{label}</span></Link>}
