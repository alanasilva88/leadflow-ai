import type { ColumnMapping, ImportField } from "@/types/lead-import";
import { normalizeHeader } from "@/lib/utils/normalize-text";
const aliases: Record<Exclude<ImportField, "ignore">, string[]> = {
  businessName: [
    "name",
    "nome",
    "business name",
    "businessname",
    "nome do negocio",
    "empresa",
    "clinica",
    "title",
  ],
  phone: [
    "phone",
    "telefone",
    "telephone",
    "whatsapp",
    "celular",
    "contato",
    "phone number",
  ],
  instagram: [
    "instagram",
    "insta",
    "instagram url",
    "perfil instagram",
    "social",
  ],
  website: ["site", "website", "url", "pagina", "link do site", "web"],
  rating: ["stars", "star", "rating", "nota", "avaliacao", "nota de avaliacao"],
  reviewCount: [
    "reviews",
    "review count",
    "avaliacoes",
    "numero de avaliacoes",
    "total reviews",
    "quantidade de avaliacoes",
  ],
  segment: ["segmento", "category", "categoria", "niche", "nicho", "tipo"],
  city: ["city", "cidade", "municipio", "location", "localidade"],
  salesPotential: [
    "potencial",
    "potencial de venda",
    "sales potential",
    "priority",
    "prioridade",
  ],
  status: ["status", "situacao", "etapa", "stage"],
};
export function detectColumn(header: string): ImportField {
  const normalized = normalizeHeader(header);
  return (
    (Object.entries(aliases).find(([, values]) =>
      values.some((v) => normalizeHeader(v) === normalized),
    )?.[0] as ImportField) ?? "ignore"
  );
}
export function suggestMapping(headers: string[]): ColumnMapping {
  const used = new Set<ImportField>();
  return Object.fromEntries(
    headers.map((h) => {
      const field = detectColumn(h);
      if (field !== "ignore" && used.has(field)) return [h, "ignore"];
      used.add(field);
      return [h, field];
    }),
  );
}
