import { ArrowLeft, Bot, LayoutDashboard, Pencil, Upload, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteLeadButton } from "@/components/leads/delete-lead-button";
import { LeadDetails } from "@/components/leads/lead-details";
import { LeadAnalysisPanel } from "@/components/leads/analysis/lead-analysis-panel";
import { ProspectingActions } from "@/components/leads/prospecting/prospecting-actions";
import { analysisPreviewSchema } from "@/lib/openai/lead-analysis-schema";
import { prisma } from "@/lib/prisma";
import { buildFollowUpMessage, buildInitialProspectingMessage } from "@/lib/templates/prospecting-messages";
import { responseLabels, statusLabels } from "@/lib/utils/lead-labels";
import { verifySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await verifySession();
  const { id } = await params;
  const query = await searchParams;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { analyses: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!lead) notFound();
  const message =
    query.success === "created"
      ? "Lead cadastrado com sucesso."
      : query.success === "updated"
        ? "Lead atualizado com sucesso."
        : "";
  const completedAnalysis = lead.analyses.find((analysis) => analysis.status === "COMPLETED");
  const initialMessage = completedAnalysis?.approachMessage ?? lead.personalizedMessage
    ?? buildInitialProspectingMessage(lead);
  const followUpMessage = completedAnalysis?.followUpMessage ?? buildFollowUpMessage();
  return (
    <div className="-mx-4 -mt-6 bg-[#f8f9fa] pb-24 sm:-mx-6 lg:-mx-8 lg:-mt-8">
      <header className="border-b border-[#c7c4d8]/30 bg-[#f8f9fa]">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 items-center gap-4"><Link href="/leads" className="grid size-8 shrink-0 place-items-center rounded-full text-[#464555]" aria-label="Voltar"><ArrowLeft size={20}/></Link><h1 className="truncate text-2xl font-medium tracking-[-.02em]">{lead.businessName}</h1><span className={`hidden rounded-full px-3 py-1 text-[11px] font-semibold tracking-[.05em] sm:inline-flex ${lead.salesPotential === "HIGH" ? "bg-red-100 text-red-800" : lead.salesPotential === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{lead.salesPotential === "HIGH" ? "ALTA PRIORIDADE" : lead.salesPotential === "MEDIUM" ? "MÉDIA PRIORIDADE" : "BAIXA PRIORIDADE"}</span></div>
          <div className="flex items-center gap-3"><DeleteLeadButton id={id} name={lead.businessName}/><Link href={`/leads/${id}/edit`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#4f46e5] px-4 text-sm text-white shadow-sm"><Pencil size={15}/>Editar lead</Link></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-5 px-6 py-8">
      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(300px,380px)_1fr]">
        <LeadDetails lead={lead}/>
        <div className="space-y-4">
      <LeadAnalysisPanel
        leadId={lead.id}
        businessName={lead.businessName}
        historyCount={lead.analyses.filter((item) => item.status === "COMPLETED").length}
        lastFailure={lead.analyses.find((item) => item.status === "FAILED")?.errorMessage ?? null}
        latest={(() => {
          const item = lead.analyses.find((analysis) => analysis.status === "PENDING" && analysis.mainOpportunity) ?? lead.analyses.find((analysis) => analysis.status === "COMPLETED");
          if (!item) return null;
          const parsed = analysisPreviewSchema.safeParse({...item, websiteCheckedAt: item.websiteCheckedAt?.toISOString() ?? null, websiteWarnings: []});
          return parsed.success ? {id: item.id, preview: parsed.data, analyzedAt: item.analyzedAt?.toISOString() ?? item.createdAt.toISOString(), status: item.status, saved: item.status === "COMPLETED"} : null;
        })()}
      />
      <ProspectingActions
        leadId={lead.id}
        phone={lead.phone}
        instagram={lead.instagram}
        initialMessage={initialMessage}
        initialOrigin={completedAnalysis?.approachMessage ? "Análise com IA" : lead.personalizedMessage ? "Mensagem salva no lead" : "Modelo padrão"}
        followUpMessage={followUpMessage}
        followUpOrigin={completedAnalysis?.followUpMessage ? "Análise com IA" : "Modelo padrão"}
        statusLabel={statusLabels[lead.status]}
        contactedAt={lead.contactedAt?.toISOString() ?? null}
        followUpDate={lead.followUpDate?.toISOString() ?? null}
        responseLabel={lead.response ? responseLabels[lead.response] : "Não registrada"}
      />
        </div>
      </div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-4 border-t border-[#c7c4d8] bg-[#f8f9fa] shadow-[0_-2px_8px_rgba(0,0,0,.05)] lg:hidden"><DetailNav href="/dashboard" label="Dashboard" icon={LayoutDashboard}/><DetailNav href="/leads" label="Leads" icon={Users} active/><DetailNav href="/leads?analysis=completed" label="AI Analysis" icon={Bot}/><DetailNav href="/leads/import" label="Import" icon={Upload}/></nav>
    </div>
  );
}

function DetailNav({href,label,icon:Icon,active=false}:{href:string;label:string;icon:typeof Users;active?:boolean}) { return <Link href={href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-[#3525cd]" : "text-[#666b7c]"}`}><Icon size={20}/>{label}</Link>; }
