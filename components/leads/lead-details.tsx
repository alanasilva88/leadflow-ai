import type { Lead } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import {
  emptyValue,
  formatDate,
  formatRating,
  formatReviewCount,
  normalizeUrl,
} from "@/lib/utils/formatters";
import { responseLabels } from "@/lib/utils/lead-labels";
import { LeadStatusBadge } from "./lead-status-badge";
import { SalesPotentialBadge } from "./sales-potential-badge";

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-slate-900">{children}</dd>
    </div>
  );
}
function External({
  value,
  instagram = false,
}: {
  value?: string | null;
  instagram?: boolean;
}) {
  const url =
    instagram && value?.startsWith("@")
      ? `https://instagram.com/${value.slice(1)}`
      : normalizeUrl(value);
  if (!url) return <>Não informado</>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-700 hover:underline"
    >
      {value}
      <ExternalLink size={13} />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
export function LeadDetails({ lead }: { lead: Lead }) {
  const sections = [
    {
      title: "Dados do negócio",
      items: [
        ["Nome", lead.businessName],
        ["Segmento", emptyValue(lead.segment)],
        ["Cidade", emptyValue(lead.city)],
        ["Telefone", emptyValue(lead.phone)],
        ["Avaliação", formatRating(lead.rating)],
        ["Número de avaliações", formatReviewCount(lead.reviewCount)],
      ],
    },
    {
      title: "Presença digital",
      items: [
        ["Site", <External key="site" value={lead.website} />],
        [
          "Instagram",
          <External key="instagram" instagram value={lead.instagram} />,
        ],
        ["Situação do site", emptyValue(lead.websiteStatus)],
        [
          "Nota do site",
          lead.websiteScore == null
            ? "Não informado"
            : `${lead.websiteScore} / 10`,
        ],
      ],
    },
    {
      title: "Diagnóstico",
      items: [
        [
          "Potencial",
          <SalesPotentialBadge
            key="potential"
            potential={lead.salesPotential}
          />,
        ],
        ["Problema principal", emptyValue(lead.mainProblem)],
        ["Solução sugerida", emptyValue(lead.suggestedSolution)],
        ["Mensagem personalizada", emptyValue(lead.personalizedMessage)],
      ],
    },
    {
      title: "Prospecção",
      items: [
        ["Status", <LeadStatusBadge key="status" status={lead.status} />],
        [
          "Resposta",
          lead.response ? responseLabels[lead.response] : "Não informado",
        ],
        ["Data do contato", formatDate(lead.contactedAt)],
        ["Follow-up", formatDate(lead.followUpDate)],
        ["Observações", emptyValue(lead.notes)],
      ],
    },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sections.map((section) => (
        <section className="card p-5 sm:p-6" key={section.title}>
          <h2 className="font-semibold">{section.title}</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {section.items.map(([label, value]) => (
              <Item label={label as string} key={label as string}>
                {value}
              </Item>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
