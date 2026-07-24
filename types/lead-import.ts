import type { LeadStatus, SalesPotential } from "@prisma/client";

export const importFields = [
  "businessName",
  "phone",
  "instagram",
  "website",
  "rating",
  "reviewCount",
  "segment",
  "city",
  "salesPotential",
  "status",
  "ignore",
] as const;
export type ImportField = (typeof importFields)[number];
export type ColumnMapping = Record<string, ImportField>;
export type ImportRowIssue = {
  rowNumber: number;
  businessName?: string;
  field?: string;
  message: string;
  severity: "error" | "warning";
};
export type NormalizedImportLead = {
  rowNumber: number;
  businessName: string;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  segment: string | null;
  city: string | null;
  salesPotential: SalesPotential;
  status: LeadStatus;
};
export type ImportPreviewRow = {
  rowNumber: number;
  raw: Record<string, unknown>;
  normalized?: NormalizedImportLead;
  state: "VALID" | "INVALID" | "DUPLICATE_FILE" | "DUPLICATE_DATABASE";
  issues: ImportRowIssue[];
};
export type ImportResult = {
  totalRows: number;
  imported: number;
  invalid: number;
  duplicateFile: number;
  duplicateDatabase: number;
  ignored: number;
  issues: ImportRowIssue[];
  importedLeadIds?: string[];
  importedAt?: string;
  success: boolean;
  message?: string;
};
