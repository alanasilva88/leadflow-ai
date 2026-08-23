import "server-only";
import type { Lead } from "@prisma/client";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIConfig } from "./client";
import { leadAIAnalysisSchema } from "./lead-analysis-schema";
import { buildLeadAnalysisInput, LEAD_ANALYSIS_SYSTEM_PROMPT } from "./prompts";
import type { WebsiteSignals } from "@/lib/website/website-types";

export async function analyzeLeadWithOpenAI(
  lead: Lead,
  website: WebsiteSignals | null,
) {
  const { client, model } = getOpenAIConfig();
  const response = await client.responses.parse({
    model,
    input: [
      { role: "system", content: LEAD_ANALYSIS_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify(buildLeadAnalysisInput(lead, website)),
      },
    ],
    text: { format: zodTextFormat(leadAIAnalysisSchema, "lead_analysis") },
  });
  if (!response.output_parsed)
    throw new Error("A OpenAI não retornou uma análise válida.");
  return {
    analysis: leadAIAnalysisSchema.parse(response.output_parsed),
    model,
  };
}
