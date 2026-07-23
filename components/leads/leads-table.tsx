import type { Lead } from "@prisma/client";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { formatDate, formatRating, emptyValue } from "@/lib/utils/formatters";
import { DeleteLeadButton } from "./delete-lead-button";
import { LeadStatusBadge } from "./lead-status-badge";
import { SalesPotentialBadge } from "./sales-potential-badge";

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <>
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Negócio",
                  "Segmento",
                  "Cidade",
                  "Telefone",
                  "Avaliação",
                  "Potencial",
                  "Status",
                  "Follow-up",
                  "Ações",
                ].map((h) => (
                  <th scope="col" className="px-4 py-3 font-semibold" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-4 font-semibold"
                  >
                    <Link
                      className="hover:text-blue-700"
                      href={`/leads/${lead.id}`}
                    >
                      {lead.businessName}
                    </Link>
                  </th>
                  <td className="px-4 py-4 text-slate-600">
                    {emptyValue(lead.segment)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {emptyValue(lead.city)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {emptyValue(lead.phone)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {formatRating(lead.rating)}
                  </td>
                  <td className="px-4 py-4">
                    <SalesPotentialBadge potential={lead.salesPotential} />
                  </td>
                  <td className="px-4 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {formatDate(lead.followUpDate)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/leads/${lead.id}`}
                        aria-label={`Ver ${lead.businessName}`}
                        className="text-slate-500 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </Link>
                      <Link
                        href={`/leads/${lead.id}/edit`}
                        aria-label={`Editar ${lead.businessName}`}
                        className="text-slate-500 hover:text-blue-700"
                      >
                        <Pencil size={17} />
                      </Link>
                      <DeleteLeadButton
                        compact
                        id={lead.id}
                        name={lead.businessName}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-3 md:hidden">
        {leads.map((lead) => (
          <article key={lead.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{lead.businessName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {emptyValue(lead.segment)} · {emptyValue(lead.city)}
                </p>
              </div>
              <SalesPotentialBadge potential={lead.salesPotential} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <LeadStatusBadge status={lead.status} />
              <div className="flex gap-3">
                <Link
                  href={`/leads/${lead.id}`}
                  className="text-sm font-medium text-blue-700"
                >
                  Ver <ExternalLink className="inline" size={14} />
                </Link>
                <Link
                  href={`/leads/${lead.id}/edit`}
                  className="text-sm font-medium text-slate-600"
                >
                  Editar
                </Link>
                <DeleteLeadButton
                  compact
                  id={lead.id}
                  name={lead.businessName}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
