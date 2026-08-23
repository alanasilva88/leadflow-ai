"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { analyzeLeadWithOpenAI } from "@/lib/openai/analyze-lead";
import {
  analysisPreviewSchema,
  saveLeadAnalysisSchema,
} from "@/lib/openai/lead-analysis-schema";
import { fetchPublicWebsite } from "@/lib/website/fetch-public-website";
import { requireSession } from "@/lib/auth/session";

const requestSchema = z.object({
  leadId: z.string().cuid(),
  force: z.boolean().default(false),
});
export type AnalysisActionResult =
  | {
      success: true;
      analysisId: string;
      preview: z.infer<typeof analysisPreviewSchema>;
      reused: boolean;
    }
  | { success: false; message: string };

function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("chave") || message.includes("modelo")) return message;
  if (/rate.?limit|429/i.test(message))
    return "O limite de requisições da OpenAI foi atingido. Tente novamente mais tarde.";
  if (/quota|billing|insufficient/i.test(message))
    return "A conta da OpenAI não possui saldo ou faturamento disponível.";
  if (/timeout|timed out|abort/i.test(message))
    return "A análise demorou mais que o esperado. Tente novamente.";
  return "Não foi possível concluir a análise com IA. Tente novamente.";
}

function storedPreview(row: {
  salesPotential: "HIGH" | "MEDIUM" | "LOW" | null;
  websiteScore: number | null;
  mainOpportunity: string | null;
  evidence: Prisma.JsonValue;
  suggestedSolution: string | null;
  recommendedService:
    | "LANDING_PAGE"
    | "INSTITUTIONAL_SITE"
    | "CHATBOT"
    | "SCHEDULING_SYSTEM"
    | "CUSTOM_SYSTEM"
    | "DIGITAL_PRESENCE_REVIEW"
    | null;
  approachMessage: string | null;
  followUpMessage: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  model: string | null;
  sourceWebsite: string | null;
  websiteCheckedAt: Date | null;
}) {
  return analysisPreviewSchema.safeParse({
    ...row,
    websiteCheckedAt: row.websiteCheckedAt?.toISOString() ?? null,
    websiteWarnings: [],
    evidence: row.evidence,
  });
}

export async function analyzeLeadAction(
  input: unknown,
): Promise<AnalysisActionResult> {
  await requireSession();
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Lead inválido." };
  const lead = await prisma.lead.findUnique({
    where: { id: parsed.data.leadId },
  });
  if (!lead) return { success: false, message: "Lead não encontrado." };
  const latest = await prisma.leadAnalysis.findFirst({
    where: { leadId: lead.id, status: "COMPLETED" },
    orderBy: { analyzedAt: "desc" },
  });
  if (latest && !parsed.data.force) {
    const result = storedPreview(latest);
    if (result.success)
      return {
        success: true,
        analysisId: latest.id,
        preview: result.data,
        reused: true,
      };
  }
  const pending = await prisma.leadAnalysis.findFirst({
    where: { leadId: lead.id, status: "PENDING" },
  });
  if (pending)
    return {
      success: false,
      message: "Já existe uma análise em andamento para este lead.",
    };
  const job = await prisma.leadAnalysis.create({
    data: { leadId: lead.id, status: "PENDING" },
  });
  try {
    const website = await fetchPublicWebsite(lead.website);
    const result = await analyzeLeadWithOpenAI(lead, website.signals);
    const preview = analysisPreviewSchema.parse({
      ...result.analysis,
      model: result.model,
      sourceWebsite: website.signals?.url ?? null,
      websiteCheckedAt: website.checkedAt,
      websiteWarnings: website.warnings,
    });
    await prisma.leadAnalysis.update({
      where: { id: job.id },
      data: {
        salesPotential: preview.salesPotential,
        websiteScore: preview.websiteScore,
        mainOpportunity: preview.mainOpportunity,
        evidence: preview.evidence,
        suggestedSolution: preview.suggestedSolution,
        recommendedService: preview.recommendedService,
        approachMessage: preview.approachMessage,
        followUpMessage: preview.followUpMessage,
        confidence: preview.confidence,
        model: preview.model,
        sourceWebsite: preview.sourceWebsite,
        websiteCheckedAt: preview.websiteCheckedAt
          ? new Date(preview.websiteCheckedAt)
          : null,
      },
    });
    return { success: true, analysisId: job.id, preview, reused: false };
  } catch (error) {
    const message = safeError(error);
    console.error("[lead-analysis]", {
      leadId: lead.id,
      stage: "generation",
      errorType: error instanceof Error ? error.name : "unknown",
      date: new Date().toISOString(),
    });
    await prisma.leadAnalysis.update({
      where: { id: job.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return { success: false, message };
  }
}

export async function saveLeadAnalysisAction(input: unknown) {
  await requireSession();
  const parsed = saveLeadAnalysisSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, message: "Revise os campos da análise." };
  const { leadId, analysisId, preview, apply } = parsed.data;
  const exists = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true },
  });
  if (!exists)
    return { success: false as const, message: "Lead não encontrado." };
  const analysis = await prisma.leadAnalysis.findFirst({
    where: { id: analysisId, leadId },
  });
  if (!analysis)
    return { success: false as const, message: "Análise não encontrada." };
  const leadUpdate: Prisma.LeadUpdateInput = {};
  if (apply.salesPotential) leadUpdate.salesPotential = preview.salesPotential;
  if (apply.websiteScore && preview.websiteScore !== null)
    leadUpdate.websiteScore = preview.websiteScore;
  if (apply.mainProblem) leadUpdate.mainProblem = preview.mainOpportunity;
  if (apply.suggestedSolution)
    leadUpdate.suggestedSolution = preview.suggestedSolution;
  if (apply.personalizedMessage)
    leadUpdate.personalizedMessage = preview.approachMessage;
  try {
    await prisma.$transaction([
      prisma.leadAnalysis.update({
        where: { id: analysisId },
        data: {
          status: "COMPLETED",
          salesPotential: preview.salesPotential,
          websiteScore: preview.websiteScore,
          mainOpportunity: preview.mainOpportunity,
          evidence: preview.evidence,
          suggestedSolution: preview.suggestedSolution,
          recommendedService: preview.recommendedService,
          approachMessage: preview.approachMessage,
          followUpMessage: preview.followUpMessage,
          confidence: preview.confidence,
          model: preview.model,
          sourceWebsite: preview.sourceWebsite,
          websiteCheckedAt: preview.websiteCheckedAt
            ? new Date(preview.websiteCheckedAt)
            : null,
          analyzedAt: new Date(),
          errorMessage: null,
        },
      }),
      prisma.lead.update({ where: { id: leadId }, data: leadUpdate }),
    ]);
    revalidatePath("/dashboard");
    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    return { success: true as const, message: "Análise salva com sucesso." };
  } catch {
    return {
      success: false as const,
      message: "Não foi possível salvar a análise.",
    };
  }
}

export async function cancelLeadAnalysisAction(input: unknown) {
  await requireSession();
  const parsed = z
    .object({ leadId: z.string().cuid(), analysisId: z.string().cuid() })
    .safeParse(input);
  if (!parsed.success) return;
  await prisma.leadAnalysis.updateMany({
    where: {
      id: parsed.data.analysisId,
      leadId: parsed.data.leadId,
      status: "PENDING",
    },
    data: {
      status: "FAILED",
      errorMessage: "Prévia cancelada antes do salvamento.",
    },
  });
  revalidatePath(`/leads/${parsed.data.leadId}`);
}
