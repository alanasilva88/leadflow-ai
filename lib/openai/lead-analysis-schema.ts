import { z } from "zod";

export const evidenceSchema = z.object({
  description: z.string().trim().min(1).max(240),
  source: z.enum([
    "LEAD_DATA",
    "WEBSITE",
    "MANUAL_DIAGNOSIS",
    "INSUFFICIENT_DATA",
  ]),
});

export const leadAIAnalysisSchema = z.object({
  salesPotential: z.enum(["HIGH", "MEDIUM", "LOW"]),
  websiteScore: z.number().int().min(0).max(10).nullable(),
  mainOpportunity: z.string().trim().min(1).max(300),
  evidence: z.array(evidenceSchema).max(6),
  suggestedSolution: z.string().trim().min(1).max(450),
  recommendedService: z.enum([
    "LANDING_PAGE",
    "INSTITUTIONAL_SITE",
    "CHATBOT",
    "SCHEDULING_SYSTEM",
    "CUSTOM_SYSTEM",
    "DIGITAL_PRESENCE_REVIEW",
  ]),
  approachMessage: z.string().trim().min(1).max(550),
  followUpMessage: z.string().trim().min(1).max(400),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const analysisPreviewSchema = leadAIAnalysisSchema.extend({
  model: z.string().trim().min(1).max(100),
  sourceWebsite: z.string().url().nullable(),
  websiteCheckedAt: z.string().datetime().nullable(),
  websiteWarnings: z.array(z.string().max(240)).max(6),
});

export const saveLeadAnalysisSchema = z.object({
  leadId: z.string().cuid(),
  analysisId: z.string().cuid(),
  preview: analysisPreviewSchema,
  apply: z.object({
    salesPotential: z.boolean(),
    websiteScore: z.boolean(),
    mainProblem: z.boolean(),
    suggestedSolution: z.boolean(),
    personalizedMessage: z.boolean(),
  }),
});

export type LeadAIAnalysis = z.infer<typeof leadAIAnalysisSchema>;
export type AnalysisPreview = z.infer<typeof analysisPreviewSchema>;
