import {
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Handshake,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils/formatters";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const [
    total,
    fresh,
    high,
    contacted,
    responded,
    meetings,
    proposals,
    closed,
    todayFollowUps,
    recent,
    followUps,
  ] = await prisma.$transaction([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { salesPotential: "HIGH" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "RESPONDED" } }),
    prisma.lead.count({ where: { status: "MEETING" } }),
    prisma.lead.count({ where: { status: "PROPOSAL" } }),
    prisma.lead.count({ where: { status: "CLOSED" } }),
    prisma.lead.count({ where: { followUpDate: { gte: start, lt: end } } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.lead.findMany({
      where: {
        followUpDate: { gte: start },
        status: { notIn: ["CLOSED", "LOST"] },
      },
      orderBy: { followUpDate: "asc" },
      take: 5,
    }),
  ]);
  const metrics = [
    ["Total de leads", total, Users],
    ["Leads novos", fresh, CircleDot],
    ["Alto potencial", high, Sparkles],
    ["Contatados", contacted, Phone],
    ["Responderam", responded, MessageCircle],
    ["Reuniões", meetings, Handshake],
    ["Propostas", proposals, Send],
    ["Fechados", closed, CheckCircle2],
    ["Follow-ups hoje", todayFollowUps, CalendarClock],
  ] as const;
  return (
    <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map(([label, value, icon]) => (
          <MetricCard key={label} label={label} value={value} icon={icon} />
        ))}
      </div>
      {total === 0 ? (
        <EmptyState
          title="Nenhum lead cadastrado"
          description="Cadastre sua primeira oportunidade para começar a acompanhar a prospecção."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Adicionados recentemente</h2>
              <Link href="/leads" className="text-sm font-medium text-blue-700">
                Ver todos
              </Link>
            </div>
            <ul className="divide-y">
              {recent.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium">{lead.businessName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {lead.city ?? "Cidade não informada"}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="card overflow-hidden">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold">Próximos follow-ups</h2>
            </div>
            {followUps.length ? (
              <ul className="divide-y">
                {followUps.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="flex justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium">{lead.businessName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {lead.phone ?? "Telefone não informado"}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {formatDate(lead.followUpDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                Nenhum follow-up futuro agendado.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
