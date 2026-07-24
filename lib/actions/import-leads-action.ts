"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { duplicateKeys } from "@/lib/import/detect-file-duplicates";
import { finalImportRequestSchema } from "@/lib/validations/lead-import-schema";
import type { ImportResult, NormalizedImportLead } from "@/types/lead-import";

async function databaseDuplicate(lead: NormalizedImportLead) {
  const candidates = await prisma.lead.findMany({
    where: {
      OR: [
        ...(lead.phone ? [{ phone: lead.phone }] : []),
        ...(lead.website ? [{ website: lead.website }] : []),
        ...(lead.instagram ? [{ instagram: lead.instagram }] : []),
        { businessName: lead.businessName, city: lead.city },
      ],
    },
    select: {
      businessName: true,
      phone: true,
      website: true,
      instagram: true,
      city: true,
    },
  });
  const keys = new Set(duplicateKeys(lead));
  return candidates.some((candidate) =>
    duplicateKeys({ ...lead, ...candidate, rowNumber: lead.rowNumber }).some(
      (key) => keys.has(key),
    ),
  );
}
export async function analyzeDatabaseDuplicates(
  input: unknown,
): Promise<number[]> {
  const parsed = finalImportRequestSchema.safeParse(input);
  if (!parsed.success) return [];
  const duplicateRows: number[] = [];
  for (const row of parsed.data.rows)
    if (await databaseDuplicate(row)) duplicateRows.push(row.rowNumber);
  return duplicateRows;
}
export async function importLeads(input: unknown): Promise<ImportResult> {
  const parsed = finalImportRequestSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      totalRows: 0,
      imported: 0,
      invalid: 0,
      duplicateFile: 0,
      duplicateDatabase: 0,
      ignored: 0,
      issues: [],
      message: "Os dados enviados são inválidos.",
    };
  const rows = parsed.data.rows;
  const seen = new Set<string>();
  const valid: NormalizedImportLead[] = [];
  const issues: ImportResult["issues"] = [];
  let duplicateFile = 0;
  let duplicateDatabase = 0;
  for (const row of rows) {
    const keys = duplicateKeys(row);
    if (keys.some((key) => seen.has(key))) {
      duplicateFile++;
      issues.push({
        rowNumber: row.rowNumber,
        businessName: row.businessName,
        message: "Duplicado dentro do arquivo.",
        severity: "warning",
      });
      continue;
    }
    keys.forEach((key) => seen.add(key));
    if (await databaseDuplicate(row)) {
      duplicateDatabase++;
      issues.push({
        rowNumber: row.rowNumber,
        businessName: row.businessName,
        message: "Lead já existente no banco.",
        severity: "warning",
      });
      continue;
    }
    valid.push(row);
  }
  const created = await prisma.$transaction(
    valid.map((row) => {
      const data = {
        businessName: row.businessName,
        phone: row.phone,
        instagram: row.instagram,
        website: row.website,
        rating: row.rating,
        reviewCount: row.reviewCount,
        segment: row.segment,
        city: row.city,
        salesPotential: row.salesPotential,
        status: row.status,
      };
      return prisma.lead.create({ data, select: { id: true } });
    }),
  );
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return {
    success: true,
    totalRows: rows.length,
    imported: created.length,
    invalid: 0,
    duplicateFile,
    duplicateDatabase,
    ignored: duplicateFile + duplicateDatabase,
    issues,
    importedLeadIds: created.map((v) => v.id),
    importedAt: new Date().toISOString(),
  };
}
