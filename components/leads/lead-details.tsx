import type { Lead } from "@prisma/client";
import { AtSign, Building2, ExternalLink, Globe2, MapPin, Phone } from "lucide-react";
import { emptyValue, formatDate, formatRating, formatReviewCount, normalizeUrl } from "@/lib/utils/formatters";
import { responseLabels } from "@/lib/utils/lead-labels";
import { LeadStatusBadge } from "./lead-status-badge";
import { SalesPotentialBadge } from "./sales-potential-badge";

function Item({label,children}:{label:string;children:React.ReactNode}) { return <div><dt className="text-xs font-medium tracking-[.02em] text-[#464555]">{label}</dt><dd className="mt-1 text-sm leading-6 text-[#191c1d]">{children}</dd></div>; }
function External({value,instagram=false}:{value?:string|null;instagram?:boolean}) { const url=instagram&&value?.startsWith("@")?`https://instagram.com/${value.slice(1)}`:normalizeUrl(value); if(!url)return <>Não informado</>; return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#4f46e5] hover:underline">{value}<ExternalLink size={13}/><span className="sr-only">(abre em nova aba)</span></a>; }
function IconItem({icon:Icon,label,children}:{icon:typeof Phone;label:string;children:React.ReactNode}) { return <div className="flex gap-3"><Icon size={17} className="mt-0.5 shrink-0 text-[#464555]"/><div><dt className="text-xs font-medium tracking-[.02em] text-[#464555]">{label}</dt><dd className="mt-0.5 text-sm text-[#191c1d]">{children}</dd></div></div>; }

export function LeadDetails({lead}:{lead:Lead}) { return <section className="rounded-xl border border-[#c7c4d8]/40 bg-white p-6 shadow-sm">
  <div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#4f46e5]/10 text-[#4f46e5]"><Building2 size={22}/></span><div className="min-w-0"><h2 className="truncate text-2xl font-medium tracking-[-.02em]">{lead.businessName}</h2><p className="text-sm text-[#464555]">{emptyValue(lead.segment)}</p></div></div>
  <dl className="mt-6 space-y-4"><IconItem icon={Phone} label="Telefone">{emptyValue(lead.phone)}</IconItem><IconItem icon={Globe2} label="Website & Social"><span className="flex flex-wrap gap-3"><External value={lead.website}/><span className="inline-flex items-center gap-1"><AtSign size={14}/><External instagram value={lead.instagram}/></span></span></IconItem><IconItem icon={MapPin} label="Localização">{[lead.city,lead.state].filter(Boolean).join(", ")||"Não informado"}</IconItem></dl>
  <div className="my-6 border-t border-[#c7c4d8]/30"/>
  <dl className="grid grid-cols-2 gap-4"><Item label="Status"><LeadStatusBadge status={lead.status}/></Item><Item label="Potencial"><SalesPotentialBadge potential={lead.salesPotential}/></Item><Item label="Última atualização">{new Intl.DateTimeFormat("pt-BR").format(lead.updatedAt)}</Item><Item label="Follow-up">{formatDate(lead.followUpDate)}</Item><Item label="Avaliação">{formatRating(lead.rating)} · {formatReviewCount(lead.reviewCount)}</Item><Item label="Resposta">{lead.response?responseLabels[lead.response]:"Não informado"}</Item></dl>
  <div className="mt-6"><p className="text-xs font-medium tracking-[.02em] text-[#464555]">Notas</p><p className="mt-2 rounded-lg border border-[#c7c4d8]/20 bg-[#f3f4f5] p-3 text-sm leading-6">{emptyValue(lead.notes)}</p></div>
</section>; }
