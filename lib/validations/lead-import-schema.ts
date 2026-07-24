import { LeadStatus, SalesPotential } from "@prisma/client";
import { z } from "zod";
import { MAX_ROWS } from "@/lib/import/import-constants";
import { importFields } from "@/types/lead-import";

export const columnMappingSchema = z
  .record(z.string().min(1).max(200), z.enum(importFields))
  .refine(
    (mapping) =>
      Object.values(mapping).filter((v) => v === "businessName").length === 1,
    "Mapeie exatamente uma coluna para Nome do negócio.",
  )
  .refine((mapping) => {
    const selected = Object.values(mapping).filter((v) => v !== "ignore");
    return new Set(selected).size === selected.length;
  }, "Um campo não pode ser associado a mais de uma coluna.");
export const normalizedImportLeadSchema = z
  .object({
    rowNumber: z
      .number()
      .int()
      .min(2)
      .max(MAX_ROWS + 100),
    businessName: z.string().trim().min(2).max(120),
    phone: z.string().max(50).nullable(),
    instagram: z.string().url().max(300).nullable(),
    website: z.string().url().max(500).nullable(),
    rating: z.number().min(0).max(5).nullable(),
    reviewCount: z.number().int().min(0).nullable(),
    segment: z.string().max(120).nullable(),
    city: z.string().max(120).nullable(),
    salesPotential: z.enum(SalesPotential),
    status: z.enum(LeadStatus),
  })
  .strict();
export const finalImportRequestSchema = z
  .object({ rows: z.array(normalizedImportLeadSchema).max(MAX_ROWS) })
  .strict();
