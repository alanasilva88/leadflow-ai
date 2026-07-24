import type { NormalizedImportLead } from "@/types/lead-import";
import { comparisonText } from "@/lib/utils/normalize-text";
export function duplicateKeys(lead: NormalizedImportLead) {
  const phone = lead.phone?.replace(/\D/g, "");
  return [
    phone && `p:${phone}`,
    lead.website && `w:${lead.website.toLowerCase()}`,
    lead.instagram && `i:${lead.instagram.toLowerCase()}`,
    lead.city &&
      `n:${comparisonText(lead.businessName)}|${comparisonText(lead.city)}`,
  ].filter((v): v is string => Boolean(v));
}
export function detectFileDuplicates(leads: NormalizedImportLead[]) {
  const seen = new Set<string>();
  const duplicates = new Set<number>();
  for (const lead of leads) {
    const keys = duplicateKeys(lead);
    if (keys.some((k) => seen.has(k))) duplicates.add(lead.rowNumber);
    else keys.forEach((k) => seen.add(k));
  }
  return duplicates;
}
