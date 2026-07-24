import { LeadStatus, SalesPotential } from "@prisma/client";
import type {
  ColumnMapping,
  ImportRowIssue,
  NormalizedImportLead,
} from "@/types/lead-import";
import { normalizeInstagram } from "@/lib/utils/normalize-instagram";
import { normalizePhone } from "@/lib/utils/normalize-phone";
import { comparisonText, normalizeText } from "@/lib/utils/normalize-text";
import { normalizeUrl } from "@/lib/utils/normalize-url";

export function parseRating(value: unknown): number | null {
  const match = normalizeText(value)
    ?.replace(",", ".")
    .match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const number = Number(match[0]);
  return number >= 0 && number <= 5 ? number : null;
}
export function parseReviewCount(value: unknown): number | null {
  const text = normalizeText(value)?.replace(/[^\d.,]/g, "");
  if (!text) return null;
  if (/^\d{1,3}([.,]\d{3})+$/.test(text))
    return Number(text.replace(/[.,]/g, ""));
  if (/^\d+$/.test(text)) return Number(text);
  return null;
}
export function parsePotential(value: unknown): SalesPotential {
  const text = comparisonText(value);
  if (["alta", "high"].includes(text)) return SalesPotential.HIGH;
  if (["baixa", "low"].includes(text)) return SalesPotential.LOW;
  return SalesPotential.MEDIUM;
}
const statusMap: Record<string, LeadStatus> = {
  novo: LeadStatus.NEW,
  new: LeadStatus.NEW,
  analisado: LeadStatus.ANALYZED,
  analyzed: LeadStatus.ANALYZED,
  contatado: LeadStatus.CONTACTED,
  contacted: LeadStatus.CONTACTED,
  respondeu: LeadStatus.RESPONDED,
  responded: LeadStatus.RESPONDED,
  "follow up": LeadStatus.FOLLOW_UP,
  acompanhamento: LeadStatus.FOLLOW_UP,
  reuniao: LeadStatus.MEETING,
  meeting: LeadStatus.MEETING,
  proposta: LeadStatus.PROPOSAL,
  proposal: LeadStatus.PROPOSAL,
  fechado: LeadStatus.CLOSED,
  closed: LeadStatus.CLOSED,
  perdido: LeadStatus.LOST,
  lost: LeadStatus.LOST,
};
export function parseStatus(value: unknown): LeadStatus {
  const text = comparisonText(value).replace("_", " ");
  return (
    statusMap[text] ??
    (Object.values(LeadStatus).includes(value as LeadStatus)
      ? (value as LeadStatus)
      : LeadStatus.NEW)
  );
}
export function normalizeImportRow(
  raw: Record<string, unknown>,
  mapping: ColumnMapping,
  rowNumber: number,
) {
  const get = (field: string) =>
    raw[Object.keys(mapping).find((h) => mapping[h] === field) ?? ""];
  const issues: ImportRowIssue[] = [];
  const name = normalizeText(get("businessName"));
  if (!name || name.length < 2)
    issues.push({
      rowNumber,
      field: "businessName",
      message: "Informe um nome do negócio com pelo menos 2 caracteres.",
      severity: "error",
    });
  const phone = normalizePhone(get("phone"));
  const website = normalizeUrl(get("website"));
  const instagram = normalizeInstagram(get("instagram"));
  for (const [field, warning] of [
    ["phone", phone.warning],
    ["website", website.warning],
    ["instagram", instagram.warning],
  ] as const)
    if (warning)
      issues.push({
        rowNumber,
        businessName: name ?? undefined,
        field,
        message: warning,
        severity: "warning",
      });
  const rawRating = get("rating");
  const rating = parseRating(rawRating);
  if (normalizeText(rawRating) && rating == null)
    issues.push({
      rowNumber,
      businessName: name ?? undefined,
      field: "rating",
      message: "Nota inválida; o campo foi ignorado.",
      severity: "warning",
    });
  const rawCount = get("reviewCount");
  const reviewCount = parseReviewCount(rawCount);
  if (normalizeText(rawCount) && reviewCount == null)
    issues.push({
      rowNumber,
      businessName: name ?? undefined,
      field: "reviewCount",
      message:
        "Número de avaliações ambíguo ou inválido; o campo foi ignorado.",
      severity: "warning",
    });
  if (!name || name.length < 2) return { lead: null, issues };
  const lead: NormalizedImportLead = {
    rowNumber,
    businessName: name.slice(0, 120),
    phone: phone.value,
    website: website.value,
    instagram: instagram.value,
    rating,
    reviewCount,
    segment: normalizeText(get("segment")),
    city: normalizeText(get("city")),
    salesPotential: parsePotential(get("salesPotential")),
    status: parseStatus(get("status")),
  };
  return { lead, issues };
}
