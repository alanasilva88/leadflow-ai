import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteLeadButton } from "@/components/leads/delete-lead-button";
import { LeadDetails } from "@/components/leads/lead-details";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();
  const message =
    query.success === "created"
      ? "Lead cadastrado com sucesso."
      : query.success === "updated"
        ? "Lead atualizado com sucesso."
        : "";
  return (
    <div className="space-y-5">
      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {lead.businessName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cadastrado em{" "}
            {new Intl.DateTimeFormat("pt-BR").format(lead.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/leads" className="btn-secondary">
            <ArrowLeft size={16} />
            Voltar para leads
          </Link>
          <Link href={`/leads/${id}/edit`} className="btn-primary">
            <Pencil size={16} />
            Editar lead
          </Link>
          <DeleteLeadButton id={id} name={lead.businessName} />
        </div>
      </div>
      <LeadDetails lead={lead} />
    </div>
  );
}
